"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";

type PreviewState = {
  siteName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  productTitle: string;
  valueTitle0: string;
  casesTitle: string;
  contactTitle: string;
};

export function HomepagePreview({ content }: { content: SiteContent }) {
  const [preview, setPreview] = useState<PreviewState>({
    siteName: content.siteName,
    heroEyebrow: content.hero.eyebrow,
    heroTitle: content.hero.title,
    heroDescription: content.hero.description,
    productTitle: content.product.title,
    valueTitle0: content.product.values[0]?.title || "",
    casesTitle: content.cases.title,
    contactTitle: content.contact.title,
  });

  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("#site-content-form");
    if (!form) return;
    const update = () => {
      const data = new FormData(form);
      setPreview((current) => ({
        ...current,
        siteName: String(data.get("siteName") || ""),
        heroEyebrow: String(data.get("heroEyebrow") || ""),
        heroTitle: String(data.get("heroTitle") || ""),
        heroDescription: String(data.get("heroDescription") || ""),
        productTitle: String(data.get("productTitle") || ""),
        valueTitle0: String(data.get("valueTitle0") || ""),
        casesTitle: String(data.get("casesTitle") || ""),
        contactTitle: String(data.get("contactTitle") || ""),
      }));
    };
    form.addEventListener("input", update);
    return () => form.removeEventListener("input", update);
  }, []);

  return (
    <aside className="admin-live-preview" aria-label="首页实时预览">
      <div className="preview-label"><span><i/>实时预览</span><a href="/" target="_blank">打开官网 ↗</a></div>
      <div className="preview-browser">
        <div className="preview-bar"><i/><i/><i/><b>{preview.siteName || "LabID"}</b></div>
        <div className="preview-hero">
          <span>{preview.heroEyebrow || "Eyebrow"}</span>
          <h3>{preview.heroTitle || "首屏标题"}</h3>
          <p>{preview.heroDescription || "首屏说明"}</p>
          <button type="button" tabIndex={-1}>查看案例 ↓</button>
          <div className="preview-canvas" aria-hidden="true"/>
        </div>
        <div className="preview-section"><small>产品</small><h4>{preview.productTitle || "产品区标题"}</h4><p>{preview.valueTitle0 || "核心价值点"}</p></div>
        <div className="preview-section preview-cases"><small>案例</small><h4>{preview.casesTitle || "案例区标题"}</h4><div><i/><i/><i/></div></div>
        <div className="preview-contact"><small>联系</small><h4>{preview.contactTitle || "联系区标题"}</h4></div>
      </div>
      <p>输入内容时即时更新；保存并发布后同步到公开官网。</p>
    </aside>
  );
}
