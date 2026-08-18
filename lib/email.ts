import nodemailer from "nodemailer";
import type { LeadInput } from "@/lib/validation";

export async function sendLeadEmail(lead: LeadInput, destination: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!host || !user || !password) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP configuration is incomplete");
    console.info("Lead saved; SMTP is not configured in local development.");
    return { skipped: true };
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass: password },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to: destination,
    subject: `[LabID 官网咨询] ${lead.school} - ${lead.name}`,
    text: [
      `提交时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
      `学校：${lead.school}`, `院系：${lead.department}`, `姓名：${lead.name}`,
      `联系方式：${lead.contact}`, `留言：${lead.message}`, `来源：${lead.source}`,
    ].join("\n"),
  });
  return { skipped: false };
}
