import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// Branded social-share card auto-used by Next for OpenGraph + Twitter previews.
export const alt = `${profile.name} — ${profile.roles.join(" · ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#05060c",
          backgroundImage:
            "radial-gradient(900px 500px at 15% -10%, rgba(124,108,255,0.35), transparent 60%), radial-gradient(700px 500px at 100% 110%, rgba(34,211,238,0.22), transparent 60%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c6cff, #22d3ee)",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            DS
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(52,211,153,0.35)",
              background: "rgba(52,211,153,0.12)",
              color: "#34d399",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
            Open to SWE · AI · Data roles
          </div>
        </div>

        {/* name + roles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {profile.roles.map((r) => (
              <div
                key={r}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* tagline */}
        <div style={{ display: "flex", fontSize: 30, color: "#cbd5e1", maxWidth: 1000, lineHeight: 1.35 }}>
          Building production-grade, AI-powered BFSI platforms — backend, applied AI & full-stack.
        </div>
      </div>
    ),
    { ...size },
  );
}
