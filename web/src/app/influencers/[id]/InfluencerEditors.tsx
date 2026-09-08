"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditIcon } from "@/components/icons";
import { updateInfluencerProfile, updateInfluencerRates } from "@/lib/actions";
import { formatYen, statusBadgeClass, statusLabel, type Course, type Influencer, type InfluencerStatus } from "@/lib/data";

export function ProfileEditor({ inf }: { inf: Influencer }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(inf.email);
  const [followers, setFollowers] = useState(inf.followers);
  const [payoutMethod, setPayoutMethod] = useState(inf.payoutMethod);
  const [status, setStatus] = useState<InfluencerStatus>(inf.status);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    setPending(true);
    try {
      await updateInfluencerProfile({ id: inf.id, email, followers, payoutMethod, status });
      setEditing(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  function cancel() {
    setEmail(inf.email);
    setFollowers(inf.followers);
    setPayoutMethod(inf.payoutMethod);
    setStatus(inf.status);
    setEditing(false);
  }

  return (
    <>
      <header className="topbar">
        <a href="/influencers" className="backlink">
          ← インフルエンサー一覧に戻る
        </a>
        {editing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={cancel} disabled={pending}>
              キャンセル
            </button>
            <button className="btn primary" onClick={handleSave} disabled={pending}>
              {pending ? "保存中..." : "保存する"}
            </button>
          </div>
        ) : (
          <button className="btn ghost" onClick={() => setEditing(true)}>
            <EditIcon />
            プロフィールを編集
          </button>
        )}
      </header>

      <div className="profile-head">
        <div className="profile-avatar" style={{ background: inf.avatarColor }}>
          {inf.avatarLabel}
        </div>
        <div className="profile-info">
          <h1>
            {inf.name}{" "}
            {editing ? (
              <select value={status} onChange={(e) => setStatus(e.target.value as InfluencerStatus)}>
                <option value="active">有効</option>
                <option value="suspended">停止</option>
                <option value="pending">審査中</option>
              </select>
            ) : (
              <span className={`badge ${statusBadgeClass[inf.status]}`}>{statusLabel[inf.status]}</span>
            )}
          </h1>
          <p>
            {inf.handle} ・ {inf.channel} / {inf.category} ・ 登録日 {inf.joinedAt}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>基本情報</h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span>メールアドレス</span>
            {editing ? <input value={email} onChange={(e) => setEmail(e.target.value)} /> : <b>{inf.email}</b>}
          </div>
          <div className="info-item">
            <span>主要SNS</span>
            <b>
              {inf.channel} ({inf.handle})
            </b>
          </div>
          <div className="info-item">
            <span>フォロワー数</span>
            {editing ? (
              <input value={followers} onChange={(e) => setFollowers(e.target.value)} />
            ) : (
              <b>{inf.followers}</b>
            )}
          </div>
          <div className="info-item">
            <span>支払方法</span>
            {editing ? (
              <input value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} />
            ) : (
              <b>{inf.payoutMethod}</b>
            )}
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
    </>
  );
}

export function RatesEditor({ inf, courses }: { inf: Influencer; courses: Course[] }) {
  const router = useRouter();
  const [rates, setRates] = useState({ ...inf.rates });
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setPending(true);
    setSaved(false);
    try {
      await updateInfluencerRates({ id: inf.id, rates });
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
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
            const rate = rates[course.key as keyof typeof rates];
            const reward = Math.round((course.price * rate) / 100);
            return (
              <tr key={course.key}>
                <td>{course.name}</td>
                <td className="num">{formatYen(course.price)}</td>
                <td>
                  <div className="rateinput">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={rate}
                      onChange={(e) => {
                        setRates((prev) => ({ ...prev, [course.key]: Number(e.target.value) }));
                        setSaved(false);
                      }}
                    />
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
        <button className="btn primary" onClick={handleSave} disabled={pending}>
          {pending ? "保存中..." : saved ? "保存しました" : "手数料設定を保存"}
        </button>
      </div>
    </div>
  );
}
