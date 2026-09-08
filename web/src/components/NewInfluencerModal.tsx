"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "./icons";
import { createInfluencer } from "@/lib/actions";
import type { Course } from "@/lib/data";

const emptyBaseForm = {
  name: "",
  handle: "",
  channel: "",
  category: "",
  email: "",
  followers: "",
  payoutMethod: "銀行振込",
};

export function NewInfluencerButton({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyBaseForm);
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(courses.map((c) => [c.key, c.defaultRate]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function close() {
    setOpen(false);
    setForm(emptyBaseForm);
    setRates(Object.fromEntries(courses.map((c) => [c.key, c.defaultRate])));
    setError(null);
    setDone(false);
  }

  function set<K extends keyof typeof emptyBaseForm>(key: K, value: (typeof emptyBaseForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createInfluencer({
        name: form.name,
        handle: form.handle,
        channel: form.channel,
        category: form.category,
        email: form.email,
        followers: form.followers,
        payoutMethod: form.payoutMethod,
        rates,
      });
      setDone(true);
      router.refresh();
    } catch {
      setError("登録に失敗しました。入力内容を確認してもう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>
        <PlusIcon />
        新規インフルエンサー登録
      </button>
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="modal-success">
                <h3>登録しました</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  ステータス「審査中」として登録されました。一覧から確認・編集できます。
                </p>
                <div className="modal-actions">
                  <button type="button" className="btn ghost" onClick={close}>
                    閉じる
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>新規インフルエンサー登録</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                  <label>
                    名前
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                  </label>
                  <label>
                    SNSアカウント / チャンネル名
                    <input value={form.handle} onChange={(e) => set("handle", e.target.value)} placeholder="例: @example_english" />
                  </label>
                  <label>
                    主要SNS
                    <input value={form.channel} onChange={(e) => set("channel", e.target.value)} placeholder="例: Instagram / YouTube / TikTok" />
                  </label>
                  <label>
                    カテゴリ
                    <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="例: 英語学習系" />
                  </label>
                  <label>
                    メールアドレス
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                  </label>
                  <label>
                    フォロワー数
                    <input value={form.followers} onChange={(e) => set("followers", e.target.value)} placeholder="例: 約5万人" />
                  </label>
                  <label>
                    支払方法
                    <input value={form.payoutMethod} onChange={(e) => set("payoutMethod", e.target.value)} />
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {courses.map((c) => (
                      <label key={c.key} style={{ flex: 1, minWidth: 100 }}>
                        {c.name}手数料率(%)
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={rates[c.key] ?? 0}
                          onChange={(e) =>
                            setRates((prev) => ({ ...prev, [c.key]: Number(e.target.value) }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
                  <div className="modal-actions">
                    <button type="button" className="btn ghost" onClick={close}>
                      キャンセル
                    </button>
                    <button type="submit" className="btn primary" disabled={submitting}>
                      {submitting ? "登録中..." : "登録する"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
