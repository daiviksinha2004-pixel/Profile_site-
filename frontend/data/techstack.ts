export type TechItem = { name: string; category: string; color: string };

export const techStack: TechItem[] = [
  // Backend
  { name: "Python", category: "Backend", color: "#3776AB" },
  { name: "FastAPI", category: "Backend", color: "#009688" },
  { name: "SQLAlchemy", category: "Backend", color: "#D71F00" },
  { name: "Pydantic", category: "Backend", color: "#E92063" },
  { name: "asyncio", category: "Backend", color: "#FFD43B" },
  // Database
  { name: "PostgreSQL", category: "Database", color: "#336791" },
  { name: "Oracle DB", category: "Database", color: "#F80000" },
  { name: "ChromaDB", category: "Database", color: "#7C3AED" },
  { name: "Alembic", category: "Database", color: "#6B7280" },
  // Frontend
  { name: "React 18", category: "Frontend", color: "#61DAFB" },
  { name: "TypeScript", category: "Frontend", color: "#3178C6" },
  { name: "Tailwind CSS", category: "Frontend", color: "#06B6D4" },
  { name: "Vite", category: "Frontend", color: "#646CFF" },
  { name: "Zustand", category: "Frontend", color: "#FF6B35" },
  { name: "TanStack Query", category: "Frontend", color: "#FF4154" },
  { name: "Recharts", category: "Frontend", color: "#8884D8" },
  { name: "Framer Motion", category: "Frontend", color: "#BB4BFF" },
  // AI & ML
  { name: "Llama 3", category: "AI/ML", color: "#0064E0" },
  { name: "Ollama", category: "AI/ML", color: "#FFFFFF" },
  { name: "Whisper", category: "AI/ML", color: "#10A37F" },
  { name: "LangChain", category: "AI/ML", color: "#1C3C3C" },
  { name: "scikit-learn", category: "AI/ML", color: "#F7931E" },
  { name: "XGBoost", category: "AI/ML", color: "#189AB4" },
  { name: "RAG", category: "AI/ML", color: "#7C6CFF" },
  // DevOps
  { name: "Docker", category: "DevOps", color: "#2496ED" },
  { name: "Linux", category: "DevOps", color: "#FCC624" },
  { name: "Git", category: "DevOps", color: "#F05032" },
  { name: "GitLab CI", category: "DevOps", color: "#FC6D26" },
  { name: "Power BI", category: "DevOps", color: "#F2C811" },
  { name: "Next.js", category: "DevOps", color: "#FFFFFF" },
];
