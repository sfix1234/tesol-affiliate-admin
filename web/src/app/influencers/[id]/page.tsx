import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LinkIssuer } from "@/components/LinkIssuer";
import { formatYen } from "@/lib/data";
import { fetchCourses, fetchInfluencerById } from "@/lib/queries";
import { ProfileEditor, RatesEditor } from "./InfluencerEditors";

export const dynamic = "force-dynamic";

export default async function InfluencerDetailPage({
  params,
}: PageProps<"/influencers/[id]">) {
  const { id } = await params;
  const [inf, courses] = await Promise.all([fetchInfluencerById(id), fetchCourses()]);
  if (!inf) notFound();

  const maxMonthly = Math.max(...inf.monthlyRewards.map((m) => m.value), 1);

  return (
    <div className="app">
      <Sidebar active="influencers" />
      <div className="main">
        <div className="content">
          <ProfileEditor inf={inf} />

          <div className="grid2">
            <div className="col">
              <RatesEditor inf={inf} courses={courses} />

              <div className="card">
                <div className="card-head">
                  <h2>専用リンク発行</h2>
                </div>
                <LinkIssuer influencerId={inf.id} initialLinks={inf.links} courses={courses} />
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-head">
                  <h2>実績サマリー</h2>
                </div>
                <div className="stat-list">
                  <div className="stat-row">
                    <span>累計クリック数</span>
                    <b>{inf.totals.clicks.toLocaleString("ja-JP")}</b>
                  </div>
                  <div className="stat-row">
                    <span>累計コンバージョン数</span>
                    <b>{inf.totals.conversions}件</b>
                  </div>
                  <div className="stat-row">
                    <span>コンバージョン率</span>
                    <b>{inf.totals.cvr}%</b>
                  </div>
                  <div className="stat-row highlight">
                    <span>累計確定報酬額</span>
                    <b>{formatYen(inf.totals.totalReward)}</b>
                  </div>
                  <div className="stat-row">
                    <span>今月の報酬額</span>
                    <b>{formatYen(inf.totals.monthReward)}</b>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h2>月別報酬推移</h2>
                </div>
                <div className="mini-chart">
                  {inf.monthlyRewards.map((m) => (
                    <div className="mini-bar-col" key={m.label}>
                      <div
                        className="mini-bar"
                        style={{ height: `${Math.max(4, Math.round((m.value / maxMonthly) * 110))}px` }}
                      />
                      <div className="mini-bar-x">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
