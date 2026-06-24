"use client";

import { motion } from "framer-motion";

// Animated, source-accurate data-flow for the ATS CRP platform.
// Pure SVG (scales to any width); connectors use the dash-flow keyframe for "live data".

const NODES = [
  { x: 20, emoji: "📥", title: "Sources", sub: "CSV · Excel · SFTP" },
  { x: 197, emoji: "🧹", title: "Ingest", sub: "validate · normalize" },
  { x: 374, emoji: "🗂️", title: "Staging", sub: "jsonb_populate_record" },
  { x: 551, emoji: "🧱", title: "Fact tables", sub: "partitioned · lot_date" },
  { x: 728, emoji: "🤖", title: "7 engines", sub: "baseline + GBDT" },
  { x: 905, emoji: "📊", title: "Dashboards", sub: "200+ charts · API" },
];
const NW = 155;
const NH = 60;
const NY = 40;

export function BFSIDataFlow() {
  return (
    <div className="glass overflow-hidden p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="eyebrow">Data Flow Architecture</p>
        <span className="text-[11px] text-slate-500">ingest → predict → serve</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 1080 270" className="w-full min-w-[760px]" role="img" aria-label="ATS CRP data-flow architecture">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(124,108,255,0.85)" />
            </marker>
            <linearGradient id="pgbar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(34,211,238,0.16)" />
              <stop offset="1" stopColor="rgba(124,108,255,0.16)" />
            </linearGradient>
          </defs>

          {/* connectors between stages */}
          {NODES.slice(0, -1).map((n, i) => {
            const x1 = n.x + NW;
            const x2 = NODES[i + 1].x;
            const y = NY + NH / 2;
            return (
              <g key={`c${i}`}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(255,255,255,0.10)" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke="rgba(124,108,255,0.7)" strokeWidth="2" strokeDasharray="5 6" className="animate-dash-flow" />
              </g>
            );
          })}

          {/* stage nodes */}
          {NODES.map((n, i) => (
            <motion.g
              key={n.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <rect x={n.x} y={NY} width={NW} height={NH} rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" />
              <text x={n.x + 14} y={NY + 26} fontSize="18">{n.emoji}</text>
              <text x={n.x + 40} y={NY + 25} fill="#fff" fontSize="14" fontWeight="600" fontFamily="system-ui">{n.title}</text>
              <text x={n.x + 14} y={NY + 46} fill="#94a3b8" fontSize="10.5" fontFamily="system-ui">{n.sub}</text>
            </motion.g>
          ))}

          {/* vertical taps into the PostgreSQL bar (stages 2–5) */}
          {[1, 2, 3, 4].map((i) => {
            const cx = NODES[i].x + NW / 2;
            return (
              <line key={`t${i}`} x1={cx} y1={NY + NH} x2={cx} y2={150} stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" strokeDasharray="3 4" className="animate-dash-flow" />
            );
          })}

          {/* PostgreSQL backbone */}
          <rect x={NODES[1].x} y={150} width={NODES[4].x + NW - NODES[1].x} height={48} rx="12" fill="url(#pgbar)" stroke="rgba(124,108,255,0.30)" />
          <text x={(NODES[1].x + NODES[4].x + NW) / 2} y={170} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600" fontFamily="system-ui">
            🐘 PostgreSQL 17 · schema atsdbwh
          </text>
          <text x={(NODES[1].x + NODES[4].x + NW) / 2} y={188} textAnchor="middle" fill="#a5b4fc" fontSize="10.5" fontFamily="system-ui">
            job queue (FOR UPDATE SKIP LOCKED) · cache · BYTEA storage · rate limiting — no Redis / Celery / S3
          </text>

          {/* capability chips */}
          {[
            { x: 20, label: "⚙️ Async FastAPI · controller→service→repository" },
            { x: 430, label: "🔒 7-layer security · JWT · AES-256 · RBAC" },
            { x: 790, label: "📈 3 domains × 3 vendors" },
          ].map((c) => (
            <g key={c.label}>
              <rect x={c.x} y={224} width={c.label.length * 6.0 + 20} height={28} rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x={c.x + 12} y={242} fill="#cbd5e1" fontSize="11" fontFamily="system-ui">{c.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
