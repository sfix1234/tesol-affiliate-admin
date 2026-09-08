import { LinksPageClient } from "./LinksPageClient";
import { fetchCourses, fetchInfluencers, fetchRecentConversions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const [influencers, recentConversions, courses] = await Promise.all([
    fetchInfluencers(),
    fetchRecentConversions(),
    fetchCourses(),
  ]);

  return (
    <LinksPageClient influencers={influencers} recentConversions={recentConversions} courses={courses} />
  );
}
