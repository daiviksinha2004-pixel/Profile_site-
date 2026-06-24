"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/Lightbox";
import { ZoomIn, Palette } from "lucide-react";
import type { Shot } from "@/data/projects";

// UI/UX design iterations — PORTAL.AI insurance analytics dashboard
const SHOTS: Shot[] = [
  {
    src: "/projects/ml-portal/ux-05.png",
    title: "Life Insurance Analytics — Full View",
    caption: "PORTAL.AI full analytics screen — sidebar navigation, KPI cards (124,592 policies, $84.2M premium, 1,204 claims, 64.2% claim ratio), and the beginning of the premium-collection trend area chart.",
    group: "Dashboard",
  },
  {
    src: "/projects/ml-portal/ux-02.png",
    title: "Collections Funnel & Agent Leaderboard",
    caption: "Dark dashboard with KPI cards (Policies Queue 3,256, High Risk ₹5,36,000), a policy-status donut, the insurance-collections ageing-funnel & risk bar chart, and a ranked agent leaderboard.",
    group: "Dashboard",
  },
  {
    src: "/projects/ml-portal/ux-06.png",
    title: "Premium Forecast Dashboard",
    caption: "Policy KPIs (3,256 policies, ₹17,76,92,816 annual premium) with a policy-status donut and a 6-month actual-vs-forecast premium trend line chart.",
    group: "Dashboard",
  },
  {
    src: "/projects/ml-portal/ux-07.png",
    title: "AI Propensity & Collection Trends",
    caption: "Teal-accented dashboard — total portfolio value ₹53.5Cr, 345,163 active customers, an AI risk-alert card, collection & payment trends with hover tooltip, and an AI propensity-bands donut.",
    group: "Dashboard",
  },
  {
    src: "/projects/ml-portal/ux-03.png",
    title: "Insurance Analytics Overview",
    caption: "Compact PORTAL.AI analytics view — insurance-line tabs, four trend-tagged KPI cards, premium-collection trend, and policy-distribution chart.",
    group: "Analytics",
  },
  {
    src: "/projects/ml-portal/ux-09.png",
    title: "Core KPIs — Detailed Card Grid",
    caption: "Close-up of the Core KPIs grid: payment rate 22.3% (725 of 3,256 paid), ₹15.97Cr outstanding, ₹12.8Cr collected, avg lapse ageing 7.6 days, interest ₹1.18Cr, high-propensity 19.0%, grace bucket 98.4%.",
    group: "Analytics",
  },
];

const GROUPS = ["All", "Dashboard", "Analytics"];

const PILLS = [
  { label: "React + TypeScript", color: "text-brand-accent2" },
  { label: "Tailwind CSS", color: "text-brand-violet" },
  { label: "Glassmorphism", color: "text-pink-400" },
  { label: "Light / Dark Theming", color: "text-amber-400" },
  { label: "Recharts", color: "text-emerald-400" },
  { label: "Figma-to-Code", color: "text-blue-400" },
];

export function UIUXSection() {
  const [group, setGroup] = useState("All");
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const visible = group === "All" ? SHOTS : SHOTS.filter((s) => s.group === group);

  return (
    <section id="uiux" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="eyebrow mb-3">UI / UX Design</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                PORTAL.AI — Design Showcase
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                High-fidelity UI design iterations for an enterprise insurance analytics platform —
                dark-theme glassmorphism dashboards, KPI visualisations, and polished component systems.
              </p>
            </div>
          </div>

          {/* Tech pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {PILLS.map((p) => (
              <span key={p.label} className={`chip ${p.color}`}>
                {p.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Group filter */}
        <div className="mb-7 flex gap-2">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => { setGroup(g); setLbIdx(null); }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                group === g
                  ? "bg-pink-500/20 border border-pink-500/40 text-pink-300"
                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {g}
              {g !== "All" && (
                <span className="ml-1.5 text-slate-500">
                  {SHOTS.filter((s) => s.group === g).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Hero image (first of visible) */}
        {visible[0] && (
          <motion.button
            key={visible[0].src}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setLbIdx(0)}
            className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-white/[0.08] hover:border-pink-500/30 focus:outline-none"
            aria-label={visible[0].title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visible[0].src}
              alt={visible[0].title}
              className="h-[340px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] sm:h-[420px]"
            />
            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
              <p className="text-base font-semibold text-white">{visible[0].title}</p>
              <p className="mt-1 max-w-2xl text-xs text-slate-300">{visible[0].caption}</p>
            </div>
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 opacity-0 backdrop-blur transition group-hover:opacity-100">
              <ZoomIn className="h-4 w-4 text-white" />
            </div>
            {/* Badge */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Palette className="h-3 w-3 text-pink-400" />
              {visible[0].title}
            </div>
          </motion.button>
        )}

        {/* Thumbnail grid (remaining) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {visible.slice(1).map((shot, i) => (
            <motion.button
              key={shot.src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onClick={() => setLbIdx(i + 1)}
              className="group relative aspect-video overflow-hidden rounded-xl border border-white/[0.08] hover:border-pink-500/30 focus:outline-none"
              aria-label={shot.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.title}
                className="h-full w-full object-cover transition duration-400 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <p className="text-left text-[10px] font-semibold leading-tight text-white">{shot.title}</p>
              </div>
              <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-black/40 opacity-0 backdrop-blur transition group-hover:opacity-100">
                <ZoomIn className="h-3 w-3 text-white" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Design callout strip */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { emoji: "🌗", title: "Dual-Theme System", desc: "Every screen designed in both light and dark modes with a consistent token-based colour system." },
            { emoji: "📊", title: "Data-Dense Layouts", desc: "High information density without visual clutter — KPI grids, donuts, and trend charts co-existing cleanly." },
            { emoji: "✨", title: "Glassmorphism Components", desc: "Layered blur, translucent surfaces, and gradient borders for a modern, premium enterprise feel." },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass p-5"
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span className="text-xl">{card.emoji}</span>
                <p className="text-sm font-semibold text-white">{card.title}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        shots={visible}
        index={lbIdx}
        onClose={() => setLbIdx(null)}
        onPrev={() => setLbIdx((i) => (i === null ? null : (i - 1 + visible.length) % visible.length))}
        onNext={() => setLbIdx((i) => (i === null ? null : (i + 1) % visible.length))}
      />
    </section>
  );
}
