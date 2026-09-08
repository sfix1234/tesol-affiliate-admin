import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LinkIssuer } from "@/components/LinkIssuer";
import { ArrowLeftIcon, EditIcon } from "@/components/icons";
import { formatYen, statusBadgeClass, statusLabel } from "@/lib/data";
import { fetchCourses, fetchInfluencerById } from "@/lib/queries";

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
        <header className="topbar">
          <Link href="/influencers" className="backlink">
            <ArrowLeftIcon />
            インフルエンサー一覧に戻る
          </Link>
          <button className="btn ghost">
            <EditIcon />
            プロフィールを編集
          </button>
        </header>

        <div className="content">
          <div className="profile-head">
            <div className="profile-avatar" style={{ background: inf.avatarColor }}>
              {inf.avatarLabel}
            </div>
            <div className="profile-info">
              <h1>
                {inf.name}{" "}
                <span className={`badge ${statusBadgeClass[inf.status]}`}>
                  {statusLabel[inf.status]}
                </span>
              </h1>
              <p>
                {inf.handle} ・ {inf.channel} / {inf.category} ・ 登録日 {inf.joinedAt}
              </p>
            </div>
          </div>

          <div className="grid2">
            <div className="col">
              <div className="card">
                <div className="card-head">
                  <h2>基本情報</h2>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span>メールアドレス</span>
                    <b>{inf.email}</b>
                  </div>
                  <div className="info-item">
                    <span>主要SNS</span>
                    <b>
                      {inf.channel} ({inf.handle})
                    </b>
                  </div>
                  <div className="info-item">
                    <span>フォロワー数</span>
                    <b>{inf.followers}</b>
                  </div>
                  <div className="info-item">
                    <span>支払方法</span>
                    <b>{inf.payoutMethod}</b>
                  </div>
                  <div className="info-item">
                    <span>登録日</span>
                    <b>{inf.joinedAt}</b>
                  </div>
                  <div className="info-item">
                    <span>担当者</span>
                    <b>運営 管理者</b>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h2>コース別手数料率設定</h2>
                  <span>割合(%) で設定</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>コース</th>
                      <th>コース単価</th>
                      <th>手数料率</th>
                      <th>1件あたり報酬</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => {
                      const rate = inf.rates[course.key as keyof typeof inf.rates];
                      const reward = Math.round((course.price * rate) / 100);
                      return (
                        <tr key={course.key}>
                          <td>{course.name}</td>
                          <td className="num">{formatYen(course.price)}</td>
                          <td>
                            <div className="rateinput">
                              <input defaultValue={rate} readOnly />
                              <span>%</span>
                            </div>
                          </td>
                          <td className="num">{formatYen(reward)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="savebar">
                  <button className="btn primary">手数料設定を保存</button>
                </div>
              </div>

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
