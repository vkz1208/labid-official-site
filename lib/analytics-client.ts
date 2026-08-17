export type AnalyticsEvent = "case_view" | "contact_cta_click" | "lead_form_start" | "lead_submit_success" | "lead_submit_error";

export function trackEvent(name: AnalyticsEvent) {
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, path: `${window.location.pathname}${window.location.search}` }),
    keepalive: true,
  }).catch(() => undefined);
}
