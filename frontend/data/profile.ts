// Single source of truth for identity, positioning, and recruiter-facing facts.

export const profile = {
  name: "Daivik Sinha",

  // Recruiter optimization: the roles that must register in the first 5 seconds.
  roles: [
    "Full-Stack Developer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Backend Engineer",
    "Data Analytics",
  ],

  // The big positioning line. Engineer who ships production systems — not "a student".
  headline: "I build production-grade, AI-powered platforms — end to end.",

  tagline:
    "Backend · AI · Full-Stack engineer shipping enterprise BFSI systems: async FastAPI services, 40 GB-scale data pipelines, and LLM/RAG + ML features in production.",

  summary:
    "I architect and ship production systems end to end — async FastAPI backends, large-scale data pipelines, and LLM/RAG + machine-learning features. As a Software Development Intern I built a complete enterprise BFSI analytics platform from scratch: data ingestion, prediction engines, a 7-layer security model, and a 200+ chart analytics UI.",

  // Short value props surfaced near the top — the way a top-company engineer thinks.
  valueProps: [
    { label: "End-to-End Ownership", desc: "Designed, built, secured, and shipped a full platform solo." },
    { label: "Product Thinking", desc: "Engineering decisions tied to real BFSI business outcomes." },
    { label: "System Design", desc: "Layered architecture, zero-dependency infra, scalable by design." },
    { label: "Data-Driven", desc: "ML forecasting + analytics that drive recovery & retention." },
  ],

  location: "India · open to relocate / remote",
  email: "sinhadaivik8122@gmail.com",
  phone: "+91-8287035751",
  resumeUrl: "/DaivikSinhaResume.pdf",
  headshotUrl: "/headshot.jpg",

  socials: {
    github: "https://github.com/daiviksinha2004-pixel",
    linkedin: "https://www.linkedin.com/in/daivik-sinha-7492b0359",
  },

  // Cal.com username for the "book a 15-min chat" embed (e.g. "daivik" → cal.com/daivik).
  // Leave "" to hide the scheduler. ⚠️ Fill this in with your real Cal.com handle.
  calUsername: "cal.com/daivik-sinha-4ycaaj",

  education: {
    degree: "B.Tech, Mathematics & Data Science",
    school: "NIT Bhopal (MANIT)",
    years: "2022 – 2026",
    note: "Final year · graduating 2026",
  },

  // Recruiter "quick facts" panel — scannable in ~10 seconds.
  quickFacts: [
    { k: "Current Role", v: "SDE Intern · ATS Services" },
    { k: "Specialization", v: "Backend · Applied AI · Full-Stack" },
    { k: "Flagship", v: "Production BFSI analytics platform (solo build)" },
    { k: "Core Stack", v: "Python · FastAPI · React · TS · PostgreSQL" },
    { k: "AI / ML", v: "LLM · RAG · NL-to-SQL · scikit-learn · forecasting" },
    { k: "Education", v: "B.Tech Math & DS · NIT Bhopal · 2026" },
    { k: "Availability", v: "Open to full-time SWE / AI / Data roles" },
    { k: "Location", v: "India · remote-friendly · open to relocate" },
  ],
};

// Animated headline statistics — the proof-of-scale strip.
export const headlineStats: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 40, suffix: " GB+", label: "Datasets reconciled" },
  { value: 30000, suffix: "+", label: "Policies / campaign month" },
  { value: 7, label: "Prediction engines" },
  { value: 7, label: "Security layers" },
  { value: 60, suffix: "+", label: "API routes shipped" },
  { value: 200, suffix: "+", label: "Analytics charts built" },
];
