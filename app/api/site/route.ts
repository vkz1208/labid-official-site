import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getSiteContent(), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
  });
}
