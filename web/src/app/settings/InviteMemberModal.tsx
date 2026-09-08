"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "@/components/icons";
import { inviteAdminMember } from "@/lib/actions";

export function InviteMemberButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"オーナー" | "管理者" | "閲覧のみ">("管理者");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setName("");
    setEmail("");
    setRole("管理者");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await inviteAdminMember({ name, email, role });
      close();
      router.refresh();
    } catch {
      setError("招待に失敗しました");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>
        <PlusIcon />
        メンバーを招待
      </button>
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>メンバーを招待</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                名前
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                メールアドレス
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                権限
                <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
                  <option value="オーナー">オーナー</option>
                  <option value="管理者">管理者</option>
                  <option value="閲覧のみ">閲覧のみ</option>
                </select>
              </label>
              {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={close}>
                  キャンセル
                </button>
                <button type="submit" className="btn primary" disabled={pending}>
                  {pending ? "招待中..." : "招待する"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
