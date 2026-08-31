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
};

/** Contributor PRs + showcase issues we actively track. */
export const TRACKED_PRS: TrackedPr[] = [
  { ecosystem: "arc", owner: "circlefin", repo: "arc-commerce", number: 58, label: "Pin latest deps" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 295, label: "RPC deprecation docs" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 297, label: "JSON-RPC breaking changes" },
  { ecosystem: "arc", owner: "circlefin", repo: "arc-node", number: 299, label: "Public testnet RPC guide" },
  { ecosystem: "tempo", owner: "tempoxyz", repo: "tempo", number: 7372, label: "Faucet empty address" },
  { ecosystem: "tempo", owner: "tempoxyz", repo: "tempo", number: 7373, label: "Signing key 0600" },
  { ecosystem: "miden", owner: "0xMiden", repo: "guardian-dashboard", number: 49, label: "Guardian dashboard fix" },
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
];

export const SHOWCASE_LINKS = [
  {
    ecosystem: "arc" as const,
    title: "Arc Developer Survival Kit",
    url: "https://github.com/kutluhaneth46/arc-dev-survival-kit",
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
];
