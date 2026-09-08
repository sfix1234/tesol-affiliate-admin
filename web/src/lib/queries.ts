import "server-only";
import { supabaseAdmin } from "./supabase";
import type { Influencer, Conversion, PayoutQueueItem, PayoutBatch, AdminMember, Course, Lead, OrgSettings } from "./data";

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabaseAdmin().from("courses").select("*").order("price");
  if (error) throw error;
  return (data ?? []).map((c) => ({
    key: c.key,
    name: c.name,
    price: c.price,
    defaultRate: c.default_rate,
    lpUrl: c.lp_url,
  }));
}

export async function fetchInfluencers(): Promise<Influencer[]> {
  const db = supabaseAdmin();
  const [{ data: influencers, error: infError }, { data: rewards, error: rewardsError }, { data: links, error: linksError }] =
    await Promise.all([
      db.from("influencers").select("*").order("total_reward", { ascending: false }),
      db.from("influencer_monthly_rewards").select("*").order("sort_order"),
      db.from("affiliate_links").select("*").order("created_at"),
    ]);
  if (infError) throw infError;
  if (rewardsError) throw rewardsError;
  if (linksError) throw linksError;

  return (influencers ?? []).map((row): Influencer => ({
    id: row.id,
    name: row.name,
    handle: row.handle,
    channel: row.channel,
    category: row.category,
    avatarLabel: row.avatar_label,
    avatarColor: row.avatar_color,
    email: row.email,
    followers: row.followers,
    payoutMethod: row.payout_method,
    joinedAt: row.joined_at,
    status: row.status,
    rates: { tesol: row.rate_tesol, ielts: row.rate_ielts, bundle: row.rate_bundle },
    totals: {
      clicks: row.total_clicks,
      conversions: row.total_conversions,
      cvr: row.total_cvr,
      totalReward: row.total_reward,
      monthReward: row.month_reward,
    },
    monthlyRewards: (rewards ?? [])
      .filter((r) => r.influencer_id === row.id)
      .map((r) => ({ label: r.label, value: r.value })),
    links: (links ?? [])
      .filter((l) => l.influencer_id === row.id)
      .map((l) => ({
        id: l.id,
        shortUrl: l.short_url,
        landingPage: l.landing_page,
        createdAt: l.created_at,
        clicks: l.clicks,
        conversions: l.conversions,
      })),
  }));
}

export async function fetchInfluencerById(id: string) {
  const influencers = await fetchInfluencers();
  return influencers.find((i) => i.id === id);
}

export async function fetchRecentConversions(): Promise<Conversion[]> {
  const { data, error } = await supabaseAdmin()
    .from("conversions")
    .select("*")
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    datetime: c.occurred_at.replace("T", " ").slice(0, 16),
    influencerId: c.influencer_id,
    linkId: c.link_id,
    course: c.course,
    amount: c.amount,
    status: c.status,
  }));
}

export async function fetchPayoutQueue(): Promise<PayoutQueueItem[]> {
  const { data, error } = await supabaseAdmin()
    .from("payout_queue")
    .select("*")
    .order("amount", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    influencerId: p.influencer_id,
    confirmedCount: p.confirmed_count,
    amount: p.amount,
    lastPaidAt: p.last_paid_at ?? "—",
    status: p.status,
  }));
}

export async function fetchPayoutHistory(): Promise<PayoutBatch[]> {
  const { data, error } = await supabaseAdmin()
    .from("payout_history")
    .select("*")
    .order("paid_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((b) => ({
    id: b.id,
    period: b.period,
    paidAt: b.paid_at,
    payeeCount: b.payee_count,
    totalAmount: b.total_amount,
  }));
}

export async function fetchAdminMembers(): Promise<AdminMember[]> {
  const { data, error } = await supabaseAdmin().from("admin_members").select("*");
  if (error) throw error;
  return data as AdminMember[];
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabaseAdmin()
    .from("leads")
    .select("*")
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((l) => ({
    id: l.id,
    occurredAt: l.occurred_at,
    influencerId: l.influencer_id,
    linkId: l.link_id,
    status: l.status,
    note: l.note,
  }));
}

export async function fetchOrgSettings(): Promise<OrgSettings> {
  const { data, error } = await supabaseAdmin()
    .from("org_settings")
    .select("*")
    .eq("id", "default")
    .single();
  if (error) throw error;
  return {
    orgName: data.org_name,
    adminEmail: data.admin_email,
    websiteUrl: data.website_url,
    supportEmail: data.support_email,
    notifyNewConversion: data.notify_new_conversion,
    notifyPendingAlert: data.notify_pending_alert,
    notifyNewInfluencer: data.notify_new_influencer,
    notifyMonthlyReport: data.notify_monthly_report,
  };
}
