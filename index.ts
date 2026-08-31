import { defineAgent, defineStep, goto, terminate } from "@sapiom/agent";
import { z } from "zod/v4";
import { fetchPrStatus } from "./src/github.js";
import { buildMarkdownReport, countAlerts } from "./src/format.js";
import { checkRpcHealth } from "./src/rpc.js";
import { RPC_ENDPOINTS, TRACKED_PRS } from "./src/tracked.js";

const Ecosystem = z.enum(["arc", "tempo", "miden", "sapiom", "all"]);

const entryInput = z.object({
  ecosystems: z
    .array(Ecosystem)
    .default(["all"])
    .describe("Which ecosystems to scan (all = arc + tempo + miden + sapiom)"),
  includeRpc: z.boolean().default(true).describe("Ping public RPC endpoints"),
  summarize: z
    .boolean()
    .default(true)
    .describe("Use llm.run for a short executive summary"),
});

const scanPayload = z.object({
  generatedAt: z.string(),
  pullRequests: z.array(z.record(z.string(), z.unknown())),
  rpc: z.array(z.record(z.string(), z.unknown())),
  summarize: z.boolean(),
});

function filterEcosystems(selected: z.infer<typeof Ecosystem>[]) {
  const all = selected.includes("all");
  return (eco: string) => all || selected.includes(eco as z.infer<typeof Ecosystem>);
}

const scan = defineStep({
  name: "scan",
  next: ["report"],
  inputSchema: entryInput,
  async run(input, ctx) {
    const keep = filterEcosystems(input.ecosystems);
    const prs = TRACKED_PRS.filter((p) => keep(p.ecosystem));

    ctx.logger.info("scanning pull requests", { count: prs.length });

    const pullRequests = await Promise.all(
      prs.map((p) =>
        fetchPrStatus(p.owner, p.repo, p.number, {
          ecosystem: p.ecosystem,
          label: p.label,
        }),
      ),
    );

    const rpc = input.includeRpc
      ? await Promise.all(
          RPC_ENDPOINTS.filter((e) => keep(e.ecosystem)).map((e) =>
            checkRpcHealth(e),
          ),
        )
      : [];

    const generatedAt = new Date().toISOString();

    return goto("report", {
      generatedAt,
      pullRequests,
      rpc,
      summarize: input.summarize,
    });
  },
});

const report = defineStep({
  name: "report",
  next: [],
  terminal: true,
  inputSchema: scanPayload,
  async run(input, ctx) {
    const pullRequests = input.pullRequests as Awaited<
      ReturnType<typeof fetchPrStatus>
    >[];
    const rpc = input.rpc as Awaited<ReturnType<typeof checkRpcHealth>>[];

    let summary: string | undefined;
    if (input.summarize) {
      const open = pullRequests.filter((p) => p.state === "open");
      const merged = pullRequests.filter((p) => p.state === "merged");
      const rpcDown = rpc.filter((r) => !r.ok);

      const reply = await ctx.sapiom.llm.run<{
        content?: Array<{ type: string; text?: string }>;
      }>({
        model: "small",
        request: {
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: `Write a 3-5 sentence executive summary for a contributor tracking Arc, Tempo, Miden, and Sapiom PRs.
Open PRs (${open.length}): ${open.map((p) => `${p.repo}#${p.number}`).join(", ") || "none"}
Merged (${merged.length}): ${merged.map((p) => `${p.repo}#${p.number}`).join(", ") || "none"}
RPC issues: ${rpcDown.map((r) => r.name).join(", ") || "none"}
Tone: concise, actionable, no hype.`,
            },
          ],
        },
      });

      summary = reply.content?.find((b) => b.type === "text")?.text;
    }

    const markdown = buildMarkdownReport({
      generatedAt: input.generatedAt,
      pullRequests,
      rpc,
      summary,
    });

    const alerts = countAlerts(pullRequests, rpc);

    return terminate({
      ok: alerts === 0,
      alerts,
      generatedAt: input.generatedAt,
      summary,
      markdown,
      pullRequests,
      rpc,
    });
  },
});

export const agent = defineAgent({
  name: "ecosystem-monitor",
  entry: "scan",
  steps: { scan, report },
});
