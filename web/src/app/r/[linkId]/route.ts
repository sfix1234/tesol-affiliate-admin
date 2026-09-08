import { NextRequest, NextResponse } from "next/server";
import { resolveLinkTarget } from "@/lib/tracking";

export async function GET(request: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const targetUrl = await resolveLinkTarget(linkId);
  if (!targetUrl) {
    return new NextResponse("Link not found", { status: 404 });
  }

  const url = new URL(targetUrl);
  url.searchParams.set("ref", linkId);
  return NextResponse.redirect(url.toString(), { status: 302 });
}
