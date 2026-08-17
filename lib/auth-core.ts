import crypto from "node:crypto";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("ADMIN_SESSION_SECRET is required in production");
  return secret || "local-development-secret-change-before-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function verifyCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;
  const emailA = Buffer.from(email.trim().toLowerCase());
  const emailB = Buffer.from(expectedEmail.trim().toLowerCase());
  const passA = Buffer.from(password);
  const passB = Buffer.from(expectedPassword);
  return emailA.length === emailB.length && passA.length === passB.length &&
    crypto.timingSafeEqual(emailA, emailB) && crypto.timingSafeEqual(passA, passB);
}

export function createSessionToken(email: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email, exp: now + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string, now = Date.now()) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return data.exp > now;
  } catch { return false; }
}
