import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-page">
      <span className="eyebrow">404</span>
      <h1>这里没有你要找的页面。</h1>
      <p>LabID 官网 V1 采用单页结构，你可以回到首页继续浏览。</p>
      <Link className="button button-dark" href="/">返回首页</Link>
    </main>
  );
}
