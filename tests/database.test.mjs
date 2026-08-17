import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

const schema = fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

test("database schema supports ordered case reads", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(schema);
  const insert = db.prepare(`INSERT INTO demo_cases
    (discipline, team_scale, description, cover_url, cover_alt, url, sort_order, enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  insert.run("材料学", "小型课题组", "案例", "/cover.webp", "材料学封面", "https://example.test/2", 2, 1);
  insert.run("生命科学", "大型研究团队", "案例", "/cover.webp", "生命科学封面", "https://example.test/1", 1, 1);
  const cases = db.prepare("SELECT discipline FROM demo_cases WHERE enabled=1 ORDER BY sort_order").all();
  assert.deepEqual(cases.map((item) => item.discipline), ["生命科学", "材料学"]);
  db.close();
});

test("lead persistence enforces required data and duplicate submission protection", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(schema);
  const insert = db.prepare(`INSERT INTO leads
    (school, department, name, contact, message, source, submission_key)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  insert.run("某大学", "生命学院", "张老师", "zhang@example.test", "咨询主页", "/", "same-key");
  assert.throws(() => insert.run("某大学", "生命学院", "张老师", "zhang@example.test", "咨询主页", "/", "same-key"));
  assert.throws(() => insert.run(null, "生命学院", "张老师", "zhang@example.test", "咨询主页", "/", "other-key"));
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM leads").get().count, 1);
  db.close();
});
