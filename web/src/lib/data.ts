export type InfluencerStatus = "active" | "suspended" | "pending";
export type ConversionStatus = "confirmed" | "pending" | "cancelled";

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

export const courses = [
  { key: "tesol", name: "TESOL資格取得コース", price: 24000 },
  { key: "ielts", name: "IELTS対策コース", price: 18500 },
  { key: "bundle", name: "TESOL+IELTSセットコース", price: 38000 },
] as const;

export const influencers: Influencer[] = [
  {
    id: "misaki-tanaka",
    name: "田中 美咲",
    handle: "@misaki_english",
    channel: "Instagram",
    category: "英語学習系",
    avatarLabel: "田",
    avatarColor: "oklch(58% 0.15 340)",
    email: "misaki.tanaka@example.com",
    followers: "約12.4万人",
    payoutMethod: "銀行振込",
    joinedAt: "2025-11-03",
    status: "active",
    rates: { tesol: 15, ielts: 12, bundle: 15 },
    totals: { clicks: 7280, conversions: 128, cvr: 1.76, totalReward: 1842000, monthReward: 186400 },
    monthlyRewards: [
      { label: "3月", value: 52 },
      { label: "4月", value: 68 },
      { label: "5月", value: 74 },
      { label: "6月", value: 60 },
      { label: "7月", value: 96 },
      { label: "8月", value: 110 },
    ],
    links: [
      { id: "misaki-01", shortUrl: "tesol-lp.online/r/misaki-01", landingPage: "TESOL資格取得コース LP", createdAt: "2025-11-10", clicks: 3240, conversions: 62 },
      { id: "misaki-02", shortUrl: "ielts-lp.online/r/misaki-02", landingPage: "IELTS対策コース LP", createdAt: "2026-02-18", clicks: 2180, conversions: 41 },
      { id: "misaki-summer", shortUrl: "tesol-lp.online/r/misaki-summer", landingPage: "TESOL資格取得コース LP", createdAt: "2026-07-01", clicks: 1860, conversions: 25 },
    ],
  },
  {
    id: "ielts-master-channel",
    name: "IELTS Master Channel",
    handle: "IELTS Master Channel",
    channel: "YouTube",
    category: "資格試験系",
    avatarLabel: "I",
    avatarColor: "oklch(55% 0.15 25)",
    email: "contact@ieltsmaster.example.com",
    followers: "登録者 8.9万人",
    payoutMethod: "銀行振込",
    joinedAt: "2025-09-05",
    status: "active",
    rates: { tesol: 10, ielts: 18, bundle: 15 },
    totals: { clicks: 5420, conversions: 96, cvr: 1.77, totalReward: 1529400, monthReward: 152900 },
    monthlyRewards: [
      { label: "3月", value: 60 },
      { label: "4月", value: 58 },
      { label: "5月", value: 70 },
      { label: "6月", value: 82 },
      { label: "7月", value: 90 },
      { label: "8月", value: 96 },
    ],
    links: [
      { id: "ielts-master-01", shortUrl: "ielts-lp.online/r/ielts-master-01", landingPage: "IELTS対策コース LP", createdAt: "2025-09-05", clicks: 5420, conversions: 96 },
    ],
  },
  {
    id: "kenta-sato",
    name: "佐藤 健太",
    handle: "英語コーチ健太",
    channel: "YouTube / X",
    category: "英会話コーチ",
    avatarLabel: "佐",
    avatarColor: "oklch(55% 0.13 230)",
    email: "kenta.coach@example.com",
    followers: "登録者 6.2万人",
    payoutMethod: "銀行振込",
    joinedAt: "2025-10-14",
    status: "active",
    rates: { tesol: 15, ielts: 15, bundle: 15 },
    totals: { clicks: 4180, conversions: 74, cvr: 1.77, totalReward: 1342800, monthReward: 134200 },
    monthlyRewards: [
      { label: "3月", value: 40 },
      { label: "4月", value: 48 },
      { label: "5月", value: 55 },
      { label: "6月", value: 62 },
      { label: "7月", value: 70 },
      { label: "8月", value: 74 },
    ],
    links: [
      { id: "kenta-coach-01", shortUrl: "tesol-lp.online/r/kenta-coach-01", landingPage: "TESOL+IELTSセットLP", createdAt: "2026-01-22", clicks: 4180, conversions: 74 },
    ],
  },
  {
    id: "yuki-global-speak",
    name: "Global Speak 由紀",
    handle: "@yuki_studyabroad",
    channel: "Instagram",
    category: "留学系",
    avatarLabel: "G",
    avatarColor: "oklch(58% 0.12 150)",
    email: "yuki.globalspeak@example.com",
    followers: "約5.8万人",
    payoutMethod: "銀行振込",
    joinedAt: "2025-12-01",
    status: "active",
    rates: { tesol: 12, ielts: 12, bundle: 12 },
    totals: { clicks: 2860, conversions: 52, cvr: 1.82, totalReward: 987200, monthReward: 98700 },
    monthlyRewards: [
      { label: "3月", value: 30 },
      { label: "4月", value: 34 },
      { label: "5月", value: 38 },
      { label: "6月", value: 42 },
      { label: "7月", value: 46 },
      { label: "8月", value: 52 },
    ],
    links: [
      { id: "yuki-global-01", shortUrl: "ielts-lp.online/r/yuki-global-01", landingPage: "IELTS対策コース LP", createdAt: "2025-12-01", clicks: 2860, conversions: 52 },
    ],
  },
  {
    id: "reina-suzuki",
    name: "鈴木 玲奈",
    handle: "@reina_studytok",
    channel: "TikTok",
    category: "学生インフルエンサー",
    avatarLabel: "鈴",
    avatarColor: "oklch(58% 0.1 90)",
    email: "reina.suzuki@example.com",
    followers: "約9.1万人",
    payoutMethod: "銀行振込",
    joinedAt: "2026-01-20",
    status: "suspended",
    rates: { tesol: 10, ielts: 10, bundle: 10 },
    totals: { clicks: 1920, conversions: 38, cvr: 1.98, totalReward: 763100, monthReward: 0 },
    monthlyRewards: [
      { label: "3月", value: 18 },
      { label: "4月", value: 22 },
      { label: "5月", value: 26 },
      { label: "6月", value: 30 },
      { label: "7月", value: 34 },
      { label: "8月", value: 0 },
    ],
    links: [
      { id: "reina-tiktok-01", shortUrl: "tesol-lp.online/r/reina-tiktok-01", landingPage: "TESOL資格取得コース LP", createdAt: "2026-03-14", clicks: 1920, conversions: 38 },
    ],
  },
  {
    id: "naoki-yamamoto",
    name: "山本 直樹",
    handle: "英語の裏技",
    channel: "YouTube",
    category: "英語学習系",
    avatarLabel: "山",
    avatarColor: "oklch(52% 0.1 210)",
    email: "naoki.yamamoto@example.com",
    followers: "登録者 3.4万人",
    payoutMethod: "銀行振込",
    joinedAt: "2026-02-02",
    status: "active",
    rates: { tesol: 15, ielts: 15, bundle: 15 },
    totals: { clicks: 1540, conversions: 29, cvr: 1.88, totalReward: 541000, monthReward: 61300 },
    monthlyRewards: [
      { label: "3月", value: 10 },
      { label: "4月", value: 14 },
      { label: "5月", value: 18 },
      { label: "6月", value: 20 },
      { label: "7月", value: 24 },
      { label: "8月", value: 29 },
    ],
    links: [
      { id: "naoki-01", shortUrl: "tesol-lp.online/r/naoki-01", landingPage: "TESOL資格取得コース LP", createdAt: "2026-02-10", clicks: 1540, conversions: 29 },
    ],
  },
  {
    id: "studio-bright-english",
    name: "Studio Bright English",
    handle: "教育メディア",
    channel: "ブログ",
    category: "教育メディア",
    avatarLabel: "S",
    avatarColor: "oklch(50% 0.02 260)",
    email: "editor@studiobright.example.com",
    followers: "月間PV 4.2万",
    payoutMethod: "銀行振込",
    joinedAt: "2026-06-18",
    status: "pending",
    rates: { tesol: 8, ielts: 10, bundle: 10 },
    totals: { clicks: 980, conversions: 21, cvr: 2.14, totalReward: 318600, monthReward: 31900 },
    monthlyRewards: [
      { label: "3月", value: 0 },
      { label: "4月", value: 0 },
      { label: "5月", value: 0 },
      { label: "6月", value: 5 },
      { label: "7月", value: 10 },
      { label: "8月", value: 21 },
    ],
    links: [
      { id: "studio-bright-01", shortUrl: "tesol-lp.online/r/studio-bright-01", landingPage: "TESOL資格取得コース LP", createdAt: "2026-06-20", clicks: 980, conversions: 21 },
    ],
  },
  {
    id: "ayumi-nakamura",
    name: "中村 あゆみ",
    handle: "@ayumi_workingholiday",
    channel: "Instagram",
    category: "ワーホリ系",
    avatarLabel: "中",
    avatarColor: "oklch(60% 0.13 300)",
    email: "ayumi.nakamura@example.com",
    followers: "約2.7万人",
    payoutMethod: "銀行振込",
    joinedAt: "2026-06-30",
    status: "active",
    rates: { tesol: 12, ielts: 12, bundle: 12 },
    totals: { clicks: 610, conversions: 12, cvr: 1.97, totalReward: 204000, monthReward: 96000 },
    monthlyRewards: [
      { label: "3月", value: 0 },
      { label: "4月", value: 0 },
      { label: "5月", value: 0 },
      { label: "6月", value: 0 },
      { label: "7月", value: 6 },
      { label: "8月", value: 12 },
    ],
    links: [
      { id: "ayumi-01", shortUrl: "tesol-lp.online/r/ayumi-01", landingPage: "TESOL資格取得コース LP", createdAt: "2026-07-02", clicks: 610, conversions: 12 },
    ],
  },
];

export function getInfluencerById(id: string) {
  return influencers.find((i) => i.id === id);
}

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

export const recentConversions: Conversion[] = [
  { datetime: "2026-08-22 09:42", influencerId: "misaki-tanaka", linkId: "misaki-01", course: "TESOL資格取得コース", amount: 24000, status: "confirmed" },
  { datetime: "2026-08-22 08:15", influencerId: "ielts-master-channel", linkId: "ielts-master-01", course: "IELTS対策コース", amount: 18500, status: "pending" },
  { datetime: "2026-08-21 21:03", influencerId: "kenta-sato", linkId: "kenta-coach-01", course: "TESOL+IELTSセットコース", amount: 38000, status: "confirmed" },
  { datetime: "2026-08-21 17:40", influencerId: "yuki-global-speak", linkId: "yuki-global-01", course: "IELTS対策コース", amount: 18500, status: "confirmed" },
  { datetime: "2026-08-21 12:22", influencerId: "reina-suzuki", linkId: "reina-tiktok-01", course: "TESOL資格取得コース", amount: 24000, status: "cancelled" },
  { datetime: "2026-08-20 20:11", influencerId: "misaki-tanaka", linkId: "misaki-02", course: "IELTS対策コース", amount: 18500, status: "confirmed" },
  { datetime: "2026-08-20 15:04", influencerId: "misaki-tanaka", linkId: "misaki-summer", course: "TESOL資格取得コース", amount: 24000, status: "confirmed" },
  { datetime: "2026-08-19 11:37", influencerId: "ielts-master-channel", linkId: "ielts-master-01", course: "IELTS対策コース", amount: 18500, status: "confirmed" },
];

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

export const currentPayoutQueue: PayoutQueueItem[] = [
  { influencerId: "misaki-tanaka", confirmedCount: 22, amount: 186400, lastPaidAt: "2026-07-05", status: "unpaid" },
  { influencerId: "ielts-master-channel", confirmedCount: 18, amount: 152900, lastPaidAt: "2026-07-05", status: "unpaid" },
  { influencerId: "kenta-sato", confirmedCount: 15, amount: 134200, lastPaidAt: "2026-07-05", status: "processing" },
  { influencerId: "yuki-global-speak", confirmedCount: 11, amount: 98700, lastPaidAt: "2026-08-01", status: "paid" },
  { influencerId: "ayumi-nakamura", confirmedCount: 6, amount: 96000, lastPaidAt: "—", status: "unpaid" },
  { influencerId: "naoki-yamamoto", confirmedCount: 7, amount: 61300, lastPaidAt: "2026-07-05", status: "unpaid" },
  { influencerId: "studio-bright-english", confirmedCount: 3, amount: 31900, lastPaidAt: "—", status: "held" },
];

export type PayoutBatch = {
  id: string;
  period: string;
  paidAt: string;
  payeeCount: number;
  totalAmount: number;
};

export const payoutHistory: PayoutBatch[] = [
  { id: "PAY-2026-07", period: "2026年7月分", paidAt: "2026-08-05", payeeCount: 7, totalAmount: 1102400 },
  { id: "PAY-2026-06", period: "2026年6月分", paidAt: "2026-07-05", payeeCount: 6, totalAmount: 934200 },
  { id: "PAY-2026-05", period: "2026年5月分", paidAt: "2026-06-05", payeeCount: 6, totalAmount: 812600 },
  { id: "PAY-2026-04", period: "2026年4月分", paidAt: "2026-05-05", payeeCount: 5, totalAmount: 705100 },
];

/* ---------- Settings ---------- */

export type AdminMember = {
  name: string;
  email: string;
  role: "オーナー" | "管理者" | "閲覧のみ";
  status: "有効" | "招待中";
};

export const adminMembers: AdminMember[] = [
  { name: "運営 管理者", email: "admin@online-tesol.jp", role: "オーナー", status: "有効" },
  { name: "高橋 由美", email: "yumi.takahashi@online-tesol.jp", role: "管理者", status: "有効" },
  { name: "外部会計 田村", email: "tamura@accounting-partner.example.com", role: "閲覧のみ", status: "招待中" },
];

