"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, ChevronRight } from "lucide-react";
import { secondaryProjects } from "@/data/projects";

export function SecondaryProjects() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {secondaryProjects.map((p, i) => (
        <motion.div
          key={p.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="glass glow-border flex flex-col p-6"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <span className="chip text-[10px]">{p.kicker}</span>
              <h3 className="mt-2 font-semibold text-white">{p.name}</h3>
            </div>
            <div className="flex shrink-0 gap-2">
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{p.summary}</p>
          <ul className="mt-4 space-y-1.5">
            {p.impact.slice(0, 2).map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent2" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 4).map((t) => (
              <span key={t} className="chip text-[11px]">{t}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
