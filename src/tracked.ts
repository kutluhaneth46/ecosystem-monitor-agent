export type TrackedPr = {
  ecosystem: "arc" | "tempo" | "miden" | "sapiom";
  owner: string;
  repo: string;
  number: number;
  label: string;
};

export type RpcEndpoint = {
  ecosystem: "arc" | "tempo" | "miden" | "sapiom";
  name: string;
  url: string;
  expectedChainId?: string;
  /** jsonrpc = eth_chainId probe; https = reachability only (e.g. gRPC hosts). */
  kind?: "jsonrpc" | "https";
};

/** Contributor PRs + showcase issues we actively track. */
export const TRACKED_PRS: TrackedPr[] = [
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 308, label: "RPC gascap vs protocol limits" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 307, label: "Remove snapshot URL FIXME" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 306, label: "Operator docs version + blockNumber" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-commerce", number: 59, label: "Admin credentials from env" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-commerce", number: 58, label: "Pin latest deps" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 295, label: "RPC deprecation docs" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 297, label: "JSON-RPC breaking changes" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 299, label: "Public testnet RPC guide" },
  { ecosystem: "tempo", owner: "tempoxyz", repo: "tempo", number: 7372, label: "Faucet empty address" },
  { ecosystem: "tempo", owner: "tempoxyz", repo: "tempo", number: 7373, label: "Signing key 0600" },
  { ecosystem: "miden", owner: "0xMiden", repo: "guardian-dashboard", number: 49, label: "BigInt amount precision" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 332, label: "waitForBlock syncState" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 334, label: "Keystore callback bridge" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 351, label: "Note status fingerprint" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 355, label: "Idxdb downgrade store reset" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 356, label: "Vite plugin CI lint" },
  { ecosystem: "miden", owner: "0xMiden", repo: "web-sdk", number: 353, label: "sendPrivateNote block hint" },
  { ecosystem: "sapiom", owner: "sapiom", repo: "sapiom-js", number: 748, label: "Nullable JSON Schema unions" },
];

export const RPC_ENDPOINTS: RpcEndpoint[] = [
  {
    ecosystem: "arc",
    name: "Arc Testnet",
    url: "https://rpc.testnet.arc.network",
    expectedChainId: "0x4cef52",
  },
  {
    ecosystem: "tempo",
    name: "Tempo Moderato",
    url: "https://rpc.moderato.tempo.xyz",
    expectedChainId: "0xa5bf", // 42431
  },
  {
    ecosystem: "miden",
    name: "Miden Testnet RPC",
    url: "https://rpc.testnet.miden.io",
    kind: "https",
  },
];

export const SHOWCASE_LINKS = [
  {
    ecosystem: "arc" as const,
    title: "arc-node showcase",
    url: "https://github.com/circlefin/arc-node/issues/305",
  },
  {
    ecosystem: "arc" as const,
    title: "Arc Developer Survival Kit",
    url: "https://github.com/kutluhaneth46/arc-dev-survival-kit",
  },
  {
    ecosystem: "sapiom" as const,
    title: "Ecosystem Monitor (live)",
    url: "https://app.sapiom.ai/agents/748",
  },
  {
    ecosystem: "tempo" as const,
    title: "Tempo Batch Reconcile CLI",
    url: "https://github.com/kutluhaneth46/tempo-batch-reconcile",
  },
  {
    ecosystem: "tempo" as const,
    title: "tempo-support showcase",
    url: "https://github.com/tempoxyz/tempo-support/issues/28",
  },
  {
    ecosystem: "miden" as const,
    title: "Miden Web SDK Survival Kit",
    url: "https://github.com/kutluhaneth46/miden-dev-survival-kit",
  },
  {
    ecosystem: "miden" as const,
    title: "web-sdk showcase",
    url: "https://github.com/0xMiden/web-sdk/issues/354",
  },
  {
    ecosystem: "sapiom" as const,
    title: "Ecosystem Monitor agent",
    url: "https://github.com/kutluhaneth46/ecosystem-monitor-agent",
  },
];
