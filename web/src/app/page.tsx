import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar, TopbarUser } from "@/components/Topbar";
import {
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CursorClickIcon,
  TargetIcon,
  TrendUpIcon,
  WalletIcon,
} from "@/components/icons";
import {
  clickTrend,
  dashboardKpis,
  formatYen,
  getInfluencerById,
  influencers,
  recentConversions,
} from "@/lib/data";

const CHART_MAX = 180;

const topInfluencers = [...influencers]
  .sort((a, b) => b.totals.monthReward - a.totals.monthReward)
  .slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="app">
      <Sidebar active="dashboard" />
      <div className="main">
        <Topbar title="ダッシュボード" subtitle="アフィリエイト実績の全体サマリー">
          <div className="pill">
            <CalendarIcon width={14} height={14} />
            今月(2026年8月)
            <ChevronDownIcon width={14} height={14} />
          </div>
          <div className="iconbtn">
            <BellIcon />
            <div className="dot" />
          </div>
          <TopbarUser />
        </Topbar>

        <div className="content">
          <div className="kpi-row">
            <KpiCard
              label="総クリック数"
              value={dashboardKpis.totalClicks.toLocaleString("ja-JP")}
              trend={dashboardKpis.totalClicksTrend}
              icon={<CursorClickIcon width={16} height={16} />}
              iconBg="oklch(94% 0.03 262)"
              iconColor="oklch(42% 0.13 262)"
            />
            <KpiCard
              label="総コンバージョン数"
              value={dashboardKpis.totalConversions.toLocaleString("ja-JP")}
              unit="件"
              trend={dashboardKpis.totalConversionsTrend}
              icon={<CheckCircleIcon width={16} height={16} />}
              iconBg="oklch(94% 0.05 150)"
              iconColor="oklch(42% 0.11 150)"
            />
            <KpiCard
              label="コンバージョン率"
              value={`${dashboardKpis.cvr}%`}
              trend={dashboardKpis.cvrTrend}
              trendUnit="pt"
              icon={<TargetIcon width={16} height={16} />}
              iconBg="oklch(95% 0.06 75)"
              iconColor="oklch(48% 0.12 65)"
            />
            <KpiCard
              label="確定報酬額(今月)"
              value={formatYen(dashboardKpis.monthReward)}
              trend={dashboardKpis.monthRewardTrend}
              icon={<WalletIcon width={16} height={16} />}
              iconBg="oklch(24% 0.04 262)"
              iconColor="oklch(78% 0.12 75)"
            />
          </div>

          <div className="row2">
            <div className="card">
              <div className="card-head">
                <h2>コンバージョン推移(過去14日)</h2>
                <span>クリック数・CV数</span>
              </div>
              <div className="chart-wrap">
                {clickTrend.map((d, i) => (
                  <div className="bar-col" key={d.x}>
                    <div
                      className={`bar${i % 3 === 0 && i % 6 !== 0 ? " alt" : ""}`}
                      style={{ height: `${Math.round((d.v / 50) * CHART_MAX)}px` }}
                    />
                    <div className="bar-x">{d.x}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h2>トップインフルエンサー</h2>
                <span>今月</span>
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
                    <div className="rank-amount">{formatYen(inf.totals.monthReward)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2>直近のコンバージョン</h2>
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
                {recentConversions.map((c, i) => {
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
                })}
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
  trend: number;
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
      <div className="kpi-trend up">
        <TrendUpIcon />+{trend}
        {trendUnit} 前月比
      </div>
    </div>
  );
}
