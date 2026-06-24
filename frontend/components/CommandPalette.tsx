"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, CornerDownLeft, Sparkles, Home, User, Briefcase, GitBranch,
  Server, Cpu, Palette, Layers, Award, Mail, FileText, Github, Linkedin, ArrowRight,
} from "lucide-react";
import { profile } from "@/data/profile";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  group: "Go to" | "Actions";
  run: () => void;
};

export function CommandPalette({ onAskAI }: { onAskAI: (q?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function go(anchor: string) {
    setOpen(false);
    setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 60);
  }
  function ext(url: string) {
    setOpen(false);
    window.open(url, url.startsWith("mailto") ? "_self" : "_blank");
  }

  const commands: Cmd[] = useMemo(
    () => [
      { id: "top", label: "Home / Top", icon: Home, group: "Go to", run: () => go("top") },
      { id: "about", label: "About", icon: User, group: "Go to", run: () => go("about") },
      { id: "experience", label: "Experience", icon: Briefcase, group: "Go to", run: () => go("experience") },
      { id: "journey", label: "Engineering Journey", icon: GitBranch, group: "Go to", run: () => go("journey") },
      { id: "flagship", label: "ATS CRP — BFSI Platform", hint: "Flagship", icon: Server, group: "Go to", run: () => go("flagship") },
      { id: "ml-portal", label: "ML & Analytics Portal", icon: Cpu, group: "Go to", run: () => go("ml-portal") },
      { id: "uiux", label: "UI / UX Design", icon: Palette, group: "Go to", run: () => go("uiux") },
      { id: "desktop-ai", label: "Desktop AI Agent", icon: Cpu, group: "Go to", run: () => go("desktop-ai") },
      { id: "github", label: "GitHub Activity", icon: Github, group: "Go to", run: () => go("github") },
      { id: "skills", label: "Skills", icon: Layers, group: "Go to", run: () => go("skills") },
      { id: "credentials", label: "Credentials", icon: Award, group: "Go to", run: () => go("credentials") },
      { id: "contact", label: "Contact", icon: Mail, group: "Go to", run: () => go("contact") },
      { id: "ai", label: "Ask the AI twin", hint: "RAG chatbot", icon: Sparkles, group: "Actions", run: () => { setOpen(false); onAskAI(); } },
      { id: "resume", label: "Download résumé", icon: FileText, group: "Actions", run: () => ext(profile.resumeUrl) },
      { id: "email", label: "Email Daivik", icon: Mail, group: "Actions", run: () => ext(`mailto:${profile.email}`) },
      { id: "gh", label: "GitHub profile", icon: Github, group: "Actions", run: () => ext(profile.socials.github) },
      { id: "li", label: "LinkedIn profile", icon: Linkedin, group: "Actions", run: () => ext(profile.socials.linkedin) },
    ],
    [onAskAI],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => (c.label + " " + (c.hint ?? "")).toLowerCase().includes(q));
  }, [query, commands]);

  // The dynamic "ask AI with this text" row, shown whenever the query has no clean match.
  const askRow = query.trim().length > 1;
  const total = filtered.length + (askRow ? 1 : 0);

  useEffect(() => setActive(0), [query]);

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpenEvent() { setOpen(true); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function trigger(i: number) {
    if (askRow && i === total - 1) {
      setOpen(false);
      onAskAI(query.trim());
      return;
    }
    filtered[i]?.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % total); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + total) % total); }
    else if (e.key === "Enter") { e.preventDefault(); trigger(active); }
  }

  let renderIndex = -1;
  const groups: ("Go to" | "Actions")[] = ["Go to", "Actions"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-surface/90 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* search */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search sections or ask the AI…"
                className="flex-1 bg-transparent py-4 text-sm text-white placeholder-slate-600 outline-none"
              />
              <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500">ESC</kbd>
            </div>

            {/* results */}
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {groups.map((g) => {
                const items = filtered.filter((c) => c.group === g);
                if (items.length === 0) return null;
                return (
                  <div key={g} className="mb-1">
                    <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">{g}</p>
                    {items.map((c) => {
                      renderIndex++;
                      const idx = renderIndex;
                      const Icon = c.icon;
                      const isActive = idx === active;
                      return (
                        <button
                          key={c.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => trigger(idx)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                            isActive ? "bg-brand-violet/20 text-white" : "text-slate-300 hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-violet" : "text-slate-500"}`} />
                          <span className="flex-1">{c.label}</span>
                          {c.hint && <span className="text-[10px] text-slate-500">{c.hint}</span>}
                          {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-slate-500" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {/* dynamic ask-AI row */}
              {askRow && (() => {
                renderIndex++;
                const idx = renderIndex;
                const isActive = idx === active;
                return (
                  <button
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => trigger(idx)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      isActive ? "bg-brand-violet/20 text-white" : "text-slate-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Sparkles className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-accent2" : "text-slate-500"}`} />
                    <span className="flex-1">Ask the AI twin: <span className="text-brand-accent2">“{query.trim()}”</span></span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                );
              })()}

              {total === 0 && (
                <p className="px-3 py-6 text-center text-sm text-slate-500">No matches.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
