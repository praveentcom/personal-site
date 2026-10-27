const starFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const githubRepoUrl = (repo: string) => `https://github.com/${repo}`;

export const formatStars = (stars: number) => starFormatter.format(stars);

/**
 * Get a repository's star count, cached for an hour.
 * @returns The star count, or null when GitHub is unavailable
 */
export async function getGitHubStars(repo: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const { stargazers_count: stars } = await response.json();
    return typeof stars === "number" ? stars : null;
  } catch {
    return null;
  }
}
