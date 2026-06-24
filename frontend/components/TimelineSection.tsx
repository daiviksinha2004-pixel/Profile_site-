"use client";

import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { Briefcase, GraduationCap, Cpu, Star } from "lucide-react";
import { Section } from "@/components/Section";

const KIND_ICON: Record<string, React.ElementType> = {
  education: GraduationCap,
  work: Briefcase,
  project: Cpu,
  milestone: Star,
};

const KIND_COLOR: Record<string, string> = {
  education: "bg-brand-accent2/15 border-brand-accent2/40 text-brand-accent2",
  work: "bg-brand-violet/15 border-brand-violet/40 text-violet-300",
  project: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  milestone: "bg-amber-500/15 border-amber-500/40 text-amber-400",
};

export function TimelineSection() {
  return (
    <Section
      id="journey"
      eyebrow="Engineering Journey"
      title="From foundations to production ownership"
    >
      <div className="relative ml-2">
        {/* Vertical spine */}
        <div className="absolute left-[19px] top-0 h-full w-px bg-gradient-to-b from-brand-violet/60 via-brand-accent2/40 to-transparent" />

        <div className="space-y-8">
          {timeline.map((item, i) => {
            const Icon = KIND_ICON[item.kind] ?? Briefcase;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5"
              >
                {/* Dot */}
                <div className={`relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${KIND_COLOR[item.kind]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {/* Content */}
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <span className="text-xs text-slate-500">{item.period}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-brand-accent2">{item.org}</p>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  {item.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="chip text-[11px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
