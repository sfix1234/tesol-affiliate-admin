import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { TopbarUser } from "@/components/TopbarUser";
import { fetchCourses } from "@/lib/queries";
import { CommissionRatesForm, LpTrackingForm } from "@/app/settings/SettingsForms";
import { SITE_DOMAIN } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await fetchCourses();
  const formKey = courses.map((c) => c.key).join(",");

  return (
    <div className="app">
      <Sidebar active="courses" />
      <div className="main">
        <Topbar title="コース・遷移先LP" subtitle="コースの登録・デフォルト手数料率・LP計測設定">
          <TopbarUser />
        </Topbar>

        <div className="content page-stack">
          <CommissionRatesForm key={formKey} courses={courses} />
          <LpTrackingForm key={formKey} courses={courses} siteOrigin={`https://${SITE_DOMAIN}`} />
        </div>
      </div>
    </div>
  );
}
