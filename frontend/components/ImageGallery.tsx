"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import type { Shot } from "@/data/projects";

interface Props {
  shots: Shot[];
  /** Show group-tab navigation. Default true when groups present. */
  groupTabs?: boolean;
}

export function ImageGallery({ shots, groupTabs = true }: Props) {
  const groups = useMemo(() => {
    const seen: string[] = [];
    shots.forEach((s) => {
      const g = s.group ?? "All";
      if (!seen.includes(g)) seen.push(g);
    });
    return seen;
  }, [shots]);

  const hasGroups = groupTabs && groups.length > 1;
  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "All");
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  // The filtered shots for the current group (used for display & lightbox nav).
  const visible = useMemo(
    () =>
      hasGroups && activeGroup !== "All"
        ? shots.filter((s) => (s.group ?? "All") === activeGroup)
        : shots,
    [hasGroups, activeGroup, shots],
  );

  function open(i: number) { setLbIndex(i); }
  function close() { setLbIndex(null); }
  function prev() { setLbIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)); }
  function next() { setLbIndex((i) => (i === null ? null : (i + 1) % visible.length)); }

  return (
    <div>
      {/* Group tabs */}
      {hasGroups && (
        <div className="mb-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => { setActiveGroup(g); close(); }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeGroup === g
                  ? "bg-brand-violet/20 border border-brand-violet/40 text-violet-300"
                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {g}
              <span className="ml-1.5 text-slate-500">
                {shots.filter((s) => (s.group ?? "All") === g).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((shot, i) => (
          <motion.button
            key={shot.src + i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => open(i)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-white/[0.08] bg-surface hover:border-brand-violet/40 focus:outline-none"
            aria-label={shot.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.title}
              className="h-full w-full object-cover transition duration-400 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-3 opacity-0 transition duration-250 group-hover:opacity-100">
              <p className="text-left text-xs font-semibold text-white leading-tight">{shot.title}</p>
            </div>
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 opacity-0 backdrop-blur transition group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5 text-white" />
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox shots={visible} index={lbIndex} onClose={close} onPrev={prev} onNext={next} />
    </div>
  );
}
