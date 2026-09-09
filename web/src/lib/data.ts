export type InfluencerStatus = "active" | "suspended" | "pending";
export type ConversionStatus = "confirmed" | "pending" | "cancelled";

export type Course = { key: string; name: string; price: number; defaultRate: number; lpUrl: string };

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
  rates: Record<string, number>;
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
    courseKey: string;
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

