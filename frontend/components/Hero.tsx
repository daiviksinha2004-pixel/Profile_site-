"use client";

import { motion } from "framer-motion";
import { profile, headlineStats } from "@/data/profile";
import { MessageSquare, ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const ROLE_COLORS: Record<string, string> = {
  "Full-Stack Developer": "from-brand-violet to-indigo-400",
  "AI Engineer": "from-brand-accent2 to-teal-400",
  "Machine Learning Engineer": "from-emerald-400 to-teal-500",
  "Backend Engineer": "from-blue-400 to-brand-violet",
  "Data Analytics": "from-amber-400 to-orange-500",
};

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

export function Hero({ onAskAI }: { onAskAI: () => void }) {
  return (
    <div id="top" className="relative flex min-h-screen flex-col justify-center pt-16">
      {/* Hero radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 blur-[160px]" />
        <div className="absolute right-0 top-1/3 h-[50vh] w-[40vw] rounded-full bg-brand-accent2/8 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        {/* Availability badge */}
        <motion.div {...fadeUp(0)}>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to full-time SWE · AI · Data Engineering roles · 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fadeUp(0.05)}
          className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {profile.name}
        </motion.h1>

        {/* Roles pills — recruiter scan in 3 seconds */}
        <motion.div {...fadeUp(0.1)} className="mt-4 flex flex-wrap gap-2">
          {profile.roles.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[r] ?? "from-brand-violet to-brand-accent2"}`}
              />
              {r}
            </span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.15)}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300"
        >
          {profile.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={onAskAI} className="btn-primary">
            <MessageSquare className="h-4 w-4" />
            Ask my AI twin
          </button>
          <a href="#projects" className="btn-ghost">
            View projects
            <ArrowDown className="h-4 w-4" />
          </a>
          <div className="ml-1 hidden h-7 w-px bg-white/10 sm:block" />
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white sm:flex"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white sm:flex"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white sm:flex"
          >
            <Mail className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          {...fadeUp(0.28)}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-6"
        >
          {headlineStats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-ink/60 px-4 py-5 text-center"
            >
              <span className="font-display text-2xl font-bold text-white">
                {s.prefix}
                <AnimatedCounter to={s.value} delay={0.3 + i * 0.08} />
                {s.suffix}
              </span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Education / location line */}
        <motion.p {...fadeUp(0.35)} className="mt-8 text-sm text-slate-500">
          {profile.education.degree} · {profile.education.school} · {profile.education.note} ·{" "}
          <span className="text-slate-400">{profile.location}</span>
        </motion.p>
      </div>
    </div>
  );
}
