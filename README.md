# Apify B2B & E-Commerce MCP Server (Stdio + Docker)

An open-source **Node.js `stdio` Model Context Protocol (MCP) server** implemented in [`src/mcp-server.mjs`](./src/mcp-server.mjs) (with [`Dockerfile`](./Dockerfile) and [`glama.json`](./glama.json)) using `@modelcontextprotocol/sdk` and `StdioServerTransport`.

It exposes **6 structured MCP tools** backed by zero-proxy, `128 MB–256 MB` Apify Actors for **Shopify competitor price & restock monitoring**, **SaaS Trust Center (Vanta / Drata / SafeBase) SOC 2 & AI subprocessor auditing**, **3-in-1 B2B lead enrichment**, **creator Link-in-Bio outreach enrichment**, and **South Korea MFDS K-Beauty regulatory/OEM data**.

> **Zero-Token Discovery:** `initialize` and `tools/list` run cleanly with **no `APIFY_TOKEN` required**, allowing MCP clients and automated Glama / Docker health inspectors to discover all 6 tool schemas out of the box. `APIFY_TOKEN` is only read from the environment when a client invokes `tools/call`.

---

## Exposed MCP Tools (`src/mcp-server.mjs`)

| MCP Tool Name | Key Inputs | What It Returns | Backing Actor |
| :--- | :--- | :--- | :--- |
| **`shopify_competitor_delta_monitor`** | `storeUrls`, `stateStoreName`, `minPriceChangePercent`, `eventTypes`, `mapThresholds` | Real catalog & pricing deltas (`price_drop`, `price_increase`, `restocked`, `out_of_stock`, `new_product`, `discount_started`, MAP violations) — `$0` on baseline or unchanged runs | [Shopify Competitor Delta Monitor](https://apify.com/maitreya_buddha/shopify-competitor-delta-monitor) |
| **`saas_trust_center_soc2_monitor`** | `domains`, `mode` (`audit` / `monitor`), `checkSubprocessors`, `checkDnsIam` | Trust Center platform (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust), SOC 2 / ISO 27001 / HIPAA certs, DNS IAM/SSO, and 75+ subprocessors including AI vendors | [SaaS Trust Center & SOC 2 Monitor](https://apify.com/maitreya_buddha/saas-trust-center-soc2-monitor) |
| **`b2b_company_domain_linkedin_enricher`** | `inputs`, `datasetId`, `enrichContactPages`, `minConfidence` | Official domain, verified LinkedIn company/school URL, prioritized role emails, WhatsApp links, international phones, and 6 social profiles | [B2B Company Domain & LinkedIn Enricher](https://apify.com/maitreya_buddha/b2b-company-domain-linkedin-enricher) |
| **`creator_link_in_bio_email_enricher`** | `urls`, `datasetId`, `enableDeepContactFollow`, `onlyWithEmail`, `minReadinessScore` | Creator business/agency emails, phones/WhatsApp, 14 normalized social links, monetization link classification, discount codes, and 0–100 Brand-Deal Readiness Score | [Creator Link-in-Bio Email Enricher](https://apify.com/maitreya_buddha/creator-link-in-bio-email-enricher) |
| **`korea_mfds_cosmetic_recalls`** | `companyName`, `productName`, `businessNumber`, `recallOrderDateFrom`, `maxItems` | Official South Korea MFDS (식약처) cosmetic recall & administrative violation records | [Korea MFDS Cosmetic Recalls API](https://apify.com/maitreya_buddha/korea-mfds-cosmetic-recalls) |
| **`korea_mfds_functional_cosmetics_oem`** | `datasetType`, `productName`, `brandOrDistributor`, `oemManufacturer`, `efficacyKeyword` | 219,000+ MFDS functional cosmetics (기능성화장품) filings, OEM/ODM manufacturers, SPF/PA ratings, and active ingredients | [Korea MFDS Functional Cosmetics & OEM API](https://apify.com/maitreya_buddha/korea-mfds-functional-cosmetics-oem) |

---

## Installation & Running the Stdio MCP Server

### Option 1: Run Locally with Node.js (v20+)
```bash
git clone https://github.com/wonderpick/apify-b2b-ecom-automation-kit.git
cd apify-b2b-ecom-automation-kit
npm install

# Run the stdio MCP server (get APIFY_TOKEN at https://console.apify.com/settings/integrations)
APIFY_TOKEN="apify_api_your_token" node src/mcp-server.mjs
```

### Option 2: Run via Docker (`Dockerfile`)
```bash
docker build -t apify-b2b-ecom-mcp .
docker run -i --rm -e APIFY_TOKEN="apify_api_your_token" apify-b2b-ecom-mcp
```

### Option 3: Claude Desktop / Cursor Configuration ([`mcp/claude-desktop-config.json`](./mcp/claude-desktop-config.json))
```json
{
  "mcpServers": {
    "apify-b2b-ecom-mcp": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/apify-b2b-ecom-automation-kit/src/mcp-server.mjs"
      ],
      "env": {
        "APIFY_TOKEN": "YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```
Or run containerized via Docker in Claude Desktop / Cursor:
```json
{
  "mcpServers": {
    "apify-b2b-ecom-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "APIFY_TOKEN",
        "apify-b2b-ecom-mcp"
      ],
      "env": {
        "APIFY_TOKEN": "YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

---

## Architecture & Implementation Notes (`src/mcp-server.mjs`)

- **Transport:** `StdioServerTransport` from `@modelcontextprotocol/sdk/server/stdio.js`
- **Handlers:**
  - `ListToolsRequestSchema`: Returns static JSON Schema definitions for all 6 tools synchronously without external network calls or authentication.
  - `CallToolRequestSchema`: Validates the requested tool name, checks `process.env.APIFY_TOKEN`, and executes the backing Apify Actor (`run-sync-get-dataset-items?memory=256`) with a 180-second `AbortController` timeout.
- **Zero-Proxy Lean Compute:** All 6 backing Actors default to `256 MB` RAM with pure Node.js HTTP / HTTP/2 / DNS (zero Puppeteer/Playwright and `$0` proxy fees).

---

## Bonus: Ready-to-Import n8n Workflow Templates (`n8n-workflows/`)

This repository also ships 4 ready-to-import n8n workflows and Node.js / Python scripts for teams automating the same pipelines outside MCP:

1. **[`n8n-workflows/01-shopify-price-stock-alert-slack.json`](./n8n-workflows/01-shopify-price-stock-alert-slack.json)** — Scheduled 6-hour Shopify competitor delta monitor -> Slack alerts on real price drops, restocks, stockouts & MAP violations.
2. **[`n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json`](./n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json)** — Daily 9 AM vendor Trust Center monitor -> Slack alerts on SOC 2 regressions or newly added AI subprocessors.
3. **[`n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json`](./n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json)** — Google Sheets raw company batch -> 3-in-1 enrichment -> enriched domain, LinkedIn, email & WhatsApp back to Google Sheets.
4. **[`n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json`](./n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json)** — Google Sheets creator Link-in-Bio URLs -> business/agency email, discount codes & Brand-Deal Readiness Score enrichment back to Google Sheets.

### Direct Node.js / Python Examples (`examples/`)
- Node.js (v20+, zero dependencies): `APIFY_TOKEN="..." node examples/node/run-actors.mjs`
- Python: `APIFY_TOKEN="..." python examples/python/run_actors.py`

---

## License

MIT © 2026 BoGeun Kim ([wonderpick](https://github.com/wonderpick) / [maitreya_buddha](https://apify.com/maitreya_buddha))
