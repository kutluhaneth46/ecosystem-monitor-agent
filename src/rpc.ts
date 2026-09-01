export type RpcHealth = {
  ecosystem: string;
  name: string;
  url: string;
  ok: boolean;
  chainId?: string;
  blockNumber?: string;
  latencyMs: number;
  error?: string;
};

export async function checkRpcHealth(
  endpoint: {
    ecosystem: string;
    name: string;
    url: string;
    expectedChainId?: string;
    kind?: "jsonrpc" | "https";
  },
): Promise<RpcHealth> {
  if (endpoint.kind === "https") {
    return checkHttpsReachable(endpoint);
  }
  return checkJsonRpc(endpoint);
}

async function checkHttpsReachable(endpoint: {
  ecosystem: string;
  name: string;
  url: string;
}): Promise<RpcHealth> {
  const started = Date.now();
  try {
    const res = await fetch(endpoint.url, { method: "HEAD" });
    const ok = res.status < 500;
    return {
      ecosystem: endpoint.ecosystem,
      name: endpoint.name,
      url: endpoint.url,
      ok,
      latencyMs: Date.now() - started,
      error: ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (error) {
    return {
      ecosystem: endpoint.ecosystem,
      name: endpoint.name,
      url: endpoint.url,
      ok: false,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "https probe failed",
    };
  }
}

async function checkJsonRpc(endpoint: {
  ecosystem: string;
  name: string;
  url: string;
  expectedChainId?: string;
}): Promise<RpcHealth> {
  const started = Date.now();
  try {
    const res = await fetch(endpoint.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_chainId",
        params: [],
      }),
    });
    if (!res.ok) {
      return {
        ecosystem: endpoint.ecosystem,
        name: endpoint.name,
        url: endpoint.url,
        ok: false,
        latencyMs: Date.now() - started,
        error: `HTTP ${res.status}`,
      };
    }

    const body = (await res.json()) as {
      result?: string;
      error?: { message: string };
    };
    if (body.error) {
      return {
        ecosystem: endpoint.ecosystem,
        name: endpoint.name,
        url: endpoint.url,
        ok: false,
        latencyMs: Date.now() - started,
        error: body.error.message,
      };
    }

    const chainId = body.result;
    const chainOk =
      !endpoint.expectedChainId ||
      chainId?.toLowerCase() === endpoint.expectedChainId.toLowerCase();

    let blockNumber: string | undefined;
    if (chainOk) {
      const blockRes = await fetch(endpoint.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "eth_blockNumber",
          params: [],
        }),
      });
      const blockBody = (await blockRes.json()) as { result?: string };
      blockNumber = blockBody.result;
    }

    return {
      ecosystem: endpoint.ecosystem,
      name: endpoint.name,
      url: endpoint.url,
      ok: chainOk,
      chainId,
      blockNumber,
      latencyMs: Date.now() - started,
      error: chainOk ? undefined : `expected ${endpoint.expectedChainId}, got ${chainId}`,
    };
  } catch (error) {
    return {
      ecosystem: endpoint.ecosystem,
      name: endpoint.name,
      url: endpoint.url,
      ok: false,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "rpc failed",
    };
  }
}
