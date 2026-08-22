import { courses } from "./data";

export function buildNewLink({
  influencerId,
  courseKey,
  tag,
}: {
  influencerId: string;
  courseKey: string;
  tag: string;
}) {
  const course = courses.find((c) => c.key === courseKey);
  if (!course) return null;

  const domain = courseKey === "ielts" ? "ielts-lp.online" : "tesol-lp.online";
  const namePart = influencerId.split("-")[0];
  const tagPart = tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  const id = tagPart ? `${namePart}-${tagPart}-${suffix}` : `${namePart}-${courseKey}-${suffix}`;

  return {
    id,
    shortUrl: `${domain}/r/${id}`,
    landingPage: `${course.name} LP`,
    createdAt: new Date().toISOString().slice(0, 10),
    clicks: 0,
    conversions: 0,
  };
}
