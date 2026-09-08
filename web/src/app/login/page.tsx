"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const supabase = supabaseBrowser();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpError && otpError.message.toLowerCase().includes("rate limit")) {
        setError("送信回数の上限に達しました。しばらくしてからもう一度お試しください。");
      } else {
        // Always show the same success state, whether or not the email is registered,
        // so this form can't be used to check who has an account.
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #f7f7f8)",
      }}
    >
      <div
        style={{
          width: 360,
          maxWidth: "90vw",
          background: "var(--surface, #fff)",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>オンラインTESOL協会</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
          アフィリエイト管理ツール
        </p>

        {done ? (
          <div>
            <p style={{ fontSize: 13.5 }}>
              このメールアドレスが登録されている場合、ログイン用のリンクを送信しました。メールをご確認ください。
            </p>
            <button
              type="button"
              className="btn ghost"
              style={{ marginTop: 8 }}
              onClick={() => {
                setDone(false);
                setEmail("");
              }}
            >
              別のメールアドレスで送信し直す
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <label>
              メールアドレス
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 12.5, margin: 0 }}>{error}</p>}
            <button type="submit" className="btn primary" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "送信中..." : "ログインリンクを送信"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
