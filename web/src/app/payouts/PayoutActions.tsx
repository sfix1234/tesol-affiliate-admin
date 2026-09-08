"use client";

import { type Influencer, type PayoutQueueItem } from "@/lib/data";

export function PayoutActions({
  queue,
  influencers,
}: {
  queue: PayoutQueueItem[];
  influencers: Influencer[];
}) {
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

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn ghost" onClick={exportCsv}>
        CSVエクスポート
      </button>
    </div>
  );
}
