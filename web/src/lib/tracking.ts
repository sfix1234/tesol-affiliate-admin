import "server-only";
import { supabaseAdmin } from "./supabase";

export async function resolveLinkTarget(linkId: string) {
  const db = supabaseAdmin();
  const { data: link, error } = await db
    .from("affiliate_links")
    .select("clicks, course_key")
    .eq("id", linkId)
    .single();
  if (error || !link) return null;

  const { data: course } = await db.from("courses").select("lp_url").eq("key", link.course_key).single();
  if (!course?.lp_url) return null;

  await db
    .from("affiliate_links")
    .update({ clicks: link.clicks + 1 })
    .eq("id", linkId);

  return course.lp_url;
}

export async function recordLead({ linkId, note }: { linkId: string; note?: string }) {
  const db = supabaseAdmin();
  const { data: link, error } = await db
    .from("affiliate_links")
    .select("influencer_id")
    .eq("id", linkId)
    .single();
  if (error || !link) return { ok: false as const };

  const { error: insertError } = await db.from("leads").insert({
    influencer_id: link.influencer_id,
    link_id: linkId,
    status: "interview_scheduled",
    note: note || "LP計測タグ経由",
  });
  if (insertError) return { ok: false as const };

  return { ok: true as const };
}
