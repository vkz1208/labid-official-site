"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageUploadField({ name, initialUrl }: { name: string; initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setStatus("uploading");
    setMessage("");
    const form = new FormData();
    form.set("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "上传失败。");
      setUrl(result.url);
      setStatus("idle");
      setMessage("上传完成，保存案例后生效。");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "上传失败。");
    }
  }

  return (
    <div className="image-upload-field">
      <label>
        封面 URL
        <input name={name} value={url} onChange={(event) => setUrl(event.target.value)} required />
      </label>
      <div className="image-upload-row">
        <div className="image-upload-preview">{url ? <Image src={url} alt="封面预览" fill sizes="120px" unoptimized={url.startsWith("/api/media/")} /> : <span>暂无封面</span>}</div>
        <label className="upload-button">
          {status === "uploading" ? "正在上传…" : "上传图片"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={status === "uploading"} onChange={(event) => void upload(event.target.files?.[0])}/>
        </label>
      </div>
      <small className={status === "error" ? "upload-error" : ""}>{message || "JPG、PNG、WebP、AVIF，最大 5MB"}</small>
    </div>
  );
}
