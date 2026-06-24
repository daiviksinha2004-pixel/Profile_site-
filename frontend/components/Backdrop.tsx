// Fixed, GPU-cheap decorative canvas sitting behind every section:
// animated aurora blobs + a faint engineering grid + film grain.
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />

      {/* Aurora blobs */}
      <div className="absolute -left-[12%] top-[-10%] h-[55vh] w-[55vh] rounded-full bg-brand-accent/25 blur-[120px] animate-aurora" />
      <div
        className="absolute right-[-8%] top-[18%] h-[48vh] w-[48vh] rounded-full bg-brand-accent2/20 blur-[120px] animate-aurora"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-[-12%] left-[28%] h-[50vh] w-[50vh] rounded-full bg-fuchsia-600/15 blur-[130px] animate-aurora"
        style={{ animationDelay: "-11s" }}
      />

      {/* Engineering grid */}
      <div className="absolute inset-0 grid-overlay opacity-60" />

      {/* Top vignette + film grain */}
      <div className="bd-vignette absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-10%,transparent_40%,rgba(5,6,12,0.6)_100%)]" />
      <div className="absolute inset-0 noise opacity-[0.04] mix-blend-soft-light" />
    </div>
  );
}
