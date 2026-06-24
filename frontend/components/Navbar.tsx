"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, FileText, Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { profile } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#uiux", label: "UI/UX" },
  { href: "#skills", label: "Skills" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ onAskAI }: { onAskAI?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.07] bg-ink/80 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-violet to-brand-accent2 text-xs font-bold text-white shadow-glow">
              DS
            </span>
            <span className="hidden sm:block">{profile.name}</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("palette:open"))}
              aria-label="Open command palette"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white lg:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="font-sans text-[10px] text-slate-500">⌘K</kbd>
            </button>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary hidden h-9 px-4 text-xs sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" />
              Résumé
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
            />
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed right-0 top-0 z-[61] flex h-full w-72 flex-col border-l border-white/[0.08] bg-surface p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display font-semibold text-white">{profile.name}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-primary justify-center text-sm">
                  <FileText className="h-4 w-4" /> Download Résumé
                </a>
                <div className="flex gap-3">
                  <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn-ghost flex-1 justify-center text-sm">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn-ghost flex-1 justify-center text-sm">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
