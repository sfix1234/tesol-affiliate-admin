"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import { SITE_DOMAIN } from "./site";

const AVATAR_COLORS = [
  "oklch(58% 0.15 340)",
  "oklch(55% 0.15 25)",
  "oklch(55% 0.13 230)",
  "oklch(58% 0.12 150)",
  "oklch(58% 0.1 90)",
  "oklch(52% 0.1 210)",
  "oklch(50% 0.02 260)",
  "oklch(60% 0.13 300)",
];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createAffiliateLink({
  influencerId,
  courseKey,
  tag,
}: {
  influencerId: string;
  courseKey: string;
  tag: string;
}) {
  const db = supabaseAdmin();
  const { data: course, error: courseError } = await db
    .from("courses")
    .select("*")
    .eq("key", courseKey)
    .single();
  if (courseError || !course) throw new Error("コースが見つかりません");

  const namePart = influencerId.split("-")[0];
  const tagPart = slugify(tag);
  const suffix = Math.random().toString(36).slice(2, 6);
  const id = tagPart ? `${namePart}-${tagPart}-${suffix}` : `${namePart}-${courseKey}-${suffix}`;

  const link = {
    id,
    influencer_id: influencerId,
    course_key: courseKey,
    short_url: `${SITE_DOMAIN}/r/${id}`,
    landing_page: `${course.name} LP`,
    created_at: new Date().toISOString().slice(0, 10),
    clicks: 0,
    conversions: 0,
  };

  const { error } = await db.from("affiliate_links").insert(link);
  if (error) throw new Error(error.message);

  revalidatePath("/links");
  revalidatePath(`/influencers/${influencerId}`);
  revalidatePath("/influencers");

  return {
    id: link.id,
    shortUrl: link.short_url,
    landingPage: link.landing_page,
    createdAt: link.created_at,
    clicks: link.clicks,
    conversions: link.conversions,
  };
}

export async function createLead({
  influencerId,
  linkId,
  note,
}: {
  influencerId: string;
  linkId: string;
  note?: string;
}) {
  const db = supabaseAdmin();
  const { error } = await db.from("leads").insert({
    influencer_id: influencerId,
    link_id: linkId,
    status: "interview_scheduled",
    note: note || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/links");
  revalidatePath(`/influencers/${influencerId}`);
}

export async function confirmLead({
  leadId,
  courseKey,
  amount,
}: {
  leadId: number;
  courseKey: string;
  amount: number;
}) {
  const db = supabaseAdmin();
  const { data: lead, error: leadError } = await db.from("leads").select("*").eq("id", leadId).single();
  if (leadError || !lead) throw new Error("面談登録が見つかりません");

  const { data: course, error: courseError } = await db
    .from("courses")
    .select("*")
    .eq("key", courseKey)
    .single();
  if (courseError || !course) throw new Error("コースが見つかりません");

  const { error: insertError } = await db.from("conversions").insert({
    occurred_at: new Date().toISOString(),
    influencer_id: lead.influencer_id,
    link_id: lead.link_id,
    course: course.name,
    amount,
    status: "confirmed",
    lead_id: leadId,
  });
  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await db.from("leads").update({ status: "converted" }).eq("id", leadId);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/links");
  revalidatePath("/");
  revalidatePath(`/influencers/${lead.influencer_id}`);
}

export async function declineLead({
  leadId,
  status,
}: {
  leadId: number;
  status: "no_show" | "cancelled";
}) {
  const db = supabaseAdmin();
  const { error } = await db.from("leads").update({ status }).eq("id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/links");
}

export async function updateOrgSettings(input: {
  orgName: string;
  adminEmail: string;
  websiteUrl: string;
  supportEmail: string;
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("org_settings")
    .update({
      org_name: input.orgName,
      admin_email: input.adminEmail,
      website_url: input.websiteUrl,
      support_email: input.supportEmail,
    })
    .eq("id", "default");
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updatePayoutSettings(input: {
  payoutCycle: string;
  minPayoutAmount: number;
  defaultPayoutMethod: string;
  holdPeriodDays: number;
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("org_settings")
    .update({
      payout_cycle: input.payoutCycle,
      min_payout_amount: input.minPayoutAmount,
      default_payout_method: input.defaultPayoutMethod,
      hold_period_days: input.holdPeriodDays,
    })
    .eq("id", "default");
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updateNotificationSettings(input: {
  notifyNewConversion: boolean;
  notifyPendingAlert: boolean;
  notifyNewInfluencer: boolean;
  notifyMonthlyReport: boolean;
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("org_settings")
    .update({
      notify_new_conversion: input.notifyNewConversion,
      notify_pending_alert: input.notifyPendingAlert,
      notify_new_influencer: input.notifyNewInfluencer,
      notify_monthly_report: input.notifyMonthlyReport,
    })
    .eq("id", "default");
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updateCourseRates(rates: { key: string; defaultRate: number }[]) {
  const db = supabaseAdmin();
  for (const r of rates) {
    const { error } = await db.from("courses").update({ default_rate: r.defaultRate }).eq("key", r.key);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/settings");
}

export async function updateCourseLpUrls(courses: { key: string; lpUrl: string }[]) {
  const db = supabaseAdmin();
  for (const c of courses) {
    const { error } = await db.from("courses").update({ lp_url: c.lpUrl }).eq("key", c.key);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/settings");
  revalidatePath("/links");
}

export async function updateInfluencerProfile({
  id,
  email,
  followers,
  payoutMethod,
  status,
}: {
  id: string;
  email: string;
  followers: string;
  payoutMethod: string;
  status: "active" | "suspended" | "pending";
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("influencers")
    .update({ email, followers, payout_method: payoutMethod, status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/influencers/${id}`);
  revalidatePath("/influencers");
  revalidatePath("/");
}

export async function updateInfluencerRates({
  id,
  rates,
}: {
  id: string;
  rates: { tesol: number; ielts: number; bundle: number };
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("influencers")
    .update({ rate_tesol: rates.tesol, rate_ielts: rates.ielts, rate_bundle: rates.bundle })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/influencers/${id}`);
  revalidatePath("/influencers");
}

export async function inviteAdminMember({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "オーナー" | "管理者" | "閲覧のみ";
}) {
  if (!name.trim() || !email.trim()) throw new Error("名前とメールアドレスは必須です");
  const db = supabaseAdmin();
  const { error } = await db.from("admin_members").insert({
    name,
    email,
    role,
    status: "招待中",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
}

export async function processPayoutBatch() {
  const db = supabaseAdmin();
  const { data: queue, error: queueError } = await db
    .from("payout_queue")
    .select("*")
    .in("status", ["unpaid", "processing"]);
  if (queueError) throw new Error(queueError.message);
  if (!queue || queue.length === 0) return { payeeCount: 0, totalAmount: 0 };

  const totalAmount = queue.reduce((sum, p) => sum + p.amount, 0);
  const payeeCount = queue.length;
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const period = `${now.getFullYear()}年${now.getMonth() + 1}月分`;
  const batchId = `PAY-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).slice(2, 5)}`;

  const { error: historyError } = await db.from("payout_history").insert({
    id: batchId,
    period,
    paid_at: today,
    payee_count: payeeCount,
    total_amount: totalAmount,
  });
  if (historyError) throw new Error(historyError.message);

  const { error: updateError } = await db
    .from("payout_queue")
    .update({ status: "paid", last_paid_at: today })
    .in("status", ["unpaid", "processing"]);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/payouts");
  return { payeeCount, totalAmount };
}

export async function createInfluencer({
  name,
  handle,
  channel,
  category,
  email,
  followers,
  payoutMethod,
  rates,
}: {
  name: string;
  handle: string;
  channel: string;
  category: string;
  email: string;
  followers: string;
  payoutMethod: string;
  rates: { tesol: number; ielts: number; bundle: number };
}) {
  if (!name.trim() || !email.trim()) throw new Error("名前とメールアドレスは必須です");

  const db = supabaseAdmin();
  const base = slugify(handle) || slugify(name) || "influencer";
  const id = `${base}-${Math.random().toString(36).slice(2, 6)}`;

  const row = {
    id,
    name,
    handle,
    channel,
    category,
    avatar_label: name.slice(0, 1),
    avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    email,
    followers,
    payout_method: payoutMethod || "銀行振込",
    joined_at: new Date().toISOString().slice(0, 10),
    status: "pending" as const,
    rate_tesol: rates.tesol,
    rate_ielts: rates.ielts,
    rate_bundle: rates.bundle,
  };

  const { error } = await db.from("influencers").insert(row);
  if (error) throw new Error(error.message);

  const { error: payoutError } = await db.from("payout_queue").insert({
    influencer_id: id,
    confirmed_count: 0,
    amount: 0,
    last_paid_at: null,
    status: "unpaid",
  });
  if (payoutError) throw new Error(payoutError.message);

  revalidatePath("/influencers");
  revalidatePath("/");
  revalidatePath("/links");
  revalidatePath("/payouts");

  return row.id;
}
