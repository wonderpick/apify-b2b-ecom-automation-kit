# AI Agent & Cline / Cursor One-Step Install Guide (`llms-install.md`)

This file helps AI coding assistants (Cline, Cursor, Windsurf, Claude Desktop, Antigravity) configure **Apify External Business Intelligence MCP Server (v2.1.1)** automatically.

## Recommended: Zero-Install Remote Streamable HTTP Endpoint

No Node.js or Docker installation required. Add this MCP server block to your client's MCP settings:

```json
{
  "mcpServers": {
    "apify-b2b-ecom-mcp": {
      "url": "https://apify-factory-rapidapi-gateway.apify-factory-rapidapi-gateway.workers.dev/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

## Alternative: 1-Line Local Stdio via `npx`

Requires Node.js v20+:

```json
{
  "mcpServers": {
    "apify-b2b-ecom-mcp": {
      "command": "npx",
      "args": ["-y", "github:wonderpick/apify-b2b-ecom-automation-kit"],
      "env": {
        "APIFY_TOKEN": "YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

## How to Obtain `APIFY_TOKEN` (Free Tier Included)

Ask the user for their Apify API token (free account includes $5/month platform credits):
- URL: https://console.apify.com/settings/integrations
- Note: `initialize`, `tools/list`, `prompts/list`, and `prompts/get` work without a token; `APIFY_TOKEN` is only needed when executing `tools/call`.
