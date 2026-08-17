import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db, writeAuditLog } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  const limit = checkRateLimit(`lead:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json({ code: "RATE_LIMITED", message: "提交过于频繁，请稍后再试。" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ code: "INVALID_JSON", message: "请求格式无效。" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0] || "form"), issue.message]));
    return NextResponse.json({ code: "VALIDATION_ERROR", message: "请检查填写内容。", fieldErrors }, { status: 400 });
  }
  const lead = parsed.data;
  try {
    const result = db.prepare(`
      INSERT INTO leads (school, department, name, contact, message, source, utm_source, utm_medium, utm_campaign, submission_key)
      VALUES (@school, @department, @name, @contact, @message, @source, @utmSource, @utmMedium, @utmCampaign, @submissionKey)
    `).run({
      school: lead.school,
      department: lead.department,
      name: lead.name,
      contact: lead.contact,
      message: lead.message,
      source: lead.source,
      utmSource: lead.utmSource || null,
      utmMedium: lead.utmMedium || null,
      utmCampaign: lead.utmCampaign || null,
      submissionKey: lead.submissionKey,
    });
    const leadId = Number(result.lastInsertRowid);
    writeAuditLog("lead_created", "lead", String(leadId), `${lead.school} · ${lead.name}`);
    try {
      const delivery = await sendLeadNotification(lead);
      if (delivery.skipped) {
        db.prepare("UPDATE leads SET email_status='failed', email_attempts=1, last_email_error='SMTP is not configured' WHERE id=?").run(leadId);
      } else {
        db.prepare("UPDATE leads SET email_status='sent', email_attempts=1, last_email_error='' WHERE id=?").run(leadId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";
      db.prepare("UPDATE leads SET email_status='failed', email_attempts=1, last_email_error=? WHERE id=?").run(message.slice(0, 500), leadId);
      console.error("Lead email notification failed", { leadId, error });
    }
    return NextResponse.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) return NextResponse.json({ ok: true, duplicate: true });
    console.error("Lead persistence failed", error);
    return NextResponse.json({ code: "PERSISTENCE_ERROR", message: "暂时无法保存信息。你填写的内容仍在页面中，请稍后重试。" }, { status: 500 });
  }
}
