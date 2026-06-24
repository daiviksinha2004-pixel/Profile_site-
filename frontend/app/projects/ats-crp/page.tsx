import type { Metadata } from "next";
import { AtsCrpCaseStudy } from "@/components/AtsCrpCaseStudy";
import { flagship } from "@/data/projects";

export const metadata: Metadata = {
  title: `${flagship.name} — Case Study`,
  description: flagship.tagline,
  openGraph: {
    title: `${flagship.name} — Case Study`,
    description: flagship.tagline,
    type: "article",
  },
};

export default function Page() {
  return <AtsCrpCaseStudy />;
}
