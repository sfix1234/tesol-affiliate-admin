"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/Toggle";
import {
  updateCourseLpUrls,
  updateCourseRates,
  updateNotificationSettings,
  updateOrgSettings,
  updatePayoutSettings,
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

  function pixelTag(key: string) {
    return `<img src="${siteOrigin}/api/leads?ref={リンクID}" width="1" height="1" style="display:none">`;
  }

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

      <div className="field-hint" style={{ marginTop: 16 }}>
        紹介リンク(<code>{siteOrigin}/r/&#123;リンクID&#125;</code>)は上記のLP URLへ<code>?ref=&#123;リンクID&#125;</code>付きでリダイレクトされ、クリックを自動記録します。
        LP側の申込み完了ページに以下のタグを設置すると、面談登録(リード)が自動作成されます(<code>&#123;リンクID&#125;</code>はページURLの<code>ref</code>パラメータの値に置き換えてください)。
      </div>
      <div className="rateinput" style={{ marginTop: 8, alignItems: "flex-start", flexDirection: "column", gap: 6 }}>
        <code style={{ fontSize: 12, wordBreak: "break-all" }}>{pixelTag("tag")}</code>
        <button
          type="button"
          className="btn ghost"
          style={{ padding: "4px 10px", fontSize: 12 }}
          onClick={() => copy("tag", pixelTag("tag"))}
        >
          {copiedKey === "tag" ? "コピーしました" : "タグをコピー"}
        </button>
      </div>
    </form>
  );
}

export function PayoutSettingsForm({ settings }: { settings: OrgSettings }) {
  const router = useRouter();
  const [payoutCycle, setPayoutCycle] = useState(settings.payoutCycle);
  const [minPayoutAmount, setMinPayoutAmount] = useState(settings.minPayoutAmount);
  const [defaultPayoutMethod, setDefaultPayoutMethod] = useState(settings.defaultPayoutMethod);
  const [holdPeriodDays, setHoldPeriodDays] = useState(settings.holdPeriodDays);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    try {
      await updatePayoutSettings({ payoutCycle, minPayoutAmount, defaultPayoutMethod, holdPeriodDays });
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-head">
        <h2>支払い設定</h2>
      </div>
      <div className="field-row">
        <div className="field">
          <span>支払いサイクル</span>
          <select value={payoutCycle} onChange={(e) => { setPayoutCycle(e.target.value); setSaved(false); }}>
            <option value="monthly-5">毎月5日</option>
            <option value="monthly-20">毎月20日</option>
            <option value="biweekly">隔週</option>
          </select>
        </div>
        <div className="field">
          <span>最低支払金額</span>
          <input
            type="number"
            min={0}
            value={minPayoutAmount}
            onChange={(e) => { setMinPayoutAmount(Number(e.target.value)); setSaved(false); }}
          />
        </div>
        <div className="field">
          <span>デフォルト支払方法</span>
          <select value={defaultPayoutMethod} onChange={(e) => { setDefaultPayoutMethod(e.target.value); setSaved(false); }}>
            <option value="bank">銀行振込</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="field">
          <span>確定までの保留期間(日数)</span>
          <input
            type="number"
            min={0}
            value={holdPeriodDays}
            onChange={(e) => { setHoldPeriodDays(Number(e.target.value)); setSaved(false); }}
          />
        </div>
      </div>
      <div className="field-hint">
        確定までの保留期間中に発生したキャンセル・返金は自動的に報酬から差し引かれます。
      </div>
      <div className="savebar">
        <SaveButton pending={pending} saved={saved} />
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
