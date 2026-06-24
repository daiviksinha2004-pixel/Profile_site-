"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Bot, User, Sparkles, Mic, FileText, Copy, Check } from "lucide-react";
import { streamChat, type ChatMessage } from "@/lib/api";
import { profile } from "@/data/profile";

type ChatMsg = ChatMessage & { sources?: string[] };

// Recruiter-first openers shown on an empty chat.
const STARTERS = [
  "What's his strongest project?",
  "Is he available for full-time roles?",
  "Does he have production / RAG experience?",
  "Walk me through the ATS CRP architecture.",
];

// Pool of smart follow-ups offered after each answer (de-duplicated against what was asked).
const FOLLOWUP_POOL = [
  "What prediction engines did he build?",
  "How did he handle security?",
  "How does his data pipeline work?",
  "What ML models has he shipped?",
  "What's his full tech stack?",
  "What did he build at his internship?",
  "What was the hardest bug he fixed?",
  "Why PostgreSQL-only (no Redis/Celery)?",
  "What roles is he looking for?",
  "How can I contact him?",
];

// Map a knowledge-file source to a friendly label + on-page anchor.
const SOURCE_MAP: Record<string, { label: string; anchor: string }> = {
  "00-profile.md": { label: "Profile", anchor: "about" },
  "01-experience.md": { label: "Experience", anchor: "experience" },
  "02-project-ats-crp.md": { label: "ATS CRP", anchor: "flagship" },
  "03-projects.md": { label: "Projects", anchor: "projects" },
  "04-skills.md": { label: "Skills", anchor: "skills" },
  "05-faq.md": { label: "FAQ", anchor: "contact" },
  "06-personality-working-style.md": { label: "Working style", anchor: "about" },
  "07-professional-profile-extended.md": { label: "Profile", anchor: "about" },
};

function sourceMeta(src: string) {
  return SOURCE_MAP[src] ?? { label: src.replace(/\.md$/, "").replace(/^\d+-/, ""), anchor: "projects" };
}

export function ChatWidget({
  open,
  setOpen,
  prefill,
  onPrefillConsumed,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  prefill?: string;
  onPrefillConsumed?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Auto-send a question handed in from the ⌘K palette ("Ask AI: …").
  useEffect(() => {
    if (open && prefill && !streaming) {
      send(prefill);
      onPrefillConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill]);

  // Set up the Web Speech API once (browser-native STT — a nod to the Desktop AI Agent project).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setVoiceSupported(true);
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      try { rec.abort(); } catch {}
    };
  }, []);

  function toggleVoice() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      setInput("");
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }

  const askedSet = useMemo(
    () => new Set(messages.filter((m) => m.role === "user").map((m) => m.content.toLowerCase().trim())),
    [messages],
  );

  // Follow-ups: shown after a completed assistant answer; never repeat an asked question.
  const followups = useMemo(() => {
    const last = messages[messages.length - 1];
    if (streaming || !last || last.role !== "assistant" || !last.content) return [];
    return FOLLOWUP_POOL.filter((q) => !askedSet.has(q.toLowerCase().trim())).slice(0, 3);
  }, [messages, streaming, askedSet]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    const history = messages;
    setMessages((m) => [...m, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    try {
      await streamChat(question, history, {
        onSources: (srcs) =>
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") copy[copy.length - 1] = { ...last, sources: srcs };
            return copy;
          }),
        onToken: (token) =>
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, role: "assistant", content: last.content + token };
            return copy;
          }),
        onError: (msg) =>
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, role: "assistant", content: last.content || `⚠️ ${msg}` };
            return copy;
          }),
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet to-indigo-600 text-white shadow-glow transition hover:scale-105"
        aria-label="Open AI chat"
        style={{ display: open ? "none" : undefined }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[72vh] max-h-[660px] w-[min(430px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-accent2">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ask my AI twin</p>
                  <p className="text-[11px] text-slate-500">RAG · grounded in real data</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <p className="text-sm font-semibold text-white">Hi 👋 I'm {profile.name}'s AI twin</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Ask me anything about Daivik's experience, projects, architecture decisions, and skills —
                      every answer is grounded in his real data and cites its source.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">Popular questions:</p>
                  <div className="flex flex-col gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left text-xs text-slate-300 transition hover:border-brand-violet/30 hover:bg-brand-violet/5 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${m.role === "user" ? "bg-brand-violet/20" : "bg-brand-accent2/15"}`}>
                    {m.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-brand-violet" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-brand-accent2" />
                    )}
                  </span>
                  <div className={`flex max-w-[82%] flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-brand-violet/15 text-violet-100"
                          : "border border-white/[0.07] bg-white/[0.04] text-slate-200"
                      }`}
                    >
                      {m.content || (
                        <span className="flex gap-1">
                          <span className="animate-bounce text-slate-500 [animation-delay:0ms]">·</span>
                          <span className="animate-bounce text-slate-500 [animation-delay:150ms]">·</span>
                          <span className="animate-bounce text-slate-500 [animation-delay:300ms]">·</span>
                        </span>
                      )}
                    </div>

                    {/* Copy + source citations */}
                    {m.role === "assistant" && m.content && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(m.content);
                            setCopiedIdx(i);
                            setTimeout(() => setCopiedIdx((c) => (c === i ? null : c)), 1500);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-slate-400 transition hover:text-white"
                        >
                          {copiedIdx === i ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                          {copiedIdx === i ? "Copied" : "Copy"}
                        </button>
                        {m.sources && m.sources.length > 0 && (
                          <span className="text-[10px] text-slate-600">Sources:</span>
                        )}
                        {(m.sources ?? []).filter(Boolean).map((src) => {
                          const meta = sourceMeta(src);
                          return (
                            <a
                              key={src}
                              href={`#${meta.anchor}`}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-slate-400 transition hover:border-brand-accent2/40 hover:text-brand-accent2"
                            >
                              <FileText className="h-2.5 w-2.5" />
                              {meta.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Smart follow-ups */}
              {followups.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                  {followups.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-brand-violet/25 bg-brand-violet/10 px-2.5 py-1 text-[11px] text-violet-200 transition hover:border-brand-violet/50 hover:bg-brand-violet/20"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t border-white/[0.07] p-3"
            >
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={listening ? "Stop voice input" : "Start voice input"}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                    listening
                      ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
                      : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white"
                  }`}
                >
                  {listening ? (
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/40" />
                      <Mic className="relative h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening…" : "Ask about a project, skill, or role…"}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition focus:border-brand-violet/50 focus:bg-white/[0.06]"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-indigo-600 text-white shadow-glow transition disabled:opacity-30"
                aria-label="Send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
