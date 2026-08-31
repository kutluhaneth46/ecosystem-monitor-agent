import type { PrStatus } from "./github.js";
import type { RpcHealth } from "./rpc.js";
import { SHOWCASE_LINKS } from "./tracked.js";

export function buildMarkdownReport(args: {
  generatedAt: string;
  pullRequests: PrStatus[];
  rpc: RpcHealth[];
  summary?: string;
}): string {
  const open = args.pullRequests.filter((p) => p.state === "open");
  const merged = args.pullRequests.filter((p) => p.state === "merged");
  const errors = args.pullRequests.filter((p) => p.state === "error");

  const lines = [
    `# Ecosystem Monitor — ${args.generatedAt}`,
    "",
    args.summary ? `## Summary\n${args.summary}\n` : "",
    "## Pull requests",
    "",
    `Open: **${open.length}** · Merged: **${merged.length}** · Errors: **${errors.length}**`,
    "",
    "| Ecosystem | PR | State | Mergeable | Updated |",
    "|-----------|-----|-------|-----------|---------|",
    ...args.pullRequests.map(
      (p) =>
        `| ${p.ecosystem} | [${p.repo}#${p.number}](${p.url}) ${p.label} | ${p.state}${p.draft ? " (draft)" : ""} | ${p.mergeable ?? "—"} | ${p.updatedAt.slice(0, 10) || "—"} |`,
    ),
    "",
    "## RPC health",
    "",
    "| Ecosystem | Endpoint | OK | Chain | Block | Latency |",
    "|-----------|----------|----|-------|-------|---------|",
    ...args.rpc.map(
      (r) =>
        `| ${r.ecosystem} | ${r.name} | ${r.ok ? "✅" : "❌"} | ${r.chainId ?? "—"} | ${r.blockNumber ?? "—"} | ${r.latencyMs}ms |`,
    ),
    "",
    "## Showcase repos",
    "",
    ...SHOWCASE_LINKS.map((s) => `- **${s.ecosystem}**: [${s.title}](${s.url})`),
  ];

  return lines.filter(Boolean).join("\n");
}

export function countAlerts(pullRequests: PrStatus[], rpc: RpcHealth[]) {
  const prErrors = pullRequests.filter((p) => p.state === "error").length;
  const rpcDown = rpc.filter((r) => !r.ok).length;
  return prErrors + rpcDown;
}
