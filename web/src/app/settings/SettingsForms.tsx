"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/Toggle";
import {
  updateCourseLpUrls,
  updateCourseRates,
  updateNotificationSettings,
  updateOrgSettings,
} from "@/lib/actions";
import type { Course, OrgSettings } from "@/lib/data";

function SaveButton({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <button className="btn primary" disabled={pending}>
      {pending ? "保存中..." : saved ? "保存しました" : "保存する"}
    </button>
  );
}

export function OrgInfoForm({ settings }: { settings: OrgSettings }) {
  const router = useRouter();
  const [orgName, setOrgName] = useState(settings.orgName);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [websiteUrl, setWebsiteUrl] = useState(settings.websiteUrl);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    try {
      await updateOrgSettings({ orgName, adminEmail, websiteUrl, supportEmail });
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-head">
        <h2>協会情報</h2>
      </div>
      <div className="field-row">
        <div className="field">
          <span>団体名</span>
          <input value={orgName} onChange={(e) => { setOrgName(e.target.value); setSaved(false); }} />
        </div>
        <div className="field">
          <span>運営者メール</span>
          <input value={adminEmail} onChange={(e) => { setAdminEmail(e.target.value); setSaved(false); }} />
        </div>
        <div className="field">
          <span>公式サイトURL</span>
          <input value={websiteUrl} onChange={(e) => { setWebsiteUrl(e.target.value); setSaved(false); }} />
        </div>
        <div className="field">
          <span>サポート連絡先</span>
          <input value={supportEmail} onChange={(e) => { setSupportEmail(e.target.value); setSaved(false); }} />
        </div>
      </div>
      <div className="savebar">
        <SaveButton pending={pending} saved={saved} />
      </div>
    </form>
  );
}

export function CommissionRatesForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [rates, setRates] = useState(Object.fromEntries(courses.map((c) => [c.key, c.defaultRate])));
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    try {
      await updateCourseRates(courses.map((c) => ({ key: c.key, defaultRate: rates[c.key] })));
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-head">
        <h2>デフォルト手数料率</h2>
        <span>新規インフルエンサー登録時の初期値</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>コース</th>
            <th>コース単価</th>
            <th>デフォルト手数料率</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.key}>
              <td>{c.name}</td>
              <td className="num">¥{c.price.toLocaleString("ja-JP")}</td>
              <td>
                <div className="rateinput">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={rates[c.key]}
                    onChange={(e) => {
                      setRates((prev) => ({ ...prev, [c.key]: Number(e.target.value) }));
                      setSaved(false);
                    }}
                  />
                  <span>%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="savebar">
        <SaveButton pending={pending} saved={saved} />
      </div>
    </form>
  );
}

export function LpTrackingForm({ courses, siteOrigin }: { courses: Course[]; siteOrigin: string }) {
  const router = useRouter();
  const [urls, setUrls] = useState(Object.fromEntries(courses.map((c) => [c.key, c.lpUrl])));
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    try {
      await updateCourseLpUrls(courses.map((c) => ({ key: c.key, lpUrl: urls[c.key] })));
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const autoTag = `<script>
(function () {
  var ref = new URLSearchParams(location.search).get("ref");
  if (!ref) return;
  var img = document.createElement("img");
  img.src = "${siteOrigin}/api/leads?ref=" + encodeURIComponent(ref);
  img.width = 1; img.height = 1; img.style.display = "none";
  document.body.appendChild(img);
})();
</script>`;

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-head">
        <h2>LP計測設定</h2>
        <span>コースごとの実際のLP URL・計測タグ</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>コース</th>
            <th>実際のLP URL(リダイレクト先)</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.key}>
              <td>{c.name}</td>
              <td>
                <input
                  style={{ width: "100%" }}
                  value={urls[c.key]}
                  placeholder="https://example.com/lp/..."
                  onChange={(e) => {
                    setUrls((prev) => ({ ...prev, [c.key]: e.target.value }));
                    setSaved(false);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="savebar">
        <SaveButton pending={pending} saved={saved} />
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border, #e5e7eb)" }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>クリック・申込みの計測を始める3ステップ</div>
        <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
          <li>
            上の表に、各コースの<b>実際のLPのURL</b>を入力して保存する
          </li>
          <li>
            リンク管理ページで発行される紹介リンクは、自動的にそのLPへ転送される。<b>この転送のタイミングでクリックが自動的に記録される</b>ので、追加の作業は不要
          </li>
          <li>
            LPの「申込み完了ページ(サンクスページ)」に、下のタグをそのまま貼り付けてもらう。<b>中身を書き換える必要はない</b> — ページを開いたときに自動でリンクを判別し、面談登録(リード)としてこのアプリに記録される
          </li>
        </ol>

        <div
          style={{
            marginTop: 12,
            background: "var(--bg-subtle, #f3f4f6)",
            borderRadius: 8,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <pre style={{ margin: 0, fontSize: 11.5, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{autoTag}</pre>
          <button
            type="button"
            className="btn primary"
            style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: 12 }}
            onClick={() => copy("tag", autoTag)}
          >
            {copiedKey === "tag" ? "コピーしました" : "このタグをコピーしてLP制作会社に渡す"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function NotificationSettingsForm({ settings }: { settings: OrgSettings }) {
  const router = useRouter();
  const [notifyNewConversion, setNotifyNewConversion] = useState(settings.notifyNewConversion);
  const [notifyPendingAlert, setNotifyPendingAlert] = useState(settings.notifyPendingAlert);
  const [notifyNewInfluencer, setNotifyNewInfluencer] = useState(settings.notifyNewInfluencer);
  const [notifyMonthlyReport, setNotifyMonthlyReport] = useState(settings.notifyMonthlyReport);

  async function persist(next: {
    notifyNewConversion: boolean;
    notifyPendingAlert: boolean;
    notifyNewInfluencer: boolean;
    notifyMonthlyReport: boolean;
  }) {
    await updateNotificationSettings(next);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="card-head">
        <h2>通知設定</h2>
      </div>
      <div>
        <div className="toggle-row">
          <div className="toggle-row-text">
            <b>新規コンバージョン発生時にメール通知</b>
            <span>リンク経由の申込みが発生するたびに運営者宛に通知します</span>
          </div>
          <Toggle
            checked={notifyNewConversion}
            onChange={(on) => {
              setNotifyNewConversion(on);
              persist({ notifyNewConversion: on, notifyPendingAlert, notifyNewInfluencer, notifyMonthlyReport });
            }}
          />
        </div>
        <div className="toggle-row">
          <div className="toggle-row-text">
            <b>保留コンバージョンの経過アラート</b>
            <span>保留ステータスが3日以上続いている場合に通知します</span>
          </div>
          <Toggle
            checked={notifyPendingAlert}
            onChange={(on) => {
              setNotifyPendingAlert(on);
              persist({ notifyNewConversion, notifyPendingAlert: on, notifyNewInfluencer, notifyMonthlyReport });
            }}
          />
        </div>
        <div className="toggle-row">
          <div className="toggle-row-text">
            <b>新規インフルエンサー登録申請の通知</b>
            <span>審査待ちのインフルエンサーが登録されたら通知します</span>
          </div>
          <Toggle
            checked={notifyNewInfluencer}
            onChange={(on) => {
              setNotifyNewInfluencer(on);
              persist({ notifyNewConversion, notifyPendingAlert, notifyNewInfluencer: on, notifyMonthlyReport });
            }}
          />
        </div>
        <div className="toggle-row">
          <div className="toggle-row-text">
            <b>月次レポートの自動送信</b>
            <span>毎月1日に前月の実績サマリーをメールで送付します</span>
          </div>
          <Toggle
            checked={notifyMonthlyReport}
            onChange={(on) => {
              setNotifyMonthlyReport(on);
              persist({ notifyNewConversion, notifyPendingAlert, notifyNewInfluencer, notifyMonthlyReport: on });
            }}
          />
        </div>
      </div>
    </div>
  );
}
