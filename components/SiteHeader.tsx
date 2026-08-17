"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SiteHeader({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href="#top" aria-label={`${siteName} 首页`} onClick={close}>
        <span className="brand-wordmark" aria-hidden="true">
          <Image src="/labid-wordmark.png" alt="" fill sizes="120px" priority />
        </span>
      </a>
      <button className="menu-button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
        <span>{open ? "关闭" : "菜单"}</span>
      </button>
      <nav id="site-nav" className={open ? "is-open" : ""} aria-label="主导航">
        <a href="#product" onClick={close}>产品</a>
        <a href="#cases" onClick={close}>案例</a>
        <a href="#contact" data-event="contact_cta_click" onClick={close}>联系我们</a>
        <a className="nav-cta" href="#contact" data-event="contact_cta_click" onClick={close}>获取方案</a>
      </nav>
    </header>
  );
}
