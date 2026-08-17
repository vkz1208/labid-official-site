import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAuditLogs, getCases, getLeads, getSiteContent } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { deleteCaseAction, retryLeadEmailAction, saveCaseAction, saveSiteAction, updateLeadStatusAction } from "./actions";
import Image from "next/image";
import { AdminUnsavedGuard, DeleteCaseButton } from "@/components/AdminGuards";
import { ImageUploadField } from "@/components/ImageUploadField";
import { HomepagePreview } from "@/components/HomepagePreview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "官网管理 | LabID", robots: { index: false, follow: false } };

const Input = ({ label, name, value, multiline = false, required = true }: { label: string; name: string; value: string; multiline?: boolean; required?: boolean }) => (
  <label>{label}{multiline ? <textarea name={name} defaultValue={value} rows={3} required={required}/> : <input name={name} defaultValue={value} required={required}/>}</label>
);

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const [content, cases, leads, auditLogs, params] = [getSiteContent(), getCases(true), getLeads(), getAuditLogs(), await searchParams];
  return (
    <div className="admin-shell">
      <AdminUnsavedGuard />
      <AdminNav />
      <main className="admin-main">
        <header className="admin-header"><div><span className="eyebrow"><i/>Website operations</span><h1>官网管理</h1></div><p>{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</p></header>
        {params.saved ? <div className="admin-alert success">更改已保存，官网内容已同步更新。</div> : null}
        {params.error ? <div className="admin-alert error">部分字段不完整或格式不正确，请检查后重试。</div> : null}

        <section id="overview" className="admin-section">
          <div className="admin-section-title"><div><span>概览</span><h2>今天需要关注什么</h2></div></div>
          <div className="stat-grid"><article><span>案例</span><b>{cases.filter((item) => item.enabled).length}</b><p>个正在官网展示</p></article><article><span>新线索</span><b>{leads.filter((lead) => lead.status === "new").length}</b><p>条尚未联系</p></article><article><span>邮件待处理</span><b>{leads.filter((lead) => lead.emailStatus === "failed").length}</b><p>条通知发送失败</p></article></div>
        </section>

        <section id="content" className="admin-section">
          <div className="admin-section-title"><div><span>首页内容</span><h2>编辑品牌与产品叙事</h2></div><p>保存后直接发布</p></div>
          <form id="site-content-form" className="admin-form" action={saveSiteAction}>
            <HomepagePreview content={content}/>
            <fieldset><legend>品牌与首屏</legend><div className="admin-fields"><Input label="站点名称" name="siteName" value={content.siteName}/><Input label="首屏短标签" name="heroEyebrow" value={content.hero.eyebrow}/><Input label="首屏标题" name="heroTitle" value={content.hero.title} multiline/><Input label="首屏说明" name="heroDescription" value={content.hero.description} multiline/><Input label="主按钮" name="primaryCtaLabel" value={content.hero.primaryCtaLabel}/><Input label="次按钮" name="secondaryCtaLabel" value={content.hero.secondaryCtaLabel}/></div></fieldset>
            <fieldset><legend>产品说明</legend><div className="admin-fields"><Input label="短标签" name="productEyebrow" value={content.product.eyebrow}/><Input label="标题" name="productTitle" value={content.product.title} multiline/><Input label="说明" name="productDescription" value={content.product.description} multiline/></div>{content.product.values.map((value, index) => <div className="value-edit" key={value.id}><b>价值点 {index + 1}</b><div className="admin-fields"><Input label="阶段标签" name={`valueLabel${index}`} value={value.label}/><Input label="标题" name={`valueTitle${index}`} value={value.title}/><Input label="说明" name={`valueDescription${index}`} value={value.description} multiline/></div></div>)}</fieldset>
            <fieldset><legend>案例区</legend><div className="admin-fields"><Input label="短标签" name="casesEyebrow" value={content.cases.eyebrow}/><Input label="标题" name="casesTitle" value={content.cases.title} multiline/><Input label="说明" name="casesDescription" value={content.cases.description} multiline/></div></fieldset>
            <fieldset><legend>联系与页脚</legend><div className="admin-fields"><Input label="联系区短标签" name="contactEyebrow" value={content.contact.eyebrow}/><Input label="联系区标题" name="contactTitle" value={content.contact.title} multiline/><Input label="联系区说明" name="contactDescription" value={content.contact.description} multiline/><Input label="公开电话（可留空）" name="contactPhone" value={content.contact.phone} required={false}/><Input label="公开邮箱（可留空）" name="contactEmail" value={content.contact.email} required={false}/><Input label="响应时效" name="responseSlaText" value={content.contact.responseSlaText}/><Input label="提交成功提示" name="successText" value={content.contact.successText}/><Input label="备案号" name="icp" value={content.footer.icp}/><Input label="版权所有" name="copyrightOwner" value={content.footer.copyrightOwner}/></div></fieldset>
            <div className="admin-form-actions"><button className="button button-dark">保存并发布 <span>→</span></button></div>
          </form>
        </section>

        <section id="cases" className="admin-section">
          <div className="admin-section-title"><div><span>案例管理</span><h2>维护案例与展示顺序</h2></div><p>{cases.length} 个案例</p></div>
          <div className="case-admin-list">
            {cases.map((item) => <form className="case-admin-card" action={saveCaseAction} key={item.id}><input type="hidden" name="id" value={item.id}/><div className="case-admin-preview"><Image src={item.coverUrl} alt="" fill sizes="220px" unoptimized={item.coverUrl.startsWith("/api/media/")}/><span>{item.enabled ? "展示中" : "已下线"}</span></div><div className="admin-fields"><Input label="学科" name="discipline" value={item.discipline}/><Input label="团队规模" name="teamScale" value={item.teamScale}/><Input label="短说明" name="description" value={item.description}/><Input label="案例 URL" name="url" value={item.url}/><ImageUploadField name="coverUrl" initialUrl={item.coverUrl}/><Input label="封面替代文本" name="coverAlt" value={item.coverAlt}/><label>排序值<input type="number" name="sortOrder" defaultValue={item.sortOrder}/></label><label className="check-label"><input type="checkbox" name="enabled" defaultChecked={item.enabled}/>在官网展示</label></div><div className="case-admin-actions"><button className="button button-dark">保存案例</button><DeleteCaseButton action={deleteCaseAction} id={item.id}/></div></form>)}
            <form className="case-admin-card new-case" action={saveCaseAction}><h3>新增案例</h3><div className="admin-fields"><Input label="学科" name="discipline" value=""/><Input label="团队规模" name="teamScale" value=""/><Input label="短说明" name="description" value=""/><Input label="案例 URL" name="url" value="https://"/><ImageUploadField name="coverUrl" initialUrl="/case-life.svg"/><Input label="封面替代文本" name="coverAlt" value=""/><label>排序值<input type="number" name="sortOrder" defaultValue={cases.length + 1}/></label><label className="check-label"><input type="checkbox" name="enabled" defaultChecked/>在官网展示</label></div><button className="button button-dark">新增案例</button></form>
          </div>
        </section>

        <section id="leads" className="admin-section">
          <div className="admin-section-title"><div><span>咨询线索</span><h2>跟进新的团队需求</h2></div><p>{leads.length} 条记录</p></div>
          {leads.length ? <div className="lead-list">{leads.map((lead) => <article className="lead-card" key={lead.id}><div className="lead-top"><div><span>{lead.school} · {lead.department}</span><h3>{lead.name}</h3></div><time>{new Date(`${lead.createdAt}Z`).toLocaleString("zh-CN")}</time></div><a href={lead.contact.includes("@") ? `mailto:${lead.contact}` : undefined}>{lead.contact}</a><p>{lead.message}</p><div className={`email-delivery ${lead.emailStatus}`}><span>邮件通知：{lead.emailStatus === "sent" ? "已发送" : lead.emailStatus === "failed" ? "发送失败" : "等待发送"}</span><small>已尝试 {lead.emailAttempts} 次</small>{lead.emailStatus === "failed" ? <form action={retryLeadEmailAction}><input type="hidden" name="id" value={lead.id}/><button>重新发送</button></form> : null}</div><form action={updateLeadStatusAction}><input type="hidden" name="id" value={lead.id}/><label>跟进状态<select name="status" defaultValue={lead.status}><option value="new">新线索</option><option value="contacted">已联系</option><option value="closed">已关闭</option></select></label><button>更新状态</button></form></article>)}</div> : <div className="admin-empty"><span>暂无咨询线索</span><p>公开站点提交的有效表单会安全保存在这里。</p></div>}
        </section>

        <section id="audit" className="admin-section">
          <div className="admin-section-title"><div><span>操作记录</span><h2>最近的后台与系统事件</h2></div><p>最近 {auditLogs.length} 条</p></div>
          {auditLogs.length ? <div className="audit-list">{auditLogs.map((log) => <article key={log.id}><time>{new Date(`${log.createdAt}Z`).toLocaleString("zh-CN")}</time><div><b>{log.action}</b><span>{log.entityType}{log.entityId ? ` #${log.entityId}` : ""}</span></div><p>{log.detail || "—"}</p></article>)}</div> : <div className="admin-empty"><span>暂无操作记录</span><p>登录、发布、案例、线索和图片操作会记录在这里。</p></div>}
        </section>
      </main>
    </div>
  );
}
