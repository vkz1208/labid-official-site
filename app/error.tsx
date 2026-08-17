"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="simple-page">
      <span className="eyebrow">Something went wrong</span>
      <h1>页面暂时无法载入。</h1>
      <p>请稍后重试。如果问题持续存在，请通过 LabID 联系方式告知我们。</p>
      <button className="button button-dark" onClick={reset}>重新载入</button>
    </main>
  );
}
