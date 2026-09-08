import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { TopbarUser } from "@/components/TopbarUser";
import {
  CalendarIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  WalletIcon,
} from "@/components/icons";
import { formatYen, payoutStatusBadgeClass, payoutStatusLabel } from "@/lib/data";
import { fetchInfluencers, fetchPayoutHistory, fetchPayoutQueue } from "@/lib/queries";
import { PayoutActions } from "./PayoutActions";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const [currentPayoutQueue, payoutHistory, influencers] = await Promise.all([
    fetchPayoutQueue(),
    fetchPayoutHistory(),
    fetchInfluencers(),
  ]);
  const getInfluencerById = (id: string) => influencers.find((i) => i.id === id);
  const payeeCount = currentPayoutQueue.length;
  const totalDue = currentPayoutQueue.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = currentPayoutQueue
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const heldCount = currentPayoutQueue.filter((p) => p.status === "held").length;

  return (
    <div className="app">
      <Sidebar active="payouts" />
      <div className="main">
        <Topbar title="精算・支払い" subtitle="インフルエンサーへの報酬支払い管理">
          <TopbarUser />
        </Topbar>

        <div className="content page-stack">
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">今月の支払い対象</span>
                <div className="kpi-icon" style={{ background: "oklch(94% 0.03 262)", color: "oklch(42% 0.13 262)" }}>
                  <WalletIcon width={16} height={16} />
                </div>
              </div>
              <div className="kpi-value">
                {payeeCount}
                <small> 人</small>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">今月の支払い予定額</span>
                <div className="kpi-icon" style={{ background: "oklch(24% 0.04 262)", color: "oklch(78% 0.12 75)" }}>
                  <WalletIcon width={16} height={16} />
                </div>
              </div>
              <div className="kpi-value">{formatYen(totalDue)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">支払い済み額</span>
                <div className="kpi-icon" style={{ background: "oklch(94% 0.05 150)", color: "oklch(42% 0.11 150)" }}>
                  <CheckCircleIcon width={16} height={16} />
                </div>
              </div>
              <div className="kpi-value">{formatYen(paidAmount)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">保留中の件数</span>
                <div className="kpi-icon" style={{ background: "oklch(95% 0.02 25)", color: "oklch(50% 0.02 25)" }}>
                  <WalletIcon width={16} height={16} />
                </div>
              </div>
              <div className="kpi-value">
                {heldCount}
                <small> 件</small>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <div className="toolbar-left">
              <div className="pill">
                <CalendarIcon width={14} height={14} />
                次回支払日: 2026-09-05
              </div>
              <div className="selectpill">
                ステータス: すべて
                <ChevronDownIcon width={13} height={13} />
              </div>
            </div>
            <PayoutActions queue={currentPayoutQueue} influencers={influencers} />
          </div>

          <div className="card flush">
            <div className="card-head">
              <h2>支払い対象者一覧</h2>
              <span>2026年8月分</span>
            </div>
            <div className="card-pad">
              <table>
                <thead>
                  <tr>
                    <th>インフルエンサー</th>
                    <th>確定CV数</th>
                    <th>支払い予定額</th>
                    <th>前回支払日</th>
                    <th>ステータス</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayoutQueue.map((p) => {
                    const inf = getInfluencerById(p.influencerId);
                    if (!inf) return null;
                    return (
                      <tr key={p.influencerId}>
                        <td>
                          <div className="cell-user lg">
                            <div className="cell-avatar" style={{ background: inf.avatarColor }}>
                              {inf.avatarLabel}
                            </div>
                            <div>
                              <b>{inf.name}</b>
                              <span>{inf.handle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="num">{p.confirmedCount}件</td>
                        <td className="num">{formatYen(p.amount)}</td>
                        <td>{p.lastPaidAt}</td>
                        <td>
                          <span className={`badge ${payoutStatusBadgeClass[p.status]}`}>
                            {payoutStatusLabel[p.status]}
                          </span>
                        </td>
                        <td>
                          <Link href={`/influencers/${inf.id}`} className="rowlink">
                            明細を見る
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card flush">
            <div className="card-head">
              <h2>支払い履歴</h2>
              <span>過去の支払いバッチ</span>
            </div>
            <div className="card-pad">
              <table>
                <thead>
                  <tr>
                    <th>対象期間</th>
                    <th>支払日</th>
                    <th>対象人数</th>
                    <th>合計金額</th>
                    <th>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((batch) => (
                    <tr key={batch.id}>
                      <td>{batch.period}</td>
                      <td>{batch.paidAt}</td>
                      <td className="num">{batch.payeeCount}人</td>
                      <td className="num">{formatYen(batch.totalAmount)}</td>
                      <td>
                        <span className="badge ok">支払い完了</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
