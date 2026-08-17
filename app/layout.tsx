import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "LabID | AI 时代的学术数字身份",
  description: "LabID 为高校 PI 与研究团队打造专属学术主页，用 AI 梳理科研工作与研究叙事，并支持持续更新。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LabID | AI 时代的学术数字身份",
    description: "让每一项研究，成为清晰的学术叙事。",
    url: "/",
    siteName: "LabID",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
