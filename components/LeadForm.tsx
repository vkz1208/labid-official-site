"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics-client";

type State = { type: "idle" | "loading" | "success" | "error"; message?: string; fields?: Record<string, string> };

export function LeadForm({ successText, responseSlaText }: { successText: string; responseSlaText: string }) {
  const [state, setState] = useState<State>({ type: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const submissionKey = useRef(crypto.randomUUID());
  const started = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "loading" });
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.submissionKey = submissionKey.current;
    payload.source = window.location.href;
    const params = new URLSearchParams(window.location.search);
    payload.utmSource = params.get("utm_source") || "";
    payload.utmMedium = params.get("utm_medium") || "";
    payload.utmCampaign = params.get("utm_campaign") || "";
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        trackEvent("lead_submit_error");
        setState({ type: "error", message: result.message || "提交失败，请检查信息后重试。", fields: result.fieldErrors });
        return;
      }
      formRef.current?.reset();
      submissionKey.current = crypto.randomUUID();
      setState({ type: "success", message: successText });
      trackEvent("lead_submit_success");
    } catch {
      trackEvent("lead_submit_error");
      setState({ type: "error", message: "网络连接失败。你填写的内容仍保留在页面中，请稍后重试。" });
    }
  }

  const fieldError = (name: string) => state.fields?.[name];
  const [slaBefore, slaAfter] = responseSlaText.split("48 小时");
  const hasResponseTime = responseSlaText.includes("48 小时");
  return (
    <form ref={formRef} className="lead-form" onSubmit={submit} noValidate onFocusCapture={() => { if (!started.current) { started.current = true; trackEvent("lead_form_start"); } }}>
      <div className="form-grid">
        <label>学校/机构<input name="school" autoComplete="organization" required aria-invalid={Boolean(fieldError("school"))}/><small>{fieldError("school")}</small></label>
        <label>院系/研究领域<input name="department" autoComplete="organization-title" required aria-invalid={Boolean(fieldError("department"))}/><small>{fieldError("department")}</small></label>
      </div>
      <div className="form-grid">
        <label>姓名<input name="name" autoComplete="name" required aria-invalid={Boolean(fieldError("name"))}/><small>{fieldError("name")}</small></label>
        <label>联系方式<input name="contact" autoComplete="email" placeholder="手机号、微信或邮箱" required aria-invalid={Boolean(fieldError("contact"))}/><small>{fieldError("contact")}</small></label>
      </div>
      <label>想和我们讨论什么？<textarea name="message" rows={5} placeholder="简单介绍团队、当前主页情况或希望解决的问题" required aria-invalid={Boolean(fieldError("message"))}/><small>{fieldError("message")}</small></label>
      <label className="honeypot" aria-hidden="true">网站<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-footer">
        <p>
          提交即表示你同意我们仅将以上信息用于联系与方案沟通。
          {hasResponseTime ? <>{slaBefore}<strong>48 小时</strong>{slaAfter}</> : responseSlaText}
        </p>
        <button className="button button-light" disabled={state.type === "loading"}>
          {state.type === "loading" ? "正在发送…" : "发送咨询"}
        </button>
      </div>
      {state.type !== "idle" && state.type !== "loading" ? (
        <div className={`form-status ${state.type}`} role="status" aria-live="polite">{state.message}</div>
      ) : null}
    </form>
  );
}
