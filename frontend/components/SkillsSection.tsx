"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills, radar } from "@/data/skills";
import {
  Server, Brain, Database, Layout, Wrench, Shield,
} from "lucide-react";
import { Section } from "@/components/Section";

const ICONS: Record<string, React.ElementType> = {
  server: Server,
  brain: Brain,
  database: Database,
  layout: Layout,
  wrench: Wrench,
  shield: Shield,
};

const ACCENT: Record<string, string> = {
  server: "from-brand-violet to-indigo-400",
  brain: "from-brand-accent2 to-teal-400",
  database: "from-blue-500 to-brand-violet",
  layout: "from-pink-400 to-rose-500",
  wrench: "from-amber-400 to-orange-400",
  shield: "from-emerald-400 to-teal-500",
};

// Pure-SVG spider/radar chart — no recharts dependency.
function RadarChart() {
  const cx = 120;
  const cy = 120;
  const r = 90;
  const n = radar.length;

  function point(value: number, idx: number) {
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  }

  const rings = [25, 50, 75, 100];
  const labelPts = radar.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + (r + 18) * Math.cos(angle), y: cy + (r + 18) * Math.sin(angle) };
  });

  const polyPts = radar
    .map((d, i) => {
      const p = point(d.value, i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" aria-label="Skill radar">
      {/* Rings */}
      {rings.map((v) =>
        radar.map((_, i) => {
          const a = point(v, i);
          const b = point(v, (i + 1) % n);
          return (
            <line
              key={`ring-${v}-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1"
            />
          );
        })
      )}
      {/* Spokes */}
      {radar.map((_, i) => {
        const p = point(100, i);
        return (
          <line key={`spoke-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        );
      })}
      {/* Filled polygon */}
      <polygon
        points={polyPts}
        fill="rgba(124,108,255,0.18)"
        stroke="rgba(124,108,255,0.7)"
        strokeWidth="1.5"
      />
      {/* Data dots */}
      {radar.map((d, i) => {
        const p = point(d.value, i);
        return (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="3.5"
            fill="#7c6cff" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        );
      })}
      {/* Labels */}
      {radar.map((d, i) => (
        <text
          key={`label-${i}`}
          x={labelPts[i].x}
          y={labelPts[i].y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill="rgba(203,213,225,0.9)"
          fontFamily="system-ui, sans-serif"
        >
          {d.axis}
        </text>
      ))}
    </svg>
  );
}

function SkillBar({ name, level, accent, delay }: { name: string; level: number; accent: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${accent}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="Technical Proficiency"
      title="Skills & Capabilities"
      subtitle="Technologies I've used to ship real systems — not a checkbox list."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Radar + summary */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
          <RadarChart />
          <div className="w-full space-y-1.5">
            {radar.map((d) => (
              <div key={d.axis} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{d.axis}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-accent2"
                      style={{ width: `${d.value}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-slate-500">{d.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill bars — 2 cols */}
        <div className="col-span-2 grid gap-6 sm:grid-cols-2">
          {skills.map((group) => {
            const Icon = ICONS[group.icon] ?? Server;
            const accent = ACCENT[group.icon] ?? "from-brand-violet to-brand-accent2";
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="glass p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${accent} bg-opacity-20`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  <h3 className="text-sm font-semibold text-white">{group.category}</h3>
                </div>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <SkillBar
                      key={item.name}
                      name={item.name}
                      level={item.level}
                      accent={accent}
                      delay={i * 0.07}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
