import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/db";

export const runtime = "nodejs";

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ code: "UNAUTHORIZED", message: "请先登录。" }, { status: 401 });
  const origin = request.headers.get("origin");
  const expectedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin && expectedHost) {
    try {
      if (new URL(origin).host !== expectedHost) throw new Error("Origin mismatch");
    } catch {
      return NextResponse.json({ code: "ORIGIN_MISMATCH", message: "请求来源无效。" }, { status: 403 });
    }
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ code: "FILE_REQUIRED", message: "请选择图片。" }, { status: 400 });
  const extension = allowedTypes[file.type];
  if (!extension) return NextResponse.json({ code: "INVALID_TYPE", message: "仅支持 JPG、PNG、WebP 或 AVIF。" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ code: "FILE_TOO_LARGE", message: "图片不能超过 5MB。" }, { status: 400 });

  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const uploadDir = process.env.UPLOAD_DIR
    ? path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  const base = (process.env.UPLOAD_PUBLIC_BASE_URL || "/api/media").replace(/\/$/, "");
  const url = `${base}/${filename}`;
  writeAuditLog("image_uploaded", "media", filename, `${file.type} · ${file.size} bytes`);
  return NextResponse.json({ ok: true, url });
}
