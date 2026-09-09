import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { TopbarUser } from "@/components/TopbarUser";
import { MonthSelect } from "@/components/MonthSelect";
import {
  BellIcon,
  CheckCircleIcon,
  CursorClickIcon,
  TargetIcon,
  TrendUpIcon,
  WalletIcon,
} from "@/components/icons";
import { formatYen } from "@/lib/data";
import { fetchDailyConversionTrend, fetchInfluencers, fetchRecentConversions } from "@/lib/queries";

export const dynamic = "force-dynamic";

const CHART_MAX = 180;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const [influencers, recentConversions, clickTrend, { month: monthParam }] = await Promise.all([
    fetchInfluencers(),
    fetchRecentConversions(),
    fetchDailyConversionTrend(14),
    searchParams,
  ]);
  const trendMax = Math.max(...clickTrend.map((d) => d.v), 1);

  const months = Array.from(
    new Set(influencers.flatMap((inf) => inf.monthlyRewards.map((m) => m.label.replace("月", ""))))
  ).sort((a, b) => Number(a) - Number(b));
  const latestMonth = months[months.length - 1] ?? "8";
  const selectedMonth = monthParam && months.includes(monthParam) ? monthParam : latestMonth;
  const selectedIndex = months.indexOf(selectedMonth);
  const previousMonth = selectedIndex > 0 ? months[selectedIndex - 1] : null;

  const conversionsInMonth = (month: string) =>
    recentConversions.filter((c) => {
      const m = String(Number(c.datetime.slice(5, 7)));
      return m === month;
    });

  const monthConversions = conversionsInMonth(selectedMonth);
  const confirmedThisMonth = monthConversions.filter((c) => c.status === "confirmed");
  const monthReward = confirmedThisMonth.reduce((sum, c) => sum + c.amount, 0);
  const totalConversions = confirmedThisMonth.length;

  const prevConversions = previousMonth ? conversionsInMonth(previousMonth) : [];
  const prevConfirmed = prevConversions.filter((c) => c.status === "confirmed");
  const prevMonthReward = prevConfirmed.reduce((sum, c) => sum + c.amount, 0);
  const prevTotalConversions = prevConfirmed.length;

  const pctChange = (current: number, prev: number) =>
    prev > 0 ? Math.round(((current - prev) / prev) * 1000) / 10 : null;
  const conversionsTrend = pctChange(totalConversions, prevTotalConversions);
  const rewardTrend = pctChange(monthReward, prevMonthReward);

  const totalClicks = influencers.reduce((sum, inf) => sum + inf.totals.clicks, 0);
  const totalConversionsAllTime = influencers.reduce((sum, inf) => sum + inf.totals.conversions, 0);
  const cvr = totalClicks > 0 ? Math.round((totalConversionsAllTime / totalClicks) * 1000) / 10 : 0;

  const topInfluencers = [...influencers]
    .map((inf) => ({
      ...inf,
      selectedMonthReward: inf.monthlyRewards.find((m) => m.label === `${selectedMonth}月`)?.value ?? 0,
    }))
    .sort((a, b) => b.selectedMonthReward - a.selectedMonthReward)
    .slice(0, 5);

  const getInfluencerById = (id: string) => influencers.find((i) => i.id === id);

  return (
    <div className="app">
      <Sidebar active="dashboard" />
      <div className="main">
        <Topbar title="ダッシュボード" subtitle="アフィリエイト実績の全体サマリー">
          <MonthSelect months={months} selected={selectedMonth} />
          <div className="iconbtn">
            <BellIcon />
            <div className="dot" />
          </div>
          <TopbarUser />
        </Topbar>

        <div className="content">
          <div className="kpi-row">
            <KpiCard
              label="累計クリック数"
              value={totalClicks.toLocaleString("ja-JP")}
              icon={<CursorClickIcon width={16} height={16} />}
              iconBg="oklch(94% 0.03 262)"
              iconColor="oklch(42% 0.13 262)"
            />
            <KpiCard
              label={`${selectedMonth}月のコンバージョン数`}
              value={totalConversions.toLocaleString("ja-JP")}
              unit="件"
              trend={conversionsTrend}
              icon={<CheckCircleIcon width={16} height={16} />}
              iconBg="oklch(94% 0.05 150)"
              iconColor="oklch(42% 0.11 150)"
            />
            <KpiCard
              label="累計コンバージョン率"
              value={`${cvr}%`}
              trendUnit="pt"
              icon={<TargetIcon width={16} height={16} />}
              iconBg="oklch(95% 0.06 75)"
              iconColor="oklch(48% 0.12 65)"
            />
            <KpiCard
              label={`確定報酬額(${selectedMonth}月)`}
              value={formatYen(monthReward)}
              trend={rewardTrend}
              icon={<WalletIcon width={16} height={16} />}
              iconBg="oklch(24% 0.04 262)"
              iconColor="oklch(78% 0.12 75)"
            />
          </div>

          <div className="row2">
            <div className="card">
              <div className="card-head">
                <h2>コンバージョン推移(過去14日)</h2>
                <span>日別CV数</span>
              </div>
              <div className="chart-wrap">
                {clickTrend.map((d, i) => (
                  <div className="bar-col" key={d.x}>
                    <div
                      className={`bar${i % 3 === 0 && i % 6 !== 0 ? " alt" : ""}`}
                      style={{ height: `${Math.max(2, Math.round((d.v / trendMax) * CHART_MAX))}px` }}
                      title={`${d.x}: ${d.v}件`}
                    />
                    <div className="bar-x">{d.x}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h2>トップインフルエンサー</h2>
                <span>{selectedMonth}月</span>
              </div>
              <div className="rank-list">
                {topInfluencers.map((inf, i) => (
                  <Link href={`/influencers/${inf.id}`} className="rank-item" key={inf.id}>
                    <div className={`rank-num${i < 3 ? " top" : ""}`}>{i + 1}</div>
                    <div className="rank-avatar" style={{ background: inf.avatarColor }}>
                      {inf.avatarLabel}
                    </div>
                    <div className="rank-info">
                      <b>{inf.name}</b>
                      <span>{inf.handle}</span>
                    </div>
                    <div className="rank-amount">{formatYen(inf.selectedMonthReward)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2>{selectedMonth}月のコンバージョン</h2>
              <Link href="/links" style={{ fontSize: 12, fontWeight: 600 }}>
                すべて見る →
              </Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>発生日時</th>
                  <th>インフルエンサー</th>
                  <th>コース</th>
                  <th>金額</th>
                  <th>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {monthConversions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      この月のコンバージョンはありません。
                    </td>
                  </tr>
                ) : (
                  monthConversions.map((c, i) => {
                    const inf = getInfluencerById(c.influencerId);
                    if (!inf) return null;
                    const badgeClass =
                      c.status === "confirmed" ? "ok" : c.status === "pending" ? "pending" : "cancel";
                    const label =
                      c.status === "confirmed" ? "確定" : c.status === "pending" ? "保留" : "キャンセル";
                    return (
                      <tr key={`${c.linkId}-${i}`}>
                        <td>{c.datetime}</td>
                        <td>
                          <div className="cell-user">
                            <div className="cell-avatar" style={{ background: inf.avatarColor }}>
                              {inf.avatarLabel}
                            </div>
                            {inf.name}
                          </div>
                        </td>
                        <td>{c.course}</td>
                        <td className="num">{formatYen(c.amount)}</td>
                        <td>
                          <span className={`badge ${badgeClass}`}>{label}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  unit,
  trend,
  trendUnit = "%",
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  unit?: string;
  trend?: number | null;
  trendUnit?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="kpi-value">
        {value}
        {unit ? <small> {unit}</small> : null}
      </div>
      {trend != null && (
        <div className={`kpi-trend ${trend >= 0 ? "up" : "down"}`}>
          <TrendUpIcon />
          {trend >= 0 ? "+" : ""}
          {trend}
          {trendUnit} 前月比
        </div>
      )}
    </div>
  );
}
