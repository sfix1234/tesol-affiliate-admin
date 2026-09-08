"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { PlusIcon } from "./icons";
import type { Course, Influencer } from "@/lib/data";
import { createAffiliateLink } from "@/lib/actions";

type CreatedLink = {
  id: string;
  shortUrl: string;
  landingPage: string;
  courseKey: string;
  createdAt: string;
  clicks: number;
  conversions: number;
};

export function NewLinkButton({
  courses,
  influencers,
  onCreate,
}: {
  courses: Course[];
  influencers: Influencer[];
  onCreate: (link: CreatedLink & { influencerId: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [influencerId, setInfluencerId] = useState("");
  const [courseKey, setCourseKey] = useState("");
  const [tag, setTag] = useState("");
  const [created, setCreated] = useState<CreatedLink | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setInfluencerId("");
    setCourseKey("");
    setTag("");
    setCreated(null);
    setError(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!influencerId || !courseKey) return;
    setSubmitting(true);
    setError(null);
    try {
      const link = await createAffiliateLink({ influencerId, courseKey, tag });
      onCreate({ ...link, influencerId });
      setCreated(link);
    } catch {
      setError("リンクの発行に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>
        <PlusIcon />
        新規リンク発行
      </button>
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {created ? (
              <div className="modal-success">
                <h3>リンクを発行しました</h3>
                <div className="modal-success-link">
                  <b>{created.shortUrl}</b>
                  <CopyButton value={`https://${created.shortUrl}`} small />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn ghost" onClick={close}>
                    閉じる
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>新規リンク発行</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                  <label>
                    インフルエンサー
                    <select
                      value={influencerId}
                      onChange={(e) => setInfluencerId(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        選択してください
                      </option>
                      {influencers.map((inf) => (
                        <option key={inf.id} value={inf.id}>
                          {inf.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    遷移先LP
                    <select
                      value={courseKey}
                      onChange={(e) => setCourseKey(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        選択してください
                      </option>
                      {courses.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.name} LP
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    キャンペーンタグ(任意)
                    <input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="例: summer"
                    />
                  </label>
                  {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
                  <div className="modal-actions">
                    <button type="button" className="btn ghost" onClick={close}>
                      キャンセル
                    </button>
                    <button type="submit" className="btn primary" disabled={submitting}>
                      {submitting ? "発行中..." : "発行する"}
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
