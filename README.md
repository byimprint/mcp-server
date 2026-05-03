# @byimprint/mcp-server

Open-source MCP client for [byImprint](https://byimprint.com) creator-audience intelligence.

The actual MCP server, scoring methodology, and creator data live behind authentication at `https://byimprint.com/mcp`. This package is the open-source plumbing: the tool descriptors, a thin TypeScript client, and a small CLI for setup. Modeled on Plaid Link.

## Install (Claude Code)

```bash
claude mcp add imprint-intelligence https://byimprint.com/mcp
```

That is the entire setup. Free tier requires no API key, no credit card. Get a paid-tier key at [byimprint.com/agents](https://byimprint.com/agents).

## Install (ChatGPT, Cursor, custom OpenAI agents)

Add `https://byimprint.com/mcp` as a Custom Connector in ChatGPT, or point your agent runtime at the OpenAPI spec:

```
https://byimprint.com/.well-known/openapi.json
```

Discovery descriptor for MCP clients that prefer auto-config:

```
https://byimprint.com/.well-known/mcp.json
```

## Tools

Seven composable tools for iterating across creators and niches inside an agent loop.

| Tool | Purpose | Tier |
| --- | --- | --- |
| `imprint-search` | Keyword search across creators and niches. | Free |
| `imprint-niche` | Niche landscape: creators, score distribution, common risks. Free returns 42 public niches; paid returns all 180. | Free / Paid |
| `imprint-profile` | Per-creator deep-dive. Free returns the card view; paid returns full sections. | Free / Paid |
| `imprint-filter` | Structured filter across creators by score, niche, partnerships, etc. | Indie |
| `imprint-grep` | Regex match across creator analyses. | Indie |
| `imprint-map` | Question-across-set with optional Claude synthesis. Synthesis is Agency or pay-per-call. | Indie |
| `imprint-rank-creators-for-brand` | Rank creators against a brand brief with evidence and exclusions. | Agency (5/mo) or pay-per-call |

## Pricing

| Tier | Monthly | Calls | Notes |
| --- | --- | --- | --- |
| Free | $0 | 100 / day | Public niches and creator search. No card. |
| Indie | $49 | 5,000 / mo | All read tools. |
| Agency | $499 | 50,000 / mo | + 5 brand-creator ranks included, $99/call after. |
| Pay-per-call | usage | usage | $99/rank, $5/map-synthesize. |

## Programmatic use

```ts
import { imprintFetch, IMPRINT_TOOLS } from "@byimprint/mcp-server";

const tools = await imprintFetch("tools/list", {});
console.log(tools);

const search = await imprintFetch(
  "tools/call",
  { name: "imprint-search", arguments: { query: "quilting fabric" } },
  { apiKey: process.env.IMPRINT_API_KEY },
);
console.log(search);
```

For agent runtimes, prefer a real MCP client (`@modelcontextprotocol/sdk`) and point it at `https://byimprint.com/mcp` with your bearer token in `Authorization`.

## CLI

```bash
npx @byimprint/mcp-server install
npx @byimprint/mcp-server tools
npx @byimprint/mcp-server discover
IMPRINT_API_KEY=imp_... npx @byimprint/mcp-server ping
```

## Methodology

Every score traces back to YouTube Data API metrics, comment evidence, and the published six-axis framework: Voice, Audience, Product, Partnership, Risk, Reach. Read the full methodology at [byimprint.com/methodology](https://byimprint.com/methodology).

## License

MIT. See [LICENSE](LICENSE).
