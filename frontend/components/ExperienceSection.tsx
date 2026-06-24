"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/experience";
import { Section } from "@/components/Section";
import { Briefcase, MapPin, Calendar } from "lucide-react";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="Professional Experience"
      title="Where I've built things"
    >
      <div className="space-y-6">
        {experience.map((e, i) => (
          <motion.div
            key={e.company}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass glow-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-violet/15 border border-brand-violet/25">
                  <Briefcase className="h-5 w-5 text-brand-violet" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-white">{e.role}</h3>
                    {e.current && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-brand-accent2">{e.company}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{e.summary}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {e.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {e.location}
                </span>
              </div>
            </div>

            {/* Bullets */}
            <div className="p-6">
              <ul className="space-y-3">
                {e.bullets.map((b, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                    className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet/70" />
                    {b}
                  </motion.li>
                ))}
              </ul>
              {/* Stack chips */}
              {e.stack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {e.stack.map((t) => (
                    <span key={t} className="chip-accent text-[11px]">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
