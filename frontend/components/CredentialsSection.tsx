"use client";

import { motion } from "framer-motion";
import { credentials } from "@/data/certifications";
import { Section } from "@/components/Section";
import {
  GraduationCap, Server, Brain, Database,
  LineChart, ShieldCheck, ExternalLink,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "graduation-cap": GraduationCap,
  "server": Server,
  "brain": Brain,
  "database": Database,
  "line-chart": LineChart,
  "shield-check": ShieldCheck,
};

const TYPE_STYLES: Record<string, string> = {
  degree: "from-amber-500 to-orange-500",
  competency: "from-brand-violet to-indigo-500",
  certificate: "from-brand-accent2 to-teal-500",
};

export function CredentialsSection() {
  return (
    <Section
      id="credentials"
      eyebrow="Credentials & Competencies"
      title="Education & Proven Skills"
      subtitle="Degree backed by real systems — every competency evidenced by production work."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {credentials.map((c, i) => {
          const Icon = ICON_MAP[c.icon] ?? GraduationCap;
          const grad = TYPE_STYLES[c.type] ?? TYPE_STYLES.competency;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass glow-border p-5"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white leading-tight">{c.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{c.issuer} · {c.year}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.blurb}</p>
              {c.evidence && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-accent2">
                  <span className="h-1 w-1 rounded-full bg-brand-accent2" />
                  <span>Evidence: {c.evidence}</span>
                </div>
              )}
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" /> Verify
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
