import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <aside className="admin-nav">
      <Link className="brand" href="/admin"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>LabID</Link>
      <p>官网管理</p>
      <nav><a href="#overview">概览</a><a href="#content">首页内容</a><a href="#cases">案例管理</a><a href="#leads">咨询线索</a><a href="#audit">操作记录</a></nav>
      <div className="admin-nav-foot"><Link href="/" target="_blank">查看官网 ↗</Link><form action={logoutAction}><button>退出登录</button></form></div>
    </aside>
  );
}
