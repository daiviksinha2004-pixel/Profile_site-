"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Github, Linkedin, FileText, MessageSquare, CalendarClock, Sparkles } from "lucide-react";

// Accepts "daivik", "cal.com/daivik", or "https://cal.com/daivik" and returns a clean URL.
function calUrl(v: string): string {
  const handle = v.trim().replace(/^https?:\/\//, "").replace(/^cal\.com\//, "").replace(/^\/+/, "");
  return `https://cal.com/${handle}`;
}

export function ContactSection({ onAskAI }: { onAskAI: () => void }) {
  return (
    <Section
      id="contact"
      eyebrow="Get In Touch"
      title="Open to great opportunities"
      subtitle="Looking for backend, applied-AI, or full-stack roles. The fastest way to learn about my work is to chat with my AI twin."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI twin CTA — dominant */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="glass glow-border col-span-3 flex flex-col gap-5 p-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet to-brand-accent2">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Ask my AI twin</h3>
              <p className="text-sm text-slate-400">Grounded in my real work, projects & skills</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            My portfolio chatbot is powered by a RAG system built on my actual experience, projects, and
            architecture decisions. Ask it about any project, my approach to system design, how I handled
            security, or what I'm looking for next.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {["Walk me through the ATS CRP architecture.", "What ML models did you ship?", "How does your data pipeline work?", "What roles are you open to?"].map((q) => (
              <button
                key={q}
                onClick={onAskAI}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:border-white/20 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
          <button onClick={onAskAI} className="btn-primary self-start">
            <MessageSquare className="h-4 w-4" />
            Open AI twin
          </button>
        </motion.div>

        {/* Direct links */}
        <div className="col-span-2 flex flex-col gap-4">
          {[
            { href: `mailto:${profile.email}`, label: "Email me directly", sub: profile.email, Icon: Mail, primary: true },
            { href: profile.socials.linkedin, label: "Connect on LinkedIn", sub: "linkedin.com/in/daivik-sinha-7492b0359", Icon: Linkedin, primary: false },
            { href: profile.socials.github, label: "See my code on GitHub", sub: "github.com/daiviksinha2004-pixel", Icon: Github, primary: false },
            { href: profile.resumeUrl, label: "Download Résumé", sub: "PDF · full engineering detail", Icon: FileText, primary: false },
          ].map(({ href, label, sub, Icon, primary }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 rounded-2xl border p-5 transition ${
                primary
                  ? "border-brand-violet/30 bg-brand-violet/10 hover:bg-brand-violet/15"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${primary ? "bg-brand-violet/20" : "bg-white/[0.04]"}`}>
                <Icon className={`h-5 w-5 ${primary ? "text-brand-violet" : "text-slate-400"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Contact form + booking */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="lg:col-span-2">
          {profile.calUsername ? (
            <div className="glass flex h-full flex-col justify-between gap-5 p-6">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent2/15">
                  <CalendarClock className="h-5 w-5 text-brand-accent2" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">Book a 15-min chat</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Grab a slot that works for you — happy to walk through any project live.
                </p>
              </div>
              <a
                href={calUrl(profile.calUsername)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary justify-center"
              >
                <CalendarClock className="h-4 w-4" /> Pick a time
              </a>
            </div>
          ) : (
            <div className="glass flex h-full flex-col justify-between gap-5 p-6">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-violet/15">
                  <Sparkles className="h-5 w-5 text-brand-violet" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">Prefer async?</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Ask my AI twin anything about my work — it answers instantly, grounded in real data.
                </p>
              </div>
              <button onClick={onAskAI} className="btn-ghost justify-center">
                <MessageSquare className="h-4 w-4" /> Open AI twin
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
