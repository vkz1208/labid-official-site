import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { defaultCases, defaultSiteContent } from "@/lib/default-content";
import type { AuditLog, DemoCase, Lead, SiteContent } from "@/lib/types";

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH)
  : path.join(process.cwd(), "data", "labid.db");
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const globalForDb = globalThis as unknown as { labidDb?: DatabaseSync };
export const db = globalForDb.labidDb ?? new DatabaseSync(databasePath);
if (process.env.NODE_ENV !== "production") globalForDb.labidDb = db;

db.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS demo_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discipline TEXT NOT NULL,
      team_scale TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      cover_url TEXT NOT NULL,
      cover_alt TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      school TEXT NOT NULL,
      department TEXT NOT NULL,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
      source TEXT NOT NULL DEFAULT '/',
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      submission_key TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE TABLE IF NOT EXISTS lead_deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      channel TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (lead_id, channel, destination)
    );
    CREATE INDEX IF NOT EXISTS idx_lead_deliveries_lead ON lead_deliveries(lead_id, channel);
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_analytics_name_created ON analytics_events(name, created_at DESC);
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL DEFAULT '',
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
  `);

  const ensureLeadColumn = (name: string, sql: string) => {
    const columns = new Set((db.prepare("PRAGMA table_info(leads)").all() as Array<{ name: string }>).map((column) => column.name));
    if (columns.has(name)) return;
    try {
      db.exec(sql);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("duplicate column name")) throw error;
    }
  };
  ensureLeadColumn("email_status", "ALTER TABLE leads ADD COLUMN email_status TEXT NOT NULL DEFAULT 'pending'");
  ensureLeadColumn("email_attempts", "ALTER TABLE leads ADD COLUMN email_attempts INTEGER NOT NULL DEFAULT 0");
  ensureLeadColumn("last_email_error", "ALTER TABLE leads ADD COLUMN last_email_error TEXT NOT NULL DEFAULT ''");

  db.prepare("INSERT OR IGNORE INTO site_settings (id, content) VALUES (1, ?)").run(
    JSON.stringify(defaultSiteContent),
  );

  // Update only unchanged seed copy. Content customized in the CMS remains untouched.
  const siteRow = db.prepare("SELECT content FROM site_settings WHERE id = 1").get() as { content: string };
  const siteContent = JSON.parse(siteRow.content) as SiteContent;
  let siteContentChanged = false;
  if (siteContent.hero.title === "让每一项研究，\n成为清晰的学术叙事。") {
    siteContent.hero.title = defaultSiteContent.hero.title;
    siteContentChanged = true;
  }
  if (siteContent.product.title === "不是把成果搬上网页，\n而是把研究讲清楚。") {
    siteContent.product.title = defaultSiteContent.product.title;
    siteContentChanged = true;
  }
  if (siteContent.product.title === "不是把成果搬上网页，而是把研究讲清楚。") {
    siteContent.product.title = defaultSiteContent.product.title;
    siteContentChanged = true;
  }
  if (siteContent.cases.title === "不同学科，\n同样清楚的表达。") {
    siteContent.cases.title = defaultSiteContent.cases.title;
    siteContentChanged = true;
  }
  if (siteContent.cases.title === "不同学科，同样清楚的表达。") {
    siteContent.cases.title = defaultSiteContent.cases.title;
    siteContentChanged = true;
  }
  if (siteContent.cases.description === "三个虚拟案例展示 LabID 如何适配不同研究领域与团队规模。") {
    siteContent.cases.description = defaultSiteContent.cases.description;
    siteContentChanged = true;
  }
  if (siteContent.contact.title === "让团队的研究，\n被更准确地看见。") {
    siteContent.contact.title = defaultSiteContent.contact.title;
    siteContentChanged = true;
  }
  if (siteContent.contact.responseSlaText === "提交后，LabID 官方将在 48 小时内与你联系。") {
    siteContent.contact.responseSlaText = defaultSiteContent.contact.responseSlaText;
    siteContentChanged = true;
  }
  if (siteContent.contact.successText === "信息已提交。LabID 官方将在 48 小时内与你联系。") {
    siteContent.contact.successText = defaultSiteContent.contact.successText;
    siteContentChanged = true;
  }
  if (siteContentChanged) {
    db.prepare("UPDATE site_settings SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(
      JSON.stringify(siteContent),
    );
  }

  const count = db.prepare("SELECT COUNT(*) AS count FROM demo_cases").get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO demo_cases
      (discipline, team_scale, description, cover_url, cover_alt, url, sort_order, enabled)
      VALUES (@discipline, @teamScale, @description, @coverUrl, @coverAlt, @url, @sortOrder, 1)
    `);
    db.exec("BEGIN");
    try {
      defaultCases.forEach((item) => insert.run(item));
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  // Replace only the original placeholder covers. CMS-uploaded or custom URLs stay untouched.
  const migrateCover = db.prepare("UPDATE demo_cases SET cover_url = ? WHERE cover_url = ?");
  migrateCover.run("/case-life.png", "/case-life.svg");
  migrateCover.run("/case-chem.png", "/case-chem.svg");
  migrateCover.run("/case-materials.png", "/case-materials.svg");
}

initializeDatabase();

export function getSiteContent(): SiteContent {
  const row = db.prepare("SELECT content FROM site_settings WHERE id = 1").get() as { content: string };
  return JSON.parse(row.content) as SiteContent;
}

export function updateSiteContent(content: SiteContent) {
  db.prepare("UPDATE site_settings SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(
    JSON.stringify(content),
  );
}

type CaseRow = {
  id: number; discipline: string; team_scale: string; description: string; cover_url: string;
  cover_alt: string; url: string; sort_order: number; enabled: number; created_at: string; updated_at: string;
};

function mapCase(row: CaseRow): DemoCase {
  return {
    id: row.id, discipline: row.discipline, teamScale: row.team_scale,
    description: row.description, coverUrl: row.cover_url, coverAlt: row.cover_alt,
    url: row.url, sortOrder: row.sort_order, enabled: Boolean(row.enabled),
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export function getCases(includeDisabled = false): DemoCase[] {
  const rows = db.prepare(
    `SELECT * FROM demo_cases ${includeDisabled ? "" : "WHERE enabled = 1"} ORDER BY sort_order, id`,
  ).all() as CaseRow[];
  return rows.map(mapCase);
}

type LeadRow = {
  id: number; school: string; department: string; name: string; contact: string;
  message: string; status: Lead["status"]; source: string; email_status: Lead["emailStatus"];
  email_attempts: number; last_email_error: string; created_at: string; updated_at: string;
};

export function getLeads(): Lead[] {
  return (db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as LeadRow[]).map((row) => ({
    id: row.id, school: row.school, department: row.department, name: row.name,
    contact: row.contact, message: row.message, status: row.status, source: row.source,
    emailStatus: row.email_status, emailAttempts: row.email_attempts, lastEmailError: row.last_email_error,
    deliveries: (db.prepare("SELECT * FROM lead_deliveries WHERE lead_id=? ORDER BY id").all(row.id) as Array<{
      id: number; channel: string; destination: string; status: "pending" | "sent" | "failed";
      attempts: number; last_error: string;
    }>).map((delivery) => ({
      id: delivery.id, channel: delivery.channel, destination: delivery.destination,
      status: delivery.status, attempts: delivery.attempts, lastError: delivery.last_error,
    })),
    createdAt: row.created_at, updatedAt: row.updated_at,
  }));
}

export function writeAuditLog(action: string, entityType: string, entityId = "", detail = "") {
  db.prepare("INSERT INTO audit_logs (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)")
    .run(action, entityType, entityId, detail.slice(0, 1000));
}

export function getAuditLogs(limit = 20): AuditLog[] {
  const rows = db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?").all(limit) as Array<{
    id: number; action: string; entity_type: string; entity_id: string; detail: string; created_at: string;
  }>;
  return rows.map((row) => ({ id: row.id, action: row.action, entityType: row.entity_type, entityId: row.entity_id, detail: row.detail, createdAt: row.created_at }));
}
