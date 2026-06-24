"use client";

import { motion } from "framer-motion";

// A pure SVG/HTML/Tailwind pipeline illustration for the Desktop AI Agent project.
// No external images needed — built entirely from primitives.

const STEPS = [
  {
    icon: "🎙️",
    label: "Voice Input",
    sub: "Microphone capture",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/30",
  },
  {
    icon: "📝",
    label: "Whisper STT",
    sub: "Local transcription",
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
  },
  {
    icon: "🤖",
    label: "Ollama LLM",
    sub: "On-device reasoning",
    color: "from-brand-accent2 to-teal-500",
    glow: "shadow-teal-500/30",
  },
  {
    icon: "🔊",
    label: "Edge-TTS",
    sub: "Local speech synthesis",
    color: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-500/30",
  },
];

const PROPS = [
  { icon: "🔒", label: "100% Offline", desc: "Zero data egress — audio & transcripts never leave the machine" },
  { icon: "⚡", label: "Async + Multithreaded", desc: "Voice capture and LLM inference run concurrently, no UI freeze" },
  { icon: "🔄", label: "Model-Agnostic", desc: "Swap any Ollama model — Llama, Mistral, Phi — without code changes" },
  { icon: "🖥️", label: "Tkinter UI", desc: "Lightweight desktop GUI with live transcript and control panel" },
];

export function AIPipelineDiagram() {
  return (
    <div className="space-y-10">
      {/* Pipeline flow */}
      <div>
        <p className="eyebrow mb-6 text-center">Local AI Pipeline</p>
        <div className="relative flex flex-col items-center gap-0 sm:flex-row sm:items-stretch sm:justify-center">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center sm:flex-row sm:items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br ${step.color} bg-opacity-10 p-5 text-center shadow-xl ${step.glow} w-36`}
              >
                <div className="text-3xl">{step.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{step.label}</p>
                  <p className="mt-0.5 text-[10px] text-white/60">{step.sub}</p>
                </div>
                {/* animated pulse dot */}
                <span className="absolute -right-1.5 -top-1.5 flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-gradient-to-br ${step.color} opacity-75`} />
                  <span className={`relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br ${step.color}`} />
                </span>
              </motion.div>
              {/* Arrow connector (not after last item) */}
              {i < STEPS.length - 1 && (
                <div className="my-2 flex items-center sm:mx-2 sm:my-0">
                  <svg width="28" height="20" viewBox="0 0 28 20" className="rotate-90 sm:rotate-0 text-slate-600">
                    <path d="M0 10 L20 10 M16 5 L21 10 L16 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* animated dash */}
                    <path d="M0 10 L20 10" stroke="rgba(124,108,255,0.6)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-dash-flow" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Privacy badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-5 py-2 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Fully offline · Zero cloud dependencies · All data stays on-device
          </div>
        </div>
      </div>

      {/* Key properties */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PROPS.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{p.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{p.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{p.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Architecture mini-diagram */}
      <div className="rounded-2xl border border-white/[0.08] bg-surface/50 p-6">
        <p className="eyebrow mb-4">Architecture</p>
        <div className="font-mono text-xs leading-6 text-slate-400">
          <div>
            <span className="text-brand-violet">AudioCapture</span>
            <span className="text-slate-600"> ──[pcm]──▶ </span>
            <span className="text-teal-400">WhisperTranscriber</span>
            <span className="text-slate-600"> ──[text]──▶ </span>
            <span className="text-violet-400">OllamaInference</span>
          </div>
          <div className="mt-1">
            <span className="text-slate-600">                                          └──[response]──▶ </span>
            <span className="text-emerald-400">EdgeTTS</span>
            <span className="text-slate-600"> ──[audio]──▶ </span>
            <span className="text-blue-400">Speaker</span>
          </div>
          <div className="mt-3 text-slate-600">
            All stages run in background threads / asyncio tasks —
          </div>
          <div className="text-slate-600">
            Tkinter UI thread remains responsive throughout.
          </div>
        </div>
      </div>
    </div>
  );
}
