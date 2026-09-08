"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WalletIcon } from "@/components/icons";
import { processPayoutBatch } from "@/lib/actions";
import { formatYen, type Influencer, type PayoutQueueItem } from "@/lib/data";

export function PayoutActions({
  queue,
  influencers,
}: {
  queue: PayoutQueueItem[];
  influencers: Influencer[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const targetCount = queue.filter((p) => p.status === "unpaid" || p.status === "processing").length;
  const targetAmount = queue
    .filter((p) => p.status === "unpaid" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);

  function exportCsv() {
    const header = ["インフルエンサー", "確定CV数", "支払い予定額", "前回支払日", "ステータス"];
    const rows = queue.map((p) => {
      const inf = influencers.find((i) => i.id === p.influencerId);
      return [inf?.name ?? p.influencerId, p.confirmedCount, p.amount, p.lastPaidAt, p.status];
    });
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payout-queue-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleBatchPay() {
    setPending(true);
    try {
      await processPayoutBatch();
      setConfirming(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn ghost" onClick={exportCsv}>
        CSVエクスポート
      </button>
      <button className="btn primary" onClick={() => setConfirming(true)} disabled={targetCount === 0}>
        <WalletIcon width={15} height={15} />
        一括で支払い処理
      </button>

      {confirming && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>一括で支払い処理</h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
              支払い待ち・処理中の{targetCount}件({formatYen(targetAmount)})を支払い済みにします。よろしいですか？
            </p>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setConfirming(false)} disabled={pending}>
                キャンセル
              </button>
              <button type="button" className="btn primary" onClick={handleBatchPay} disabled={pending}>
                {pending ? "処理中..." : "支払い済みにする"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
