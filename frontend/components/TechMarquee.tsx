import { techStack } from "@/data/techstack";

export function TechMarquee() {
  // Two rows, opposite directions, pure CSS — no JS overhead.
  const row1 = techStack.slice(0, Math.ceil(techStack.length / 2));
  const row2 = techStack.slice(Math.ceil(techStack.length / 2));

  return (
    <div className="relative overflow-hidden py-12">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <Row items={row1} direction="forward" />
      <div className="mt-3" />
      <Row items={row2} direction="reverse" />
    </div>
  );
}

function Row({ items, direction }: { items: typeof techStack; direction: "forward" | "reverse" }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-3 ${direction === "forward" ? "animate-marquee" : "animate-marquee-rev"}`}
        style={{ willChange: "transform" }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: t.color, boxShadow: `0 0 6px ${t.color}55` }}
            />
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
