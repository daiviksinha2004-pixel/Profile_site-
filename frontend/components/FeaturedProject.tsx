"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { ImageGallery } from "@/components/ImageGallery";
import { AIPipelineDiagram } from "@/components/AIPipelineDiagram";

const ACCENT_STYLES: Record<string, { border: string; text: string; bg: string; kicker: string }> = {
  cyan: {
    border: "border-brand-accent2/30",
    text: "text-brand-accent2",
    bg: "bg-brand-accent2/10",
    kicker: "border-brand-accent2/25 bg-brand-accent2/10 text-brand-accent2",
  },
  emerald: {
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    kicker: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  },
  violet: {
    border: "border-brand-violet/30",
    text: "text-violet-300",
    bg: "bg-brand-violet/10",
    kicker: "border-brand-violet/25 bg-brand-violet/10 text-violet-300",
  },
  amber: {
    border: "border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    kicker: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  },
};

export function FeaturedProject({ project: p, reversed = false }: { project: Project; reversed?: boolean }) {
  const a = ACCENT_STYLES[p.accent] ?? ACCENT_STYLES.violet;
  const hasGallery = p.gallery.length > 0;
  const [expanded, setExpanded] = useState(false);

  const visual = hasGallery ? (
    <ImageGallery shots={p.gallery} groupTabs={p.gallery.length > 6} />
  ) : (
    <AIPipelineDiagram />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass glow-border overflow-hidden"
    >
      {/* Header */}
      <div className={`border-b border-white/[0.06] p-6 sm:p-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${a.kicker}`}>
              {p.kicker}
            </span>
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{p.name}</h3>
            <p className="mt-2 max-w-xl text-sm text-slate-400">{p.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost py-2 px-3 text-xs">
                <Github className="h-3.5 w-3.5" /> Code
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-primary py-2 px-3 text-xs">
                <ExternalLink className="h-3.5 w-3.5" /> Live
              </a>
            )}
          </div>
        </div>
        {/* Metrics */}
        <div className="mt-6 flex flex-wrap gap-3">
          {p.metrics.map((m) => (
            <div key={m.label} className={`rounded-xl border ${a.border} ${a.bg} px-4 py-2 text-center`}>
              <p className={`text-base font-bold ${a.text}`}>{m.value}</p>
              <p className="text-[10px] text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual area */}
      <div className="p-6 sm:p-8">
        {visual}
      </div>

      {/* Expandable details */}
      <div className="border-t border-white/[0.06] p-6 sm:p-8">
        <button
          onClick={() => setExpanded((x) => !x)}
          className={`mb-4 flex items-center gap-1.5 text-sm font-semibold ${a.text} transition hover:opacity-80`}
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? "Hide details" : "Technical details & engineering story"}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* Summary */}
            <div className="sm:col-span-2">
              <p className="eyebrow mb-2">Executive Summary</p>
              <p className="text-sm leading-relaxed text-slate-300">{p.summary}</p>
            </div>
            {/* Impact */}
            <div>
              <p className="eyebrow mb-2">Business Impact</p>
              <ul className="space-y-1.5">
                {p.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.text}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Highlights */}
            <div>
              <p className="eyebrow mb-2">Highlights</p>
              <ul className="space-y-1.5">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${a.bg} border ${a.border}`} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {/* Challenges */}
            {p.challenges.length > 0 && (
              <div className="sm:col-span-2">
                <p className="eyebrow mb-2">Engineering Challenges</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {p.challenges.map((c, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <p className="mb-2 text-xs font-semibold text-white">{c.title}</p>
                      <p className="text-[11px] text-slate-500"><span className="text-rose-400/80">Problem: </span>{c.problem}</p>
                      <p className="mt-1 text-[11px] text-slate-500"><span className="text-emerald-400/80">Solution: </span>{c.solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Learnings */}
            <div>
              <p className="eyebrow mb-2">Key Learnings</p>
              <ul className="space-y-1.5">
                {p.learnings.map((l, i) => (
                  <li key={i} className="text-xs text-slate-400">• {l}</li>
                ))}
              </ul>
            </div>
            {/* Future */}
            <div>
              <p className="eyebrow mb-2">Future Improvements</p>
              <ul className="space-y-1.5">
                {p.future.map((f, i) => (
                  <li key={i} className="text-xs text-slate-400">• {f}</li>
                ))}
              </ul>
            </div>
            {/* Stack */}
            <div className="sm:col-span-2">
              <p className="eyebrow mb-2">Full Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
