import { Sidebar } from "@/components/Sidebar";
import { Topbar, TopbarUser } from "@/components/Topbar";
import { Toggle } from "@/components/Toggle";
import { PlusIcon } from "@/components/icons";
import { adminMembers, courses } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div className="app">
      <Sidebar active="settings" />
      <div className="main">
        <Topbar title="設定" subtitle="団体情報・手数料の初期値・通知・メンバー管理">
          <TopbarUser />
        </Topbar>

        <div className="content page-stack">
          <div className="card">
            <div className="card-head">
              <h2>協会情報</h2>
            </div>
            <div className="field-row">
              <div className="field">
                <span>団体名</span>
                <input defaultValue="オンラインTESOL協会" />
              </div>
              <div className="field">
                <span>運営者メール</span>
                <input defaultValue="admin@online-tesol.jp" />
              </div>
              <div className="field">
                <span>公式サイトURL</span>
                <input defaultValue="https://online-tesol.jp" />
              </div>
              <div className="field">
                <span>サポート連絡先</span>
                <input defaultValue="support@online-tesol.jp" />
              </div>
            </div>
            <div className="savebar">
              <button className="btn primary">保存する</button>
            </div>
          </div>

          <div className="card">
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
                        <input defaultValue={c.key === "ielts" ? 12 : 10} />
                        <span>%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="savebar">
              <button className="btn primary">保存する</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2>支払い設定</h2>
            </div>
            <div className="field-row">
              <div className="field">
                <span>支払いサイクル</span>
                <select defaultValue="monthly-5">
                  <option value="monthly-5">毎月5日</option>
                  <option value="monthly-20">毎月20日</option>
                  <option value="biweekly">隔週</option>
                </select>
              </div>
              <div className="field">
                <span>最低支払金額</span>
                <input defaultValue="¥5,000" />
              </div>
              <div className="field">
                <span>デフォルト支払方法</span>
                <select defaultValue="bank">
                  <option value="bank">銀行振込</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div className="field">
                <span>確定までの保留期間</span>
                <input defaultValue="14日間(返金対応期間)" />
              </div>
            </div>
            <div className="field-hint">
              確定までの保留期間中に発生したキャンセル・返金は自動的に報酬から差し引かれます。
            </div>
            <div className="savebar">
              <button className="btn primary">保存する</button>
            </div>
          </div>

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
                <Toggle defaultOn />
              </div>
              <div className="toggle-row">
                <div className="toggle-row-text">
                  <b>保留コンバージョンの経過アラート</b>
                  <span>保留ステータスが3日以上続いている場合に通知します</span>
                </div>
                <Toggle defaultOn />
              </div>
              <div className="toggle-row">
                <div className="toggle-row-text">
                  <b>新規インフルエンサー登録申請の通知</b>
                  <span>審査待ちのインフルエンサーが登録されたら通知します</span>
                </div>
                <Toggle defaultOn />
              </div>
              <div className="toggle-row">
                <div className="toggle-row-text">
                  <b>月次レポートの自動送信</b>
                  <span>毎月1日に前月の実績サマリーをメールで送付します</span>
                </div>
                <Toggle />
              </div>
            </div>
          </div>

          <div className="card flush">
            <div className="card-head">
              <h2>メンバー管理</h2>
              <button className="btn primary">
                <PlusIcon />
                メンバーを招待
              </button>
            </div>
            <div className="card-pad">
              <table>
                <thead>
                  <tr>
                    <th>名前</th>
                    <th>メールアドレス</th>
                    <th>権限</th>
                    <th>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {adminMembers.map((m) => (
                    <tr key={m.email}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>
                        <span className="member-role">{m.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${m.status === "有効" ? "ok" : "pending"}`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
