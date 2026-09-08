"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "@/components/icons";
import { confirmLead, createLead, declineLead } from "@/lib/actions";
import { formatYen, leadStatusBadgeClass, leadStatusLabel, type Course, type Influencer, type Lead } from "@/lib/data";

export function LeadsPanel({
  leads,
  influencers,
  courses,
}: {
  leads: Lead[];
  influencers: Influencer[];
  courses: Course[];
}) {
  const router = useRouter();
  const getInfluencer = (id: string) => influencers.find((i) => i.id === id);

  const [newOpen, setNewOpen] = useState(false);
  const [newInfluencerId, setNewInfluencerId] = useState("");
  const [newLinkId, setNewLinkId] = useState("");
  const [newSubmitting, setNewSubmitting] = useState(false);

  const [confirmingLead, setConfirmingLead] = useState<Lead | null>(null);
  const [courseKey, setCourseKey] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);
  const [busyLeadId, setBusyLeadId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedInfluencer = getInfluencer(newInfluencerId);

  async function handleCreateLead(e: React.FormEvent) {
    e.preventDefault();
    if (!newInfluencerId || !newLinkId) return;
    setNewSubmitting(true);
    setError(null);
    try {
      await createLead({ influencerId: newInfluencerId, linkId: newLinkId });
      setNewOpen(false);
      setNewInfluencerId("");
      setNewLinkId("");
      router.refresh();
    } catch {
      setError("記録に失敗しました");
    } finally {
      setNewSubmitting(false);
    }
  }

  function openConfirm(lead: Lead) {
    setConfirmingLead(lead);
    setCourseKey("");
    setAmount(0);
    setError(null);
  }

  function pickCourse(key: string) {
    setCourseKey(key);
    const course = courses.find((c) => c.key === key);
    if (course) setAmount(course.price);
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmingLead || !courseKey) return;
    setConfirmSubmitting(true);
    setError(null);
    try {
      await confirmLead({ leadId: confirmingLead.id, courseKey, amount });
      setConfirmingLead(null);
      router.refresh();
    } catch {
      setError("成約登録に失敗しました");
    } finally {
      setConfirmSubmitting(false);
    }
  }

  async function handleDecline(lead: Lead, status: "no_show" | "cancelled") {
    setBusyLeadId(lead.id);
    try {
      await declineLead({ leadId: lead.id, status });
      router.refresh();
    } finally {
      setBusyLeadId(null);
    }
  }

  return (
    <div className="card flush">
      <div className="card-head">
        <h2>面談登録・成約管理</h2>
        <button className="btn primary" onClick={() => setNewOpen(true)}>
          <PlusIcon />
          面談登録を記録
        </button>
      </div>
      <div className="card-pad">
        {leads.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0 }}>
            まだ面談登録がありません。
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>発生日時</th>
                <th>リンク</th>
                <th>インフルエンサー</th>
                <th>ステータス</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const inf = getInfluencer(lead.influencerId);
                if (!inf) return null;
                return (
                  <tr key={lead.id}>
                    <td>{lead.occurredAt.replace("T", " ").slice(0, 16)}</td>
                    <td className="linkcell">
                      <b>r/{lead.linkId}</b>
                    </td>
                    <td>{inf.name}</td>
                    <td>
                      <span className={`badge ${leadStatusBadgeClass[lead.status]}`}>
                        {leadStatusLabel[lead.status]}
                      </span>
                    </td>
                    <td>
                      {lead.status === "interview_scheduled" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn primary" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => openConfirm(lead)}>
                            成約として登録
                          </button>
                          <button
                            className="btn ghost"
                            style={{ padding: "6px 10px", fontSize: 12 }}
                            disabled={busyLeadId === lead.id}
                            onClick={() => handleDecline(lead, "no_show")}
                          >
                            不参加
                          </button>
                          <button
                            className="btn ghost"
                            style={{ padding: "6px 10px", fontSize: 12 }}
                            disabled={busyLeadId === lead.id}
                            onClick={() => handleDecline(lead, "cancelled")}
                          >
                            不成立
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {newOpen && (
        <div className="modal-overlay" onClick={() => setNewOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>面談登録を記録</h3>
            <form onSubmit={handleCreateLead} className="modal-form">
              <label>
                インフルエンサー
                <select
                  value={newInfluencerId}
                  onChange={(e) => {
                    setNewInfluencerId(e.target.value);
                    setNewLinkId("");
                  }}
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
                経由リンク
                <select value={newLinkId} onChange={(e) => setNewLinkId(e.target.value)} required disabled={!selectedInfluencer}>
                  <option value="" disabled>
                    選択してください
                  </option>
                  {selectedInfluencer?.links.map((l) => (
                    <option key={l.id} value={l.id}>
                      r/{l.id}
                    </option>
                  ))}
                </select>
              </label>
              {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setNewOpen(false)}>
                  キャンセル
                </button>
                <button type="submit" className="btn primary" disabled={newSubmitting}>
                  {newSubmitting ? "記録中..." : "記録する"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmingLead && (
        <div className="modal-overlay" onClick={() => setConfirmingLead(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>成約として登録</h3>
            <form onSubmit={handleConfirm} className="modal-form">
              <label>
                コース
                <select value={courseKey} onChange={(e) => pickCourse(e.target.value)} required>
                  <option value="" disabled>
                    選択してください
                  </option>
                  {courses.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name}({formatYen(c.price)})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                金額
                <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
              </label>
              {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setConfirmingLead(null)}>
                  キャンセル
                </button>
                <button type="submit" className="btn primary" disabled={confirmSubmitting}>
                  {confirmSubmitting ? "登録中..." : "成約登録する"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
