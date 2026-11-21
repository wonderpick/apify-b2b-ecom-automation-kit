# Apify B2B & E-Commerce Automation Kit (n8n Workflows + MCP + Node/Python)

Ready-to-import **n8n workflow templates**, **Claude Desktop / Cursor MCP configuration**, and **Node.js / Python scripts** powered by ultra-lightweight, **zero-proxy, 128 MB RAM** Apify Actors with transparent **Pay-Per-Event (PPE)** billing (`$0` on unchanged baselines, misses, or errors).

---

## Included Apify Actors

| # | Actor | What It Does | Footprint | Pricing (PPE) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **[Shopify Competitor Price, Stock & New Product Monitor](https://apify.com/maitreya_buddha/shopify-competitor-delta-monitor)** | Tracks Shopify competitor stores with persistent KV snapshots and emits **only real deltas** (`price_drop`, `price_increase`, `restocked`, `out_of_stock`, `new_product`, `discount_started`, MAP violations) + Slack/Discord/n8n webhooks. | 128 MB RAM · `$0` proxy · No browser | **`$2.00 / 1K` deltas** (`$0` on baseline & unchanged runs) |
| **2** | **[SaaS Trust Center, SOC 2 & AI Subprocessor Monitor](https://apify.com/maitreya_buddha/saas-trust-center-soc2-monitor)** | Audits & monitors Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe & OneTrust Trust Centers for SOC 2, ISO 27001, HIPAA, DNS IAM/SSO, and **75+ subprocessors including AI vendors** (OpenAI, Anthropic, Bedrock, Vertex AI). | 128 MB RAM · `$0` proxy · No browser | **`$5.00 / 1K` audits or changes** (`$0` when unchanged) |
| **3** | **[B2B Company to Domain, LinkedIn, Email & WhatsApp API](https://apify.com/maitreya_buddha/b2b-company-domain-linkedin-enricher)** | 3-in-1 lead resolver: turns company names, domains, work emails, or upstream Apify `datasetId` into official website, verified LinkedIn company URL, prioritized role emails, WhatsApp, phones, and 6 social links. | 128 MB RAM · `$0` proxy · No browser | **`$2.50 / 1K` enriched** (`$0` for misses/parked domains) |
| **4** | **[Korea MFDS Cosmetic Recalls & Safety Alerts API](https://apify.com/maitreya_buddha/korea-mfds-cosmetic-recalls)** | Official South Korea MFDS (식약처) cosmetic recall notices, administrative violations, product names, manufacturers, and recall reasons in clean JSON/CSV. | 128 MB RAM · `$0` proxy · Pure API | **`$3.00 / 1K` records** |
| **5** | **[Korea MFDS Functional Cosmetics & OEM Ingredient API](https://apify.com/maitreya_buddha/korea-mfds-functional-cosmetics-oem)** | Official South Korea MFDS functional cosmetics (기능성화장품) approvals, OEM/ODM manufacturers, SPF/PA ratings, efficacy claims, and active ingredients. | 128 MB RAM · `$0` proxy · Pure API | **`$2.00 / 1K` records** |

### Why Zero-Proxy 128 MB RAM Actors Matter
- **Zero residential proxy bills**: Pure Node.js HTTP + DNS + structured HTML/JSON parsing instead of bloated Playwright/Puppeteer containers.
- **No wasted compute**: All Actors run smoothly at `128 MB–256 MB` RAM.
- **Zero-waste billing**: You never pay for baseline snapshots, unchanged checks, 404 misses, parked domains, or blocked inputs.

---

## 1-Click n8n Workflow Templates (`n8n-workflows/`)

All JSON templates in [`n8n-workflows/`](./n8n-workflows) follow the standard n8n schema and include embedded Sticky Note setup instructions:

1. **[`01-shopify-price-stock-alert-slack.json`](./n8n-workflows/01-shopify-price-stock-alert-slack.json)** — Scheduled 6-hour Shopify competitor monitor -> filters out zero-cost baseline summaries -> sends rich Slack alerts on price drops, restocks, stockouts, new launches, and MAP violations.
2. **[`02-saas-soc2-ai-subprocessor-alert-slack.json`](./n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json)** — Daily 9 AM vendor Trust Center monitor (`mode: "monitor"`) -> detects newly added AI subprocessors or SOC 2 / ISO 27001 regressions -> posts alerts to `#security-alerts`.
3. **[`03-b2b-company-linkedin-email-enricher-sheets.json`](./n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json)** — Reads raw company names/domains from Google Sheets -> enriches in one batched API call -> appends official domain, LinkedIn URL, role email, WhatsApp, and phone back into Google Sheets.

### How to Import into n8n
1. Open your n8n workspace and create a new workflow.
2. Click the top-right `...` menu -> **Import from File** (or copy/paste any JSON from `n8n-workflows/`).
3. Replace `YOUR_APIFY_API_TOKEN` in the HTTP Request node's `Authorization` header with your [Apify API token](https://console.apify.com/settings/integrations).
4. Connect your Slack or Google Sheets credentials and click **Test workflow**.

---

## Connect to Claude Desktop, Cursor & AI Agents via MCP

Use the hosted **Apify MCP Server** to give Claude Desktop, Cursor, Windsurf, or any MCP-compatible AI agent direct access to all 5 Actors in a single config block (see [`mcp/claude-desktop-config.json`](./mcp/claude-desktop-config.json)):

```json
{
  "mcpServers": {
    "apify-b2b-ecom-kit": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.apify.com?tools=maitreya_buddha/shopify-competitor-delta-monitor,maitreya_buddha/saas-trust-center-soc2-monitor,maitreya_buddha/b2b-company-domain-linkedin-enricher,maitreya_buddha/korea-mfds-cosmetic-recalls,maitreya_buddha/korea-mfds-functional-cosmetics-oem",
        "--header",
        "Authorization: Bearer ${APIFY_TOKEN}"
      ],
      "env": {
        "APIFY_TOKEN": "YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

**Hosted Remote MCP URL:**
```text
https://mcp.apify.com?tools=maitreya_buddha/shopify-competitor-delta-monitor,maitreya_buddha/saas-trust-center-soc2-monitor,maitreya_buddha/b2b-company-domain-linkedin-enricher
```

---

## Quick Code Examples (`examples/`)

### Node.js (v20+, zero dependencies)
```bash
export APIFY_TOKEN="apify_api_your_token"
node examples/node/run-actors.mjs
```

### Python
```bash
pip install requests
export APIFY_TOKEN="apify_api_your_token"
python examples/python/run_actors.py
```

---

## License

MIT © 2026 [maitreya_buddha](https://apify.com/maitreya_buddha)
