"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { ExperienceSection } from "@/components/ExperienceSection";
import { TimelineSection } from "@/components/TimelineSection";
import { FlagshipSection } from "@/components/FlagshipSection";
import { FeaturedProject } from "@/components/FeaturedProject";
import { SecondaryProjects } from "@/components/SecondaryProjects";
import { UIUXSection } from "@/components/UIUXSection";
import { SkillsSection } from "@/components/SkillsSection";
import { CredentialsSection } from "@/components/CredentialsSection";
import { ContactSection } from "@/components/ContactSection";
import { ChatWidget } from "@/components/ChatWidget";
import { CommandPalette } from "@/components/CommandPalette";
import { GitHubSection } from "@/components/GitHubSection";
import { Section } from "@/components/Section";
import { profile } from "@/data/profile";
import { featuredProjects } from "@/data/projects";

// featuredProjects[0] = ATS CRP flagship (rendered by FlagshipSection)
// featuredProjects[1] = ML Portal
// featuredProjects[2] = Desktop AI Agent
const mlPortal = featuredProjects[1];
const desktopAgent = featuredProjects[2];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [askPrefill, setAskPrefill] = useState<string | undefined>(undefined);

  function askAI(q?: string) {
    if (q) setAskPrefill(q);
    setChatOpen(true);
  }

  return (
    <main className="relative">
      <CommandPalette onAskAI={askAI} />
      <Navbar onAskAI={askAI} />

      {/* ── HERO ── */}
      <Hero onAskAI={askAI} />

      {/* ── TECH MARQUEE ── */}
      <div className="border-y border-white/[0.05]">
        <TechMarquee />
      </div>

      {/* ── ABOUT (brief — recruiter fast-read) ── */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Summary */}
          <div className="col-span-2 glass p-8">
            <p className="eyebrow mb-3">About</p>
            <h2 className="font-display text-2xl font-bold text-white">
              {profile.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {profile.summary}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {profile.valueProps.map((v) => (
                <div key={v.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="text-xs font-semibold text-white">{v.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Quick facts */}
          <div className="glass p-6">
            <p className="eyebrow mb-4">Quick Facts</p>
            <div className="space-y-3">
              {profile.quickFacts.map((f) => (
                <div key={f.k} className="flex gap-2">
                  <span className="w-[100px] shrink-0 text-[11px] text-slate-500">{f.k}</span>
                  <span className="text-[11px] text-slate-200">{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <ExperienceSection />

      {/* ── ENGINEERING TIMELINE ── */}
      <TimelineSection />

      {/* ── PROJECTS ── */}
      <div id="projects">
        {/* Flagship: ATS CRP */}
        <FlagshipSection />

        {/* Featured: ML Portal */}
        <Section
          id="ml-portal"
          eyebrow="Featured Project"
          title="ML & Analytics Portal"
          subtitle="A full-stack BFSI predictive platform — real-time ML inference, NL-to-SQL agent, and a polished light/dark analytics UI."
        >
          <FeaturedProject project={mlPortal} />
        </Section>

        {/* UI/UX Design Showcase */}
        <UIUXSection />

        {/* Featured: Desktop AI Agent */}
        <Section
          id="desktop-ai"
          eyebrow="Featured Project"
          title="Local-Hosted Desktop AI Agent"
          subtitle="A fully offline voice assistant — Whisper STT + local Ollama LLM + Edge-TTS. Zero data egress."
        >
          <FeaturedProject project={desktopAgent} />
        </Section>

        {/* Secondary projects */}
        <Section
          id="more-projects"
          eyebrow="More Projects"
          title="Other work"
        >
          <SecondaryProjects />
        </Section>
      </div>

      {/* ── SKILLS ── */}
      <SkillsSection />

      {/* ── GITHUB ── */}
      <GitHubSection />

      {/* ── CREDENTIALS ── */}
      <CredentialsSection />

      {/* ── CONTACT ── */}
      <ContactSection onAskAI={askAI} />

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-10 text-center text-xs text-slate-600">
        <p>Built by {profile.name} · Next.js 15 + FastAPI + RAG (Groq · Gemini)</p>
        <p className="mt-1">{profile.email} · {profile.location}</p>
        <p className="mt-2 text-slate-700">
          Press <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px]">⌘K</kbd> to search or ask the AI
        </p>
      </footer>

      {/* ── CHAT WIDGET ── */}
      <ChatWidget
        open={chatOpen}
        setOpen={setChatOpen}
        prefill={askPrefill}
        onPrefillConsumed={() => setAskPrefill(undefined)}
      />
    </main>
  );
}
