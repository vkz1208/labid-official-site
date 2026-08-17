import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[0-9]+-[a-f0-9-]+\.(jpg|png|webp|avif)$/.test(filename)) return new NextResponse(null, { status: 404 });
  const uploadDir = process.env.UPLOAD_DIR
    ? path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, filename);
  try {
    const bytes = await fs.readFile(filePath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentTypes[path.extname(filename)] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
