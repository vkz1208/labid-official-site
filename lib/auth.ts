import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifySessionToken } from "@/lib/auth-core";

export { createSessionToken, verifyCredentials, verifySessionToken } from "@/lib/auth-core";

const COOKIE_NAME = "labid_admin";

export async function createAdminSession(email: string) {
  const token = createSessionToken(email);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 8 * 60 * 60,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : false;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
