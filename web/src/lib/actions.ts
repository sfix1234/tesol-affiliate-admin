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
    courseKey: link.course_key,
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
  revalidatePath("/courses");
}

export async function updateCourseLpUrls(courses: { key: string; lpUrl: string }[]) {
  const db = supabaseAdmin();
  for (const c of courses) {
    const { error } = await db.from("courses").update({ lp_url: c.lpUrl }).eq("key", c.key);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/courses");
  revalidatePath("/links");
}

export async function createCourse({
  name,
  price,
  defaultRate,
}: {
  name: string;
  price: number;
  defaultRate: number;
}) {
  if (!name.trim()) throw new Error("コース名は必須です");
  const db = supabaseAdmin();
  const base = slugify(name) || "course";
  let key = base;
  const { data: existing } = await db.from("courses").select("key").like("key", `${base}%`);
  if (existing?.some((c) => c.key === key)) {
    key = `${base}-${Math.random().toString(36).slice(2, 5)}`;
  }

  const { error } = await db.from("courses").insert({
    key,
    name,
    price,
    default_rate: defaultRate,
    lp_url: "",
  });
  if (error) throw new Error(error.message);

  const { data: influencers, error: infError } = await db.from("influencers").select("id");
  if (infError) throw new Error(infError.message);
  if (influencers && influencers.length > 0) {
    const { error: ratesError } = await db.from("influencer_course_rates").insert(
      influencers.map((inf) => ({ influencer_id: inf.id, course_key: key, rate: defaultRate }))
    );
    if (ratesError) throw new Error(ratesError.message);
  }

  revalidatePath("/courses");
  revalidatePath("/links");
  revalidatePath("/influencers");
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
  rates: Record<string, number>;
}) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("influencer_course_rates")
    .upsert(
      Object.entries(rates).map(([courseKey, rate]) => ({ influencer_id: id, course_key: courseKey, rate })),
      { onConflict: "influencer_id,course_key" }
    );
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

  const { error: inviteError } = await db.auth.admin.inviteUserByEmail(email, {
    redirectTo: `https://${SITE_DOMAIN}/auth/callback`,
  });
  if (inviteError) throw new Error(`メンバーは登録されましたが、招待メールの送信に失敗しました: ${inviteError.message}`);

  revalidatePath("/settings");
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
  rates: Record<string, number>;
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
  };

  const { error } = await db.from("influencers").insert(row);
  if (error) throw new Error(error.message);

  const { error: ratesError } = await db.from("influencer_course_rates").insert(
    Object.entries(rates).map(([courseKey, rate]) => ({ influencer_id: id, course_key: courseKey, rate }))
  );
  if (ratesError) throw new Error(ratesError.message);

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
