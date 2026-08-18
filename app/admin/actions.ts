"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroyAdminSession, requireAdmin } from "@/lib/auth";
import { db, getSiteContent, updateSiteContent, writeAuditLog } from "@/lib/db";
import { dispatchLeadNotifications } from "@/lib/notifications";
import crypto from "node:crypto";

const text = (form: FormData, key: string) => String(form.get(key) || "").trim();

export async function logoutAction() {
  writeAuditLog("logout", "admin");
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function saveSiteAction(form: FormData) {
  await requireAdmin();
  const current = getSiteContent();
  const next = {
    ...current,
    siteName: text(form, "siteName") || current.siteName,
    hero: {
      ...current.hero,
      eyebrow: text(form, "heroEyebrow"), title: text(form, "heroTitle"),
      description: text(form, "heroDescription"), primaryCtaLabel: text(form, "primaryCtaLabel"),
      secondaryCtaLabel: text(form, "secondaryCtaLabel"),
    },
    product: {
      ...current.product,
      eyebrow: text(form, "productEyebrow"), title: text(form, "productTitle"),
      description: text(form, "productDescription"),
      values: current.product.values.map((value, index) => ({
        ...value, label: text(form, `valueLabel${index}`), title: text(form, `valueTitle${index}`),
        description: text(form, `valueDescription${index}`),
      })),
    },
    cases: {
      eyebrow: text(form, "casesEyebrow"), title: text(form, "casesTitle"), description: text(form, "casesDescription"),
    },
    contact: {
      ...current.contact,
      eyebrow: text(form, "contactEyebrow"), title: text(form, "contactTitle"),
      description: text(form, "contactDescription"), phone: text(form, "contactPhone"),
      email: text(form, "contactEmail"), responseSlaText: text(form, "responseSlaText"),
      successText: text(form, "successText"),
    },
    footer: {
      icp: text(form, "icp"), copyrightOwner: text(form, "copyrightOwner"),
    },
  };
  updateSiteContent(next);
  writeAuditLog("site_content_published", "site", "1");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=site#content");
}

export async function saveCaseAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const values = {
    discipline: text(form, "discipline"), teamScale: text(form, "teamScale"),
    description: text(form, "description"), coverUrl: text(form, "coverUrl"),
    coverAlt: text(form, "coverAlt"), url: text(form, "url"),
    sortOrder: Number(form.get("sortOrder") || 0), enabled: form.get("enabled") ? 1 : 0,
  };
  if (!values.discipline || !values.teamScale || !values.coverUrl || !values.coverAlt || !/^https?:\/\//.test(values.url)) {
    redirect("/admin?error=case#cases");
  }
  if (id) {
    db.prepare(`UPDATE demo_cases SET discipline=@discipline, team_scale=@teamScale, description=@description,
      cover_url=@coverUrl, cover_alt=@coverAlt, url=@url, sort_order=@sortOrder, enabled=@enabled,
      updated_at=CURRENT_TIMESTAMP WHERE id=@id`).run({ ...values, id });
    writeAuditLog("case_updated", "case", String(id), values.discipline);
  } else {
    const result = db.prepare(`INSERT INTO demo_cases (discipline, team_scale, description, cover_url, cover_alt, url, sort_order, enabled)
      VALUES (@discipline, @teamScale, @description, @coverUrl, @coverAlt, @url, @sortOrder, @enabled)`).run(values);
    writeAuditLog("case_created", "case", String(result.lastInsertRowid), values.discipline);
  }
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?saved=case#cases");
}

export async function deleteCaseAction(form: FormData) {
  await requireAdmin();
  db.prepare("DELETE FROM demo_cases WHERE id = ?").run(Number(form.get("id")));
  writeAuditLog("case_deleted", "case", String(form.get("id") || ""));
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?saved=deleted#cases");
}

export async function updateLeadStatusAction(form: FormData) {
  await requireAdmin();
  const status = text(form, "status");
  if (!["new", "contacted", "closed"].includes(status)) return;
  db.prepare("UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, Number(form.get("id")));
  writeAuditLog("lead_status_updated", "lead", String(form.get("id") || ""), status);
  revalidatePath("/admin");
  redirect("/admin?saved=lead#leads");
}

export async function retryLeadNotificationAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const channel = text(form, "channel");
  if (!channel) redirect("/admin?error=notification-channel#leads");
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as {
    school: string; department: string; name: string; contact: string; message: string; source: string;
  } | undefined;
  if (!row) redirect("/admin?error=lead-not-found#leads");
  await dispatchLeadNotifications(id, {
    ...row, website: "", submissionKey: crypto.randomUUID(), utmSource: undefined, utmMedium: undefined, utmCampaign: undefined,
  }, channel);
  revalidatePath("/admin");
  redirect("/admin?saved=notification#leads");
}
