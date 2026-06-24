"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Network error — please email directly.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        <p className="text-sm font-semibold text-white">Message sent — thanks!</p>
        <p className="text-xs text-slate-400">I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass flex flex-col gap-3 p-6">
      <p className="eyebrow">Send a message</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-violet/50"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="you@company.com"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-violet/50"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={4}
        placeholder="What would you like to talk about?"
        className="resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-violet/50"
      />
      {/* honeypot (hidden from humans) */}
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {status === "error" && <p className="text-xs text-rose-400">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary self-start disabled:opacity-50">
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
