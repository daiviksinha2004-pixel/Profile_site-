import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

// Structured data so Google can show a rich "Person" result (name, role, links).
export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const knowsAbout = Array.from(
    new Set(skills.flatMap((g) => g.items.map((i) => i.name))),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    jobTitle: profile.roles.join(" · "),
    description: profile.summary,
    sameAs: [profile.socials.github, profile.socials.linkedin].filter(Boolean),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.school,
    },
    knowsAbout,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
