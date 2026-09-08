import { supabaseServer } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export async function TopbarUser() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "";

  return (
    <div className="topbar-user" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div className="topbar-avatar">{email.slice(0, 1).toUpperCase() || "運"}</div>
      <div>
        <b style={{ display: "block", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email || "運営 管理者"}
        </b>
        <span>Owner</span>
      </div>
      <form action={signOut}>
        <button type="submit" className="btn ghost" style={{ padding: "6px 10px", fontSize: 12 }}>
          ログアウト
        </button>
      </form>
    </div>
  );
}
