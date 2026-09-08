import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { TopbarUser } from "@/components/TopbarUser";
import { fetchAdminMembers, fetchOrgSettings } from "@/lib/queries";
import { NotificationSettingsForm, OrgInfoForm } from "./SettingsForms";
import { InviteMemberButton } from "./InviteMemberModal";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [adminMembers, orgSettings] = await Promise.all([fetchAdminMembers(), fetchOrgSettings()]);
  return (
    <div className="app">
      <Sidebar active="settings" />
      <div className="main">
        <Topbar title="設定" subtitle="団体情報・通知・メンバー管理">
          <TopbarUser />
        </Topbar>

        <div className="content page-stack">
          <OrgInfoForm settings={orgSettings} />
          <NotificationSettingsForm settings={orgSettings} />

          <div className="card flush">
            <div className="card-head">
              <h2>メンバー管理</h2>
              <InviteMemberButton />
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
