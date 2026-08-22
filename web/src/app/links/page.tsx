"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar, TopbarUser } from "@/components/Topbar";
import { CopyButton } from "@/components/CopyButton";
import { NewLinkButton } from "@/components/NewLinkModal";
import { CalendarIcon, ChevronDownIcon } from "@/components/icons";
import {
  conversionStatusBadgeClass,
  conversionStatusLabel,
  formatYen,
  getInfluencerById,
  influencers,
  recentConversions,
  type Influencer,
} from "@/lib/data";

type LinkRow = {
  id: string;
  shortUrl: string;
  landingPage: string;
  createdAt: string;
  clicks: number;
  conversions: number;
  influencer: Influencer;
  cvr: number;
  reward: number;
  active: boolean;
};

function courseAveragePrice(landingPage: string) {
  if (landingPage.includes("IELTS") && landingPage.includes("TESOL")) return 38000;
  if (landingPage.includes("IELTS")) return 18500;
  return 24000;
}

function toRow(
  link: { id: string; shortUrl: string; landingPage: string; createdAt: string; clicks: number; conversions: number },
  inf: Influencer
): LinkRow {
  return {
    ...link,
    influencer: inf,
    cvr: link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
    reward: Math.round(
      (link.conversions * (courseAveragePrice(link.landingPage) * (inf.rates.tesol / 100 + inf.rates.ielts / 100))) / 2
    ),
    active: inf.status !== "suspended",
  };
}

const baseLinks: LinkRow[] = influencers.flatMap((inf) => inf.links.map((link) => toRow(link, inf)));

export default function LinksPage() {
  const [extraLinks, setExtraLinks] = useState<LinkRow[]>([]);

  const allLinks = useMemo(() => [...extraLinks, ...baseLinks], [extraLinks]);

  function handleCreate(link: {
    id: string;
    shortUrl: string;
    landingPage: string;
    createdAt: string;
    clicks: number;
    conversions: number;
    influencerId: string;
  }) {
    const inf = getInfluencerById(link.influencerId);
    if (!inf) return;
    setExtraLinks((prev) => [toRow(link, inf), ...prev]);
  }

  return (
    <div className="app">
      <Sidebar active="links" />
      <div className="main">
        <Topbar title="リンク管理・コンバージョン計測" subtitle="発行済みリンクの実績とコンバージョンログ">
          <TopbarUser />
        </Topbar>

        <div className="content page-stack">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="selectpill">
                インフルエンサー: すべて
                <ChevronDownIcon width={13} height={13} />
              </div>
              <div className="selectpill">
                遷移先LP: すべて
                <ChevronDownIcon width={13} height={13} />
              </div>
              <div className="selectpill">
                <CalendarIcon width={14} height={14} />
                直近30日
                <ChevronDownIcon width={13} height={13} />
              </div>
            </div>
            <NewLinkButton onCreate={handleCreate} />
          </div>

          <div className="card flush">
            <div className="card-head">
              <h2>発行済みリンク一覧</h2>
              <span>全{allLinks.length}件</span>
            </div>
            <div className="card-pad">
              <table>
                <thead>
                  <tr>
                    <th>リンク</th>
                    <th>インフルエンサー</th>
                    <th>遷移先LP</th>
                    <th>発行日</th>
                    <th>クリック数</th>
                    <th>CV数</th>
                    <th>CVR</th>
                    <th>発生報酬額</th>
                    <th>ステータス</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allLinks.map((link) => (
                    <tr key={link.id}>
                      <td className="linkcell">
                        <b>r/{link.id}</b>
                        <span>{link.shortUrl}</span>
                      </td>
                      <td>
                        <div className="cell-user">
                          <div className="cell-avatar" style={{ background: link.influencer.avatarColor }}>
                            {link.influencer.avatarLabel}
                          </div>
                          {link.influencer.name}
                        </div>
                      </td>
                      <td>{link.landingPage}</td>
                      <td>{link.createdAt}</td>
                      <td className="num">{link.clicks.toLocaleString("ja-JP")}</td>
                      <td className="num">{link.conversions}</td>
                      <td className="num">{link.cvr.toFixed(2)}%</td>
                      <td className="num">{formatYen(link.reward)}</td>
                      <td>
                        <span className={`badge ${link.active ? "ok" : "off"}`}>
                          {link.active ? "有効" : "無効"}
                        </span>
                      </td>
                      <td>
                        <CopyButton value={`https://${link.shortUrl}`} small />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card flush">
            <div className="card-head">
              <h2>コンバージョン詳細ログ</h2>
              <span>直近30日 ・ 全{recentConversions.length}件を表示</span>
            </div>
            <div className="card-pad">
              <table>
                <thead>
                  <tr>
                    <th>発生日時</th>
                    <th>リンク</th>
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
                    return (
                      <tr key={`${c.linkId}-${i}`}>
                        <td>{c.datetime}</td>
                        <td className="linkcell">
                          <b>r/{c.linkId}</b>
                        </td>
                        <td>{inf.name}</td>
                        <td>{c.course}</td>
                        <td className="num">{formatYen(c.amount)}</td>
                        <td>
                          <span className={`badge ${conversionStatusBadgeClass[c.status]}`}>
                            {conversionStatusLabel[c.status]}
                          </span>
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
    </div>
  );
}
