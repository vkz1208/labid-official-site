import test from "node:test";
import assert from "node:assert/strict";
import { leadSchema } from "../lib/validation.ts";
import { checkRateLimit } from "../lib/rate-limit.ts";

const validLead = {
  school: "南方科技大学",
  department: "生命科学学院",
  name: "张老师",
  contact: "zhang@example.edu.cn",
  message: "希望了解课题组主页建设方案。",
  website: "",
  submissionKey: "b606cad2-2e6f-4bc8-a1b1-a6755e32fd62",
  source: "https://www.labid.cn/",
};

test("accepts a complete lead", () => {
  assert.equal(leadSchema.safeParse(validLead).success, true);
});

test("rejects missing fields and honeypot content", () => {
  assert.equal(leadSchema.safeParse({ ...validLead, school: "" }).success, false);
  assert.equal(leadSchema.safeParse({ ...validLead, website: "spam" }).success, false);
});

test("rate limiter blocks requests above the configured limit", () => {
  const key = `test-${Date.now()}`;
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, false);
});
