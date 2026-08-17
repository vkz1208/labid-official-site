import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "登录 | LabID 管理后台", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const params = await searchParams;
  return (
    <main className="login-page">
      <section className="login-brand"><div><span className="eyebrow eyebrow-light"><i/>LabID CMS</span><h1>让主页内容，<br/>随研究持续更新。</h1></div><p>官网内容管理 · 仅限授权人员</p></section>
      <section className="login-panel">
        <form action={loginAction}>
          <span className="eyebrow"><i/>Admin access</span><h2>登录管理后台</h2><p>使用部署时配置的管理员账号登录。</p>
          <label>邮箱<input type="email" name="email" autoComplete="username" required/></label>
          <label>密码<input type="password" name="password" autoComplete="current-password" required/></label>
          {params.error === "rate" ? <div className="admin-alert error" role="alert">登录尝试过于频繁，请在 15 分钟后重试。</div> : null}
          {params.error === "invalid" ? <div className="admin-alert error" role="alert">账号或密码不正确，或管理员环境变量尚未配置。</div> : null}
          <button className="button button-dark">登录 <span>→</span></button>
        </form>
      </section>
    </main>
  );
}
