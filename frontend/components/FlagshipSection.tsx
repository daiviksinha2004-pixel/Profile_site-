"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Database, Cpu, Layers, ChevronRight,
  Server, Lock, GitBranch, Zap, BarChart2,
} from "lucide-react";
import { flagship } from "@/data/projects";
import Link from "next/link";
import { ImageGallery } from "@/components/ImageGallery";
import { BFSIDataFlow } from "@/components/BFSIDataFlow";
import { Section } from "@/components/Section";

const TABS = ["Overview", "Architecture", "Gallery", "Challenges"] as const;
type Tab = (typeof TABS)[number];

const ARCH_ICONS: Record<string, React.ElementType> = {
  frontend: Layers,
  backend: Server,
  database: Database,
  infrastructure: GitBranch,
  ai: Cpu,
};

const ARCH_COLORS: Record<string, string> = {
  frontend: "from-pink-500 to-rose-500",
  backend: "from-brand-violet to-indigo-500",
  database: "from-blue-500 to-cyan-500",
  infrastructure: "from-amber-500 to-orange-500",
  ai: "from-brand-accent2 to-teal-500",
};

export function FlagshipSection() {
  const p = flagship;
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <Section
      id="flagship"
      eyebrow={p.kicker}
      title={p.name}
      subtitle={p.tagline}
    >
      {/* Metrics strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {p.metrics.map((m) => (
          <div key={m.label} className="glass p-4 text-center">
            <p className="font-display text-xl font-bold text-white">{m.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-300">{m.label}</p>
            {m.sub && <p className="text-[10px] text-slate-500">{m.sub}</p>}
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === t
                ? "bg-brand-violet/20 border border-brand-violet/30 text-violet-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="-mt-2 mb-6 flex justify-end">
        <Link
          href="/projects/ats-crp"
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-accent2/30 bg-brand-accent2/10 px-3 py-1.5 text-xs font-semibold text-brand-accent2 transition hover:border-brand-accent2/50 hover:bg-brand-accent2/15"
        >
          Read the full case study <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Overview */}
      {tab === "Overview" && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — text */}
          <div className="col-span-3 space-y-6">
            {/* Summary */}
            <div className="glass p-6">
              <p className="eyebrow mb-3">Executive Summary</p>
              <p className="text-sm leading-relaxed text-slate-300">{p.summary}</p>
            </div>
            {/* Problem */}
            <div className="glass p-6">
              <p className="eyebrow mb-3">Problem Solved</p>
              <p className="text-sm leading-relaxed text-slate-300">{p.problem}</p>
            </div>
            {/* Impact */}
            <div className="glass p-6">
              <p className="eyebrow mb-3">Business Impact</p>
              <ul className="space-y-2">
                {p.impact.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent2" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right — highlights + tags */}
          <div className="col-span-2 space-y-4">
            {/* Tech tags */}
            <div className="glass p-5">
              <p className="eyebrow mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="chip-accent">{t}</span>
                ))}
              </div>
            </div>
            {/* Highlights */}
            <div className="glass p-5">
              <p className="eyebrow mb-3">Engineering Highlights</p>
              <ul className="space-y-3">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-300">
                    <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {/* Security layer badge */}
            <div className="glass p-5">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">7-Layer Security Model</p>
                  <p className="text-xs text-slate-400">JWT · AES-256-CBC · CSRF · RBAC · Audit</p>
                </div>
              </div>
            </div>
            {/* Infra badge */}
            <div className="glass p-5">
              <div className="flex items-center gap-2.5">
                <Database className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Zero-External-Dependency Design</p>
                  <p className="text-xs text-slate-400">PostgreSQL handles queue, storage & rate limiting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture */}
      {tab === "Architecture" && (
        <div className="space-y-6">
          <BFSIDataFlow />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(p.architecture) as [string, string[]][]).map(([layer, items]) => {
              const Icon = ARCH_ICONS[layer] ?? Layers;
              const grad = ARCH_COLORS[layer] ?? "from-brand-violet to-brand-accent2";
              return (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="glass p-5"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${grad}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <h3 className="text-sm font-semibold capitalize text-white">{layer}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Architecture narrative */}
          <div className="glass p-6">
            <p className="eyebrow mb-4">Architectural Decisions</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Strict Layered Architecture",
                  desc: "controller → service → repository → DB. Controllers handle HTTP only; services hold business logic; repositories do SQL only. Enforces testability and separation.",
                  icon: "🧱",
                },
                {
                  title: "PostgreSQL as the Only External System",
                  desc: "No Redis, Celery, or S3. Job queue, file storage, and rate limiting all run in PostgreSQL — one system to operate, back up, and make HA.",
                  icon: "🐘",
                },
                {
                  title: "Middleware Order is a Security Contract",
                  desc: "Security headers → CORS → request context → throttle → CSRF → auth → rate limit → payload encryption. Auth enforced in middleware, never per-route.",
                  icon: "🔐",
                },
                {
                  title: "Multi-Domain, Multi-Vendor Design",
                  desc: "3 business domains (life, health, debt) × 3 vendors (Kotak, BSLI, Baxa). Deliberately not abstracted — genuine domain differences require different logic.",
                  icon: "🏢",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {tab === "Gallery" && (
        <div>
          <p className="mb-6 text-sm text-slate-400">
            {p.gallery.length} screenshots across {Array.from(new Set(p.gallery.map((s) => s.group))).length} modules — click any to expand.
          </p>
          <ImageGallery shots={p.gallery} />
        </div>
      )}

      {/* Challenges */}
      {tab === "Challenges" && (
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {p.challenges.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass p-6"
              >
                <div className="mb-1 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-brand-violet" />
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-rose-400">Problem</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.problem}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-emerald-400">Solution</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Learnings + Future */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="glass p-5">
              <p className="eyebrow mb-3">Key Learnings</p>
              <ul className="space-y-2">
                {p.learnings.map((l, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-300">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent2" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-5">
              <p className="eyebrow mb-3">Roadmap</p>
              <ul className="space-y-2">
                {p.future.map((f, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-300">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-violet" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
