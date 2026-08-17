"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyCredentials } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/db";

export async function loginAction(form: FormData) {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  const limit = checkRateLimit(`admin-login:${ip}:${email.toLowerCase()}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    writeAuditLog("login_rate_limited", "admin", email, `ip=${ip}`);
    redirect("/admin/login?error=rate");
  }
  if (!verifyCredentials(email, password)) {
    writeAuditLog("login_failed", "admin", email, `ip=${ip}`);
    redirect("/admin/login?error=invalid");
  }
  await createAdminSession(email);
  writeAuditLog("login_succeeded", "admin", email, `ip=${ip}`);
  redirect("/admin");
}
