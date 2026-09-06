import { PROFILE_NAME } from "@/components/helpers/config";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";
import { Article } from "@/types/article";
import { Community } from "@/types/community";
import { Education } from "@/types/education";
import { App } from "@/types/app";
import { WorkExperience } from "@/types/work";

import { getAllEducationSlugs } from "./education";
import { getAllWorkSlugs } from "./work";

/**
 * Generate the default schema
 * @returns The default schema
 */
export async function generateDefaultSchema() {
  const [workExperience, education] = await Promise.all([
    getAllWorkSlugs(),
    getAllEducationSlugs(),
  ]);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE_NAME,
    description: configData.seo.description,
    url: BASE_URL,
    image: configData.seo.image,
    sameAs: [
      profile.socialLinks?.linkedin,
      profile.socialLinks?.x,
      profile.socialLinks?.instagram,
      profile.socialLinks?.youtube,
      profile.socialLinks?.github,
      profile.socialLinks?.stackoverflow,
    ].filter(Boolean),
    worksFor:
      workExperience.length > 0
        ? {
            "@type": "Organization",
            name: workExperience[0]?.company,
          }
        : undefined,
    alumniOf: education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.school,
    })),
  };
}

/**
 * Generate the article schema
 * @param article - The article to generate the schema for
 * @returns The article schema
 */
export function generateArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: new URL(article.image, BASE_URL).href,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: PROFILE_NAME,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: PROFILE_NAME,
      logo: {
        "@type": "ImageObject",
        url: configData.seo.image,
      },
    },
    url: new URL(URLS.ARTICLES(article.slug), BASE_URL).href,
    wordCount: article.content?.split(" ").length || 0,
    timeRequired: `PT${Math.max(1, Math.ceil((article.content?.split(" ").length || 0) / 200))}M`,
    keywords: article.tags.join(", "),
  };
}

/**
 * Generate the community schema
 * @param community - The community to generate the schema for
 * @returns The community schema
 */
export function generateCommunitySchema(
  community: Community & {
    content: string;
  },
) {
  const year = new Date(community.date).getFullYear().toString();

  const eventData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: community.title,
    description: community.description,
    image: community.image,
    startDate: new Date(community.date).toISOString(),
    performer: {
      "@type": "Person",
      name: PROFILE_NAME,
      url: BASE_URL,
    },
    organizer: {
      "@type": "Person",
      name: PROFILE_NAME,
      url: BASE_URL,
    },
    url: URLS.COMMUNITY(year, community.slug),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    about: community.description,
    recordedIn: community.youtubeUrl
      ? {
          "@type": "VideoObject",
          url: community.youtubeUrl,
          name: community.title,
          description: community.description,
        }
      : undefined,
  };

  if (community.type) {
    eventData["additionalType"] = URLS.COMMUNITY_TYPE(community.type);
  }

  return eventData;
}

/**
 * Generate the project schema
 * @param project - The project to generate the schema for
 * @returns The project schema
 */
export function generateAppSchema(app: App) {
  const programmingLanguages = (app.stack || []).filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.title,
    description: app.description,
    url: app.url || URLS.APPS(app.slug),
    image: app.image,
    author: {
      "@type": "Person",
      name: PROFILE_NAME,
    },
    programmingLanguage: programmingLanguages.join(", "),
    dateCreated: app.date ? new Date(app.date).toISOString() : undefined,
    codeRepository: app.githubUrl,
    contributor: app.coAuthors?.map((name) => ({
      "@type": "Person",
      name,
    })),
  };
}

/**
 * Generate the work schema
 * @param work - The work to generate the schema for
 * @returns The work schema
 */
export function generateWorkSchema(work: WorkExperience) {
  return {
    "@context": "https://schema.org",
    "@type": "WorkExperience",
    name: work.role,
    description: `${work.role} at ${work.company}`,
    worksFor: {
      "@type": "Organization",
      name: work.company || "",
      logo: work.image,
    },
    startDate: work.startDate
      ? new Date(work.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: work.endDate
      ? new Date(work.endDate).toISOString().split("T")[0]
      : undefined,
    employee: {
      "@type": "Person",
      name: PROFILE_NAME,
    },
    skills: work.skills?.join(", ") || "",
  };
}

/**
 * Generate the education schema
 * @param education - The education to generate the schema for
 * @returns The education schema
 */
export function generateEducationSchema(education: Education) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: education.degree,
    description: `${education.degree} from ${education.school}`,
    educationalCredentialAwarded: education.degree,
    recognizedBy: {
      "@type": "EducationalOrganization",
      name: education.school,
      logo: education.image,
    },
    validFrom: education.startDate
      ? new Date(education.startDate).toISOString().split("T")[0]
      : undefined,
    validUntil: education.endDate
      ? new Date(education.endDate).toISOString().split("T")[0]
      : undefined,
    credentialSubject: {
      "@type": "Person",
      name: PROFILE_NAME,
    },
  };
}
