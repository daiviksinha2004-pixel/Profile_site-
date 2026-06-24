// Client-side GitHub data — uses public, unauthenticated endpoints.
// Repos: GitHub REST API. Contribution calendar: jogruber's public contributions API.
import { profile } from "@/data/profile";

export function githubUsername(): string {
  const m = profile.socials.github.match(/github\.com\/([^/?#]+)/i);
  return m ? m[1] : "";
}

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};

export type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: ContribDay[] };

export async function fetchTopRepos(user: string, limit = 6): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`GitHub repos ${res.status}`);
  const repos: (Repo & { fork: boolean; archived: boolean })[] = await res.json();
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
    .slice(0, limit);
}

export async function fetchContributions(user: string): Promise<Contributions> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
  if (!res.ok) throw new Error(`GitHub contributions ${res.status}`);
  const data = await res.json();
  const days: ContribDay[] = (data.contributions ?? []).map((d: any) => ({
    date: d.date,
    count: d.count,
    level: Math.max(0, Math.min(4, Number(d.level ?? 0))) as ContribDay["level"],
  }));
  const total =
    typeof data.total === "number"
      ? data.total
      : Object.values(data.total ?? {}).reduce((a: number, b: any) => a + Number(b), 0);
  return { total, days };
}

// Group a flat day list into week-columns of 7 (row 0 = Sunday).
export function toWeeks(days: ContribDay[]): (ContribDay | null)[][] {
  if (days.length === 0) return [];
  const firstDow = new Date(days[0].date + "T00:00:00").getDay();
  const cells: (ContribDay | null)[] = [...Array(firstDow).fill(null), ...days];
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
