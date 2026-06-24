"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Zap, Shield, Database, Server, Layers, GitBranch, Cpu,
  Lock, BarChart2, MessageSquare,
} from "lucide-react";
import { flagship } from "@/data/projects";
import { ImageGallery } from "@/components/ImageGallery";
import { BFSIDataFlow } from "@/components/BFSIDataFlow";

const ARCH_ICONS: Record<string, React.ElementType> = {
  frontend: Layers, backend: Server, database: Database, infrastructure: GitBranch, ai: Cpu,
};
const ARCH_COLORS: Record<string, string> = {
  frontend: "from-pink-500 to-rose-500",
  backend: "from-brand-violet to-indigo-500",
  database: "from-blue-500 to-cyan-500",
  infrastructure: "from-amber-500 to-orange-500",
  ai: "from-brand-accent2 to-teal-500",
};

const DECISIONS = [
  { icon: "🧱", title: "Strict Layered Architecture", desc: "controller → service → repository → DB. Controllers handle HTTP only; services hold business logic; repositories do SQL only — testable, with one obvious place to change DB access." },
  { icon: "🐘", title: "PostgreSQL as the Only External System", desc: "No Redis, Celery, or S3. Job queue (FOR UPDATE SKIP LOCKED), file storage (BYTEA), caching and rate limiting all live in PostgreSQL — one system to operate, back up and make HA." },
  { icon: "🔐", title: "Middleware Order is a Security Contract", desc: "security headers → CORS → request context → analytics throttle → CSRF → auth → rate limit → payload encryption. Auth & CSRF enforced in middleware, never per-route." },
  { icon: "🏢", title: "Multi-Domain, Multi-Vendor by Config", desc: "3 domains (life, health, debt) × 3 vendors (Kotak, BSLI, Baxa). Deliberately not over-abstracted — genuine domain differences get their own validation rules and engines." },
];

function Block({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12"
    >
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {children}
    </motion.section>
  );
}

export function AtsCrpCaseStudy() {
  const p = flagship;

  return (
    <main className="relative">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/#flagship" className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
          <span className="hidden text-xs text-slate-500 sm:block">Case Study · {p.year}</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* hero */}
        <span className="chip-accent mb-4">{p.kicker}</span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{p.name}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">{p.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{p.role}</span><span>·</span><span>{p.status}</span><span>·</span><span>{p.year}</span>
        </div>

        {/* metrics */}
        <div className="mt-8 mb-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {p.metrics.map((m) => (
            <div key={m.label} className="glass p-4 text-center">
              <p className="font-display text-xl font-bold text-white">{m.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-300">{m.label}</p>
              {m.sub && <p className="text-[10px] text-slate-500">{m.sub}</p>}
            </div>
          ))}
        </div>

        {/* summary + problem */}
        <Block eyebrow="Overview" title="Executive Summary">
          <p className="max-w-3xl text-base leading-relaxed text-slate-300">{p.summary}</p>
        </Block>
        <Block eyebrow="Context" title="The Problem">
          <p className="max-w-3xl text-base leading-relaxed text-slate-300">{p.problem}</p>
        </Block>

        {/* impact */}
        <Block eyebrow="Outcome" title="Business Impact">
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.impact.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-slate-300">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent2" /> {item}
              </li>
            ))}
          </ul>
        </Block>

        {/* data flow */}
        <Block eyebrow="System Design" title="How Data Flows">
          <BFSIDataFlow />
        </Block>

        {/* architecture */}
        <Block eyebrow="Technical Architecture" title="The Stack, Layer by Layer">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(p.architecture) as [string, string[]][]).map(([layer, items]) => {
              const Icon = ARCH_ICONS[layer] ?? Layers;
              const grad = ARCH_COLORS[layer] ?? "from-brand-violet to-brand-accent2";
              return (
                <div key={layer} className="glass p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${grad}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <h3 className="text-sm font-semibold capitalize text-white">{layer}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {DECISIONS.map((d) => (
              <div key={d.title} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">{d.icon}</span>
                  <p className="text-sm font-semibold text-white">{d.title}</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">{d.desc}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* engineering highlights */}
        <Block eyebrow="What stands out" title="Engineering Highlights">
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-slate-300">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {h}
              </li>
            ))}
          </ul>
        </Block>

        {/* challenges */}
        <Block eyebrow="The hard parts" title="Engineering Challenges">
          <div className="grid gap-4 lg:grid-cols-2">
            {p.challenges.map((c, i) => (
              <div key={i} className="glass p-5">
                <div className="mb-2 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-brand-violet" />
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                </div>
                <p className="text-xs text-slate-400"><span className="text-rose-400/80">Problem: </span>{c.problem}</p>
                <p className="mt-1.5 text-xs text-slate-400"><span className="text-emerald-400/80">Solution: </span>{c.solution}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* learnings + roadmap */}
        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          <div className="glass p-6">
            <p className="eyebrow mb-3">Key Learnings</p>
            <ul className="space-y-2">
              {p.learnings.map((l, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent2" /> {l}</li>
              ))}
            </ul>
          </div>
          <div className="glass p-6">
            <p className="eyebrow mb-3">Roadmap</p>
            <ul className="space-y-2">
              {p.future.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300"><ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-violet" /> {f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* gallery */}
        <Block eyebrow="The Product" title="Product Walkthrough">
          <p className="mb-6 text-sm text-slate-400">
            {p.gallery.length} screenshots across {Array.from(new Set(p.gallery.map((s) => s.group))).length} modules — click any to expand.
          </p>
          <ImageGallery shots={p.gallery} />
        </Block>

        {/* tech */}
        <Block eyebrow="Built with" title="Tech Stack">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </Block>

        {/* footer CTA */}
        <div className="glass glow-border mt-4 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Want the deeper story?</h3>
            <p className="mt-1 text-sm text-slate-400">Ask my AI twin about any subsystem, decision, or trade-off.</p>
          </div>
          <Link href="/#contact" className="btn-primary">
            <MessageSquare className="h-4 w-4" /> Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
