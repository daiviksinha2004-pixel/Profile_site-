"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, ExternalLink, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/Section";
import {
  githubUsername, fetchTopRepos, fetchContributions, toWeeks,
  type Repo, type Contributions,
} from "@/lib/github";

const LEVELS = [
  "bg-white/[0.05]",
  "bg-brand-violet/30",
  "bg-brand-violet/55",
  "bg-brand-violet/80",
  "bg-brand-violet",
];

const LANG_COLOR: Record<string, string> = {
  Python: "#3776AB", TypeScript: "#3178C6", JavaScript: "#F7DF1E", HTML: "#E34F26",
  CSS: "#563D7C", Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B", Shell: "#89E051",
};

export function GitHubSection() {
  const user = githubUsername();
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [contrib, setContrib] = useState<Contributions | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    Promise.allSettled([fetchTopRepos(user), fetchContributions(user)]).then(([r, c]) => {
      if (!alive) return;
      if (r.status === "fulfilled") setRepos(r.value);
      if (c.status === "fulfilled") setContrib(c.value);
      if (r.status === "rejected" && c.status === "rejected") setFailed(true);
    });
    return () => { alive = false; };
  }, [user]);

  const weeks = contrib ? toWeeks(contrib.days) : [];

  return (
    <Section
      id="github"
      eyebrow="Open Source"
      title="GitHub Activity"
      subtitle="Live from the GitHub API — what I've been building lately."
    >
      {/* Contribution heatmap */}
      <div className="glass mb-6 overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-semibold text-white">
              {contrib ? `${contrib.total.toLocaleString()} contributions` : "Contributions"}
            </span>
            <span className="text-xs text-slate-500">· last year</span>
          </div>
          <a
            href={`https://github.com/${user}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            @{user} <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {contrib ? (
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day ? `${day.count} on ${day.date}` : ""}
                      className={`h-[11px] w-[11px] rounded-[2px] ${day ? LEVELS[day.level] : "bg-transparent"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate-500">
              Less
              {LEVELS.map((l, i) => (
                <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${l}`} />
              ))}
              More
            </div>
          </div>
        ) : failed ? (
          <p className="text-sm text-slate-500">
            Couldn't load live data (rate limit) —{" "}
            <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className="text-brand-accent2 hover:underline">
              view the profile on GitHub →
            </a>
          </p>
        ) : (
          <div className="h-[100px] animate-pulse rounded-lg bg-white/[0.03]" />
        )}
      </div>

      {/* Top repos */}
      {repos === null && !failed ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      ) : repos && repos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <motion.a
              key={r.name}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="glass glow-border group flex flex-col p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Github className="h-4 w-4 text-slate-400" />
                  {r.name}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-brand-accent2" />
              </div>
              <p className="flex-1 text-xs text-slate-400 leading-relaxed line-clamp-3">
                {r.description ?? "—"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLOR[r.language] ?? "#7c6cff" }} />
                    {r.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {r.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {r.forks_count}</span>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="glass p-6 text-center">
          <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className="btn-ghost inline-flex">
            <Github className="h-4 w-4" /> View my GitHub profile
          </a>
        </div>
      )}
    </Section>
  );
}
