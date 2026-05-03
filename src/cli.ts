#!/usr/bin/env node
/**
 * imprint-mcp CLI
 *
 * Helper utilities for working with byImprint's hosted MCP server. The actual
 * MCP transport runs at https://byimprint.com/mcp; this CLI exists to print
 * setup hints, fetch the discovery descriptor, and verify a key works.
 */

import {
  IMPRINT_DISCOVERY_URL,
  IMPRINT_DOCS_URL,
  IMPRINT_MCP_URL,
  IMPRINT_OPENAPI_URL,
  IMPRINT_TOOLS,
  imprintFetch,
} from "./index.js";

const HELP = `imprint-mcp <command>

Commands:
  install        Print the one-line install command for Claude Code.
  discover       Fetch and print https://byimprint.com/.well-known/mcp.json.
  tools          List the seven MCP tools and their tier requirements.
  ping           POST tools/list to https://byimprint.com/mcp and print the
                 tool count. Pass an API key via IMPRINT_API_KEY env to test
                 paid-tier reachability.
  docs           Open https://byimprint.com/agents in stdout (no browser).
  help           Show this message.

Environment:
  IMPRINT_API_KEY    Bearer token issued from ${IMPRINT_DOCS_URL}.
  IMPRINT_MCP_URL    Override the MCP endpoint (default ${IMPRINT_MCP_URL}).
`;

async function main() {
  const cmd = process.argv[2] ?? "help";
  switch (cmd) {
    case "install":
      console.log("claude mcp add imprint-intelligence " + IMPRINT_MCP_URL);
      break;
    case "discover": {
      const res = await fetch(IMPRINT_DISCOVERY_URL);
      const body = await res.text();
      console.log(body);
      break;
    }
    case "tools":
      for (const t of IMPRINT_TOOLS) {
        console.log(`${t.name}\t[${t.tier}]\t${t.description}`);
      }
      break;
    case "ping": {
      const result = (await imprintFetch("tools/list", {}, {
        apiKey: process.env.IMPRINT_API_KEY,
      })) as { result?: { tools?: unknown[] } };
      const count = result.result?.tools?.length ?? 0;
      console.log(`OK: ${count} tools reachable at ${IMPRINT_MCP_URL}`);
      break;
    }
    case "docs":
      console.log(IMPRINT_DOCS_URL);
      console.log(`OpenAPI: ${IMPRINT_OPENAPI_URL}`);
      break;
    case "help":
    case "--help":
    case "-h":
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.error(HELP);
      process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
