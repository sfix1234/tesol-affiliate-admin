import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar, TopbarUser } from "@/components/Topbar";
import { ArrowRightIcon, ChevronDownIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { formatYen, statusBadgeClass, statusLabel } from "@/lib/data";
import { fetchInfluencers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InfluencersPage() {
  const influencers = await fetchInfluencers();
  return (
    <div className="app">
      <Sidebar active="influencers" />
      <div className="main">
        <Topbar title="インフルエンサー管理" subtitle="紹介パートナーの一覧・手数料設定">
          <TopbarUser />
        </Topbar>

        <div className="content">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="searchbox">
                <SearchIcon width={15} height={15} />
                <input placeholder="名前・SNSアカウントで検索" />
              </div>
              <div className="selectpill">
                ステータス: すべて
                <ChevronDownIcon width={13} height={13} />
              </div>
              <div className="selectpill">
                カテゴリ: すべて
                <ChevronDownIcon width={13} height={13} />
              </div>
            </div>
            <button className="btn primary">
              <PlusIcon />
              新規インフルエンサー登録
            </button>
          </div>

          <div className="card flush">
            <table>
              <thead>
                <tr>
                  <th>インフルエンサー</th>
                  <th>カテゴリ</th>
                  <th>手数料率(TESOL / IELTS)</th>
                  <th>累計CV数</th>
                  <th>累計報酬額</th>
                  <th>ステータス</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((inf) => (
                  <tr key={inf.id}>
                    <td>
                      <div className="cell-user lg">
                        <div className="cell-avatar" style={{ background: inf.avatarColor }}>
                          {inf.avatarLabel}
                        </div>
                        <div>
                          <b>{inf.name}</b>
                          <span>
                            {inf.handle} ・ {inf.channel}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{inf.category}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <b style={{ fontSize: 12.5, fontWeight: 700 }}>
                          {inf.rates.tesol}% / {inf.rates.ielts}%
                        </b>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          コース単価連動
                        </span>
                      </div>
                    </td>
                    <td className="num">{inf.totals.conversions}件</td>
                    <td className="num">{formatYen(inf.totals.totalReward)}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass[inf.status]}`}>
                        {statusLabel[inf.status]}
                      </span>
                    </td>
                    <td>
                      <Link href={`/influencers/${inf.id}`} className="rowlink">
                        詳細を見る <ArrowRightIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="foot">
              <span>全{influencers.length}件中 1–{influencers.length}件を表示</span>
              <div className="pagebtns">
                <div className="pagebtn active">1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
