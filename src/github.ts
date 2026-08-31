export type PrStatus = {
  ecosystem: string;
  repo: string;
  number: number;
  label: string;
  state: string;
  title: string;
  url: string;
  mergeable: boolean | null;
  draft: boolean;
  updatedAt: string;
  reviewDecision?: string;
  error?: string;
};

type GhPull = {
  state: string;
  title: string;
  html_url: string;
  mergeable: boolean | null;
  draft: boolean;
  updated_at: string;
};

export async function fetchPrStatus(
  owner: string,
  repo: string,
  number: number,
  meta: { ecosystem: string; label: string },
): Promise<PrStatus> {
  const base = {
    ecosystem: meta.ecosystem,
    repo: `${owner}/${repo}`,
    number,
    label: meta.label,
  };

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "ecosystem-monitor-agent",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
      { headers },
    );
    if (!res.ok) {
      return {
        ...base,
        state: "error",
        title: "",
        url: `https://github.com/${owner}/${repo}/pull/${number}`,
        mergeable: null,
        draft: false,
        updatedAt: "",
        error: `HTTP ${res.status}`,
      };
    }

    const pr = (await res.json()) as GhPull;
    return {
      ...base,
      state: pr.state,
      title: pr.title,
      url: pr.html_url,
      mergeable: pr.mergeable,
      draft: pr.draft,
      updatedAt: pr.updated_at,
    };
  } catch (error) {
    return {
      ...base,
      state: "error",
      title: "",
      url: `https://github.com/${owner}/${repo}/pull/${number}`,
      mergeable: null,
      draft: false,
      updatedAt: "",
      error: error instanceof Error ? error.message : "fetch failed",
    };
  }
}
