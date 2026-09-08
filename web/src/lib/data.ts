export type InfluencerStatus = "active" | "suspended" | "pending";
export type ConversionStatus = "confirmed" | "pending" | "cancelled";

export type Course = { key: string; name: string; price: number; defaultRate: number };

export type LeadStatus = "interview_scheduled" | "converted" | "no_show" | "cancelled";

export const leadStatusLabel: Record<LeadStatus, string> = {
  interview_scheduled: "面談予定",
  converted: "成約",
  no_show: "不参加",
  cancelled: "不成立",
};

export const leadStatusBadgeClass: Record<LeadStatus, string> = {
  interview_scheduled: "pending",
  converted: "ok",
  no_show: "off",
  cancelled: "off",
};

export type Lead = {
  id: number;
  occurredAt: string;
  influencerId: string;
  linkId: string;
  status: LeadStatus;
  note: string | null;
};

export type OrgSettings = {
  orgName: string;
  adminEmail: string;
  websiteUrl: string;
  supportEmail: string;
  payoutCycle: string;
  minPayoutAmount: number;
  defaultPayoutMethod: string;
  holdPeriodDays: number;
  notifyNewConversion: boolean;
  notifyPendingAlert: boolean;
  notifyNewInfluencer: boolean;
  notifyMonthlyReport: boolean;
};

export type Influencer = {
  id: string;
  name: string;
  handle: string;
  channel: string;
  category: string;
  avatarLabel: string;
  avatarColor: string;
  email: string;
  followers: string;
  payoutMethod: string;
  joinedAt: string;
  status: InfluencerStatus;
  rates: { tesol: number; ielts: number; bundle: number };
  totals: {
    clicks: number;
    conversions: number;
    cvr: number;
    totalReward: number;
    monthReward: number;
  };
  monthlyRewards: { label: string; value: number }[];
  links: {
    id: string;
    shortUrl: string;
    landingPage: string;
    createdAt: string;
    clicks: number;
    conversions: number;
  }[];
};

export const statusLabel: Record<InfluencerStatus, string> = {
  active: "有効",
  suspended: "停止",
  pending: "審査中",
};

export const statusBadgeClass: Record<InfluencerStatus, string> = {
  active: "ok",
  suspended: "off",
  pending: "pending",
};

export const conversionStatusLabel: Record<ConversionStatus, string> = {
  confirmed: "確定",
  pending: "保留",
  cancelled: "キャンセル",
};

export const conversionStatusBadgeClass: Record<ConversionStatus, string> = {
  confirmed: "ok",
  pending: "pending",
  cancelled: "cancel",
};

export type Conversion = {
  datetime: string;
  influencerId: string;
  linkId: string;
  course: string;
  amount: number;
  status: ConversionStatus;
};

export function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

/* ---------- Payouts ---------- */

export type PayoutStatus = "unpaid" | "processing" | "paid" | "held";

export const payoutStatusLabel: Record<PayoutStatus, string> = {
  unpaid: "支払い待ち",
  processing: "処理中",
  paid: "支払い済み",
  held: "保留中",
};

export const payoutStatusBadgeClass: Record<PayoutStatus, string> = {
  unpaid: "pending",
  processing: "pending",
  paid: "ok",
  held: "off",
};

export type PayoutQueueItem = {
  influencerId: string;
  confirmedCount: number;
  amount: number;
  lastPaidAt: string;
  status: PayoutStatus;
};

export type PayoutBatch = {
  id: string;
  period: string;
  paidAt: string;
  payeeCount: number;
  totalAmount: number;
};

/* ---------- Settings ---------- */

export type AdminMember = {
  name: string;
  email: string;
  role: "オーナー" | "管理者" | "閲覧のみ";
  status: "有効" | "招待中";
};

/* ---------- Dashboard (not yet backed by the database) ---------- */

export const dashboardKpis = {
  totalClicks: 12480,
  totalClicksTrend: 8.2,
  totalConversions: 342,
  totalConversionsTrend: 14.5,
  cvr: 2.74,
  cvrTrend: 0.3,
  monthReward: 1284600,
  monthRewardTrend: 18.1,
};

export const clickTrend = [
  { x: "8/9", v: 65 }, { x: "8/10", v: 79 }, { x: "8/11", v: 54 }, { x: "8/12", v: 108 },
  { x: "8/13", v: 94 }, { x: "8/14", v: 122 }, { x: "8/15", v: 144 }, { x: "8/16", v: 101 },
  { x: "8/17", v: 115 }, { x: "8/18", v: 162 }, { x: "8/19", v: 137 }, { x: "8/20", v: 180 },
  { x: "8/21", v: 151 }, { x: "8/22", v: 173 },
];
