import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

const eventSchema = z.object({
  name: z.enum(["case_view", "contact_cta_click", "lead_form_start", "lead_submit_success", "lead_submit_error"]),
  path: z.string().max(500),
});

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`event:${ip}`, 60, 60 * 60 * 1000).allowed) return new NextResponse(null, { status: 204 });
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "INVALID_EVENT", message: "事件无效。" }, { status: 400 });
  db.prepare("INSERT INTO analytics_events (name, path) VALUES (?, ?)").run(parsed.data.name, parsed.data.path);
  return new NextResponse(null, { status: 204 });
}
