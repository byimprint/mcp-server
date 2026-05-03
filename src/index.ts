/**
 * @imprint/mcp-server
 *
 * Thin client harness for byImprint's hosted MCP server. The actual data,
 * scoring methodology, and tool implementations live behind authentication
 * at https://byimprint.com/mcp. This package gives agent runtimes a typed,
 * one-line install path to that endpoint.
 *
 * Modeled on Plaid Link: open-source plumbing, gated data.
 */

export const IMPRINT_MCP_URL = "https://byimprint.com/mcp";
export const IMPRINT_DISCOVERY_URL = "https://byimprint.com/.well-known/mcp.json";
export const IMPRINT_OPENAPI_URL = "https://byimprint.com/.well-known/openapi.json";
export const IMPRINT_DOCS_URL = "https://byimprint.com/agents";

export type ImprintTier = "free" | "indie" | "agency" | "pay_per_call";

export interface ImprintMcpClientOptions {
  /**
   * Bearer token issued from https://byimprint.com/agents. Format: imp_<32-hex>.
   * If omitted, calls run on the free tier (rate-limited, public niches only).
   */
  apiKey?: string;
  /**
   * Override the MCP endpoint. Defaults to the hosted byimprint.com endpoint.
   * Useful for self-hosted forks or staging deployments.
   */
  url?: string;
}

/**
 * Build the headers for a Streamable-HTTP MCP request to Imprint. Hand
 * these to your MCP client of choice (Claude Code, ChatGPT Custom
 * Connector, OpenAI Function Calling, Cursor, custom Anthropic SDK code).
 */
export function createImprintHeaders(
  opts: ImprintMcpClientOptions = {},
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (opts.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`;
  return headers;
}

export interface ImprintToolDescriptor {
  name: string;
  description: string;
  tier: "free" | "indie" | "agency" | "pay_per_call";
}

/**
 * Static descriptor of the seven tools exposed by the Imprint MCP server.
 * Live tool schemas come from the server's `tools/list` JSON-RPC method.
 */
export const IMPRINT_TOOLS: readonly ImprintToolDescriptor[] = [
  {
    name: "imprint-search",
    description: "Keyword search across creators and niches.",
    tier: "free",
  },
  {
    name: "imprint-niche",
    description:
      "Niche landscape: creators, score distribution, common risks. Free tier returns the 42 public niches; paid tiers return all 180.",
    tier: "free",
  },
  {
    name: "imprint-profile",
    description:
      "Per-creator deep-dive. Free tier returns the card view; paid tiers return full sections (purchase context, risk, audience, partnerships).",
    tier: "free",
  },
  {
    name: "imprint-filter",
    description: "Structured filter across creators by score, niche, partnerships, etc.",
    tier: "indie",
  },
  {
    name: "imprint-grep",
    description: "Regex match across creator analyses.",
    tier: "indie",
  },
  {
    name: "imprint-map",
    description:
      "Question-across-set, with optional Claude synthesis. Synthesis is Agency-tier or pay-per-call.",
    tier: "indie",
  },
  {
    name: "imprint-rank-creators-for-brand",
    description:
      "Rank creators against a brand brief with evidence, confidence, and exclusion reasoning. Agency-tier (5/mo included) or pay-per-call ($99).",
    tier: "agency",
  },
] as const;

/**
 * Convenience helper to issue a JSON-RPC request to the Imprint MCP. Returns
 * the parsed response body. Throws on non-2xx HTTP. Designed for direct
 * use from scripts or simple agents; production agents should use a real
 * MCP client (e.g. @modelcontextprotocol/sdk).
 */
export async function imprintFetch(
  method: string,
  params: unknown,
  opts: ImprintMcpClientOptions = {},
): Promise<unknown> {
  const url = opts.url ?? IMPRINT_MCP_URL;
  const res = await fetch(url, {
    method: "POST",
    headers: createImprintHeaders(opts),
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) {
    throw new Error(
      `Imprint MCP request failed: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}
