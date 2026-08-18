import { db, writeAuditLog } from "@/lib/db";
import { sendLeadEmail } from "@/lib/email";
import { sendLeadSms } from "@/lib/sms";
import type { LeadInput } from "@/lib/validation";

type Channel = {
  channel: string;
  destination: string;
  send: (lead: LeadInput, destination: string) => Promise<unknown>;
};

export function getLeadNotificationChannels(): Channel[] {
  return [
    { channel: "email", destination: process.env.LEAD_NOTIFICATION_EMAIL || "cmbvicky@163.com", send: sendLeadEmail },
    { channel: "sms", destination: process.env.LEAD_NOTIFICATION_SMS || "18566718921", send: sendLeadSms },
  ];
}

export async function dispatchLeadNotifications(leadId: number, lead: LeadInput, onlyChannel?: string) {
  const channels = getLeadNotificationChannels().filter((item) => !onlyChannel || item.channel === onlyChannel);
  for (const item of channels) {
    db.prepare(`INSERT OR IGNORE INTO lead_deliveries (lead_id, channel, destination) VALUES (?, ?, ?)`)
      .run(leadId, item.channel, item.destination);
    try {
      await item.send(lead, item.destination);
      db.prepare(`UPDATE lead_deliveries SET status='sent', attempts=attempts+1, last_error='', updated_at=CURRENT_TIMESTAMP
        WHERE lead_id=? AND channel=? AND destination=?`).run(leadId, item.channel, item.destination);
      writeAuditLog("lead_notification_sent", "lead", String(leadId), `${item.channel}:${item.destination}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown notification error";
      db.prepare(`UPDATE lead_deliveries SET status='failed', attempts=attempts+1, last_error=?, updated_at=CURRENT_TIMESTAMP
        WHERE lead_id=? AND channel=? AND destination=?`).run(message.slice(0, 500), leadId, item.channel, item.destination);
      writeAuditLog("lead_notification_failed", "lead", String(leadId), `${item.channel}: ${message}`);
      console.error("Lead notification failed", { leadId, channel: item.channel, error });
    }
  }
}
