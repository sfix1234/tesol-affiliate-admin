import { LinksPageClient } from "./LinksPageClient";
import { TopbarUser } from "@/components/TopbarUser";
import { fetchCourses, fetchInfluencers, fetchLeads, fetchRecentConversions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const [influencers, recentConversions, courses, leads] = await Promise.all([
    fetchInfluencers(),
    fetchRecentConversions(),
    fetchCourses(),
    fetchLeads(),
  ]);

  return (
    <LinksPageClient
      influencers={influencers}
      recentConversions={recentConversions}
      courses={courses}
      leads={leads}
      topbarUser={<TopbarUser />}
    />
  );
}
