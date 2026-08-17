import test from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_EMAIL = "admin@example.test";
process.env.ADMIN_PASSWORD = "correct-password";
process.env.ADMIN_SESSION_SECRET = "test-session-secret-with-enough-entropy";

const { createSessionToken, verifyCredentials, verifySessionToken } = await import("../lib/auth-core.ts");

test("CMS credentials require exact email and password", () => {
  assert.equal(verifyCredentials("admin@example.test", "correct-password"), true);
  assert.equal(verifyCredentials("admin@example.test", "wrong-password"), false);
  assert.equal(verifyCredentials("other@example.test", "correct-password"), false);
});

test("CMS session accepts signed tokens and rejects tampering or expiry", () => {
  const now = Date.now();
  const token = createSessionToken("admin@example.test", now);
  assert.equal(verifySessionToken(token, now + 1_000), true);
  assert.equal(verifySessionToken(`${token}tampered`, now + 1_000), false);
  assert.equal(verifySessionToken(token, now + 9 * 60 * 60 * 1000), false);
});
