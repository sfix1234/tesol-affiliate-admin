import { NextRequest, NextResponse } from "next/server";
import { recordLead } from "@/lib/tracking";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7",
  "base64"
);

// Pixel-tag style endpoint, for LPs that can only embed an <img> tag:
// <img src="https://<this-app>/api/leads?ref=misaki-01" width="1" height="1" style="display:none">
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    await recordLead({ linkId: ref, note: "計測タグ(pixel)経由" });
  }
  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" },
  });
}

// Webhook / server-to-server postback style endpoint, for LPs that can call an API directly:
// POST { "ref": "misaki-01" }
export async function POST(request: NextRequest) {
  let ref: string | null = null;
  try {
    const body = await request.json();
    ref = body?.ref ?? null;
  } catch {
    ref = request.nextUrl.searchParams.get("ref");
  }

  if (!ref) {
    return NextResponse.json({ ok: false, error: "ref is required" }, { status: 400 });
  }

  const result = await recordLead({ linkId: ref, note: "Webhook経由" });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "invalid ref" }, { status: 404 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
