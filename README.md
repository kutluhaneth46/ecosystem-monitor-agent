# ecosystem-monitor-agent

Sapiom agent that tracks **open contributor PRs** and **public RPC health** across Arc, Tempo, Miden, and Sapiom — daily markdown report with optional LLM summary.

**Live agent:** https://app.sapiom.ai/agents/748  
**Schedule:** daily 08:00 Europe/Istanbul

## What it monitors

| Ecosystem | PRs tracked | RPC probe |
|-----------|-------------|-----------|
| Arc | arc-commerce #58, arc-node #295/#297/#299 | `rpc.testnet.arc.network` |
| Tempo | tempo #7372, #7373 | `rpc.moderato.tempo.xyz` |
| Miden | guardian-dashboard #49, web-sdk #332/#334/#351/#353 | `rpc.testnet.miden.io` (HTTPS reachability) |
| Sapiom | sapiom-js #748 | — |

Showcase repos are linked in each report (arc-dev-survival-kit, tempo-batch-reconcile, miden-dev-survival-kit, this agent).

## Local development

```bash
npm install
npm run typecheck
```

Authoring loop via Sapiom MCP: `check` → `run_local` → `deploy`. See `AGENTS.md`.

## Deploy

Linked slug: `ecosystem-monitor` (definition **748**). Requires `main` branch and `sapiom.json`.

```bash
# after sapiom_authenticate
# sapiom_dev_agents_deploy
```

## License

MIT
