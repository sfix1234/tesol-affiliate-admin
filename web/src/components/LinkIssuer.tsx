"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { PlusIcon } from "./icons";
import type { Course } from "@/lib/data";
import { createAffiliateLink } from "@/lib/actions";

type LinkItem = {
  id: string;
  shortUrl: string;
  landingPage: string;
  createdAt: string;
  clicks: number;
  conversions: number;
};

export function LinkIssuer({
  influencerId,
  initialLinks,
  courses,
}: {
  influencerId: string;
  initialLinks: LinkItem[];
  courses: Course[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [courseKey, setCourseKey] = useState("");
  const [tag, setTag] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIssue() {
    if (!courseKey) return;
    setIssuing(true);
    setError(null);
    try {
      const newLink = await createAffiliateLink({ influencerId, courseKey, tag });
      setLinks((prev) => [newLink, ...prev]);
      setCourseKey("");
      setTag("");
    } catch {
      setError("リンクの発行に失敗しました。もう一度お試しください。");
    } finally {
      setIssuing(false);
    }
  }

  return (
    <>
      <div className="link-form">
        <select
          className="select"
          value={courseKey}
          onChange={(e) => setCourseKey(e.target.value)}
        >
          <option value="">遷移先LPを選択...</option>
          {courses.map((c) => (
            <option key={c.key} value={c.key}>
              {c.name} LP
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="キャンペーンタグ(任意) 例: summer"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          className="btn primary"
          style={{ flexShrink: 0 }}
          onClick={handleIssue}
          disabled={!courseKey || issuing}
        >
          <PlusIcon />
          {issuing ? "発行中..." : "発行"}
        </button>
      </div>
      {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
      <div>
        {links.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0 }}>
            まだ専用リンクが発行されていません。
          </p>
        ) : (
          links.map((link) => (
            <div className="linkrow" key={link.id}>
              <div className="linkrow-main">
                <b>{link.shortUrl}</b>
                <span>
                  {link.landingPage} ・ 発行日 {link.createdAt}
                </span>
              </div>
              <div className="linkrow-stats">
                <div>
                  <span>クリック</span>
                  <b>{link.clicks.toLocaleString("ja-JP")}</b>
                </div>
                <div>
                  <span>CV</span>
                  <b>{link.conversions}</b>
                </div>
              </div>
              <CopyButton value={`https://${link.shortUrl}`} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
