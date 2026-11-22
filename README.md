# Apify B2B & E-Commerce Intelligence MCP Server (Stdio + Docker)

> **Give your AI assistant eyes on the outside world — without paying a single $200/month SaaS subscription or burning credits on empty, unchanged results.**

Think about the moment every founder, wholesale director, e-commerce operator, and security lead hits with AI today:

You open Claude Desktop or Cursor and ask a real business question:
- *"Which independent boutiques carry our top competitor right now — and what are their wholesale buyer emails?"*
- *"Did any of our 15 Shopify competitors slash prices or sell out of their hero SKU overnight?"*
- *"Did any of our 200 SaaS vendors quietly add OpenAI or Anthropic to their Trust Center subprocessors this week?"*
- *"Which Korean factory makes this viral SPF50+ sunscreen — and do they have any active MFDS recall orders?"*
- *"Find every creator on our shortlist who already runs paid brand deals and grab their talent agency's email."*

And your AI replies: *"I can't check live external business data for you."*

### Why Existing MCP Servers Couldn't Answer These Questions

When we audited the entire MCP ecosystem, we discovered a striking divide:
- **Official storefront, store-locator, link-in-bio, and GRC compliance MCPs only look *inward*** — they let you edit *your own* shop, *your own* store map, *your own* bio page, or *your own* internal compliance account. They **cannot** watch competitors, audit external vendors, scout creators, or find competing brands' retail stockists.
- **Legacy B2B data MCPs lock you into $99–$500/month SaaS contracts**, bill you for stale cached records, and miss live Cloudflare-obfuscated emails.
- **Generic web-scraping MCPs dump raw HTML or bill you for 10,000 unchanged SKUs** every single run — drowning your AI's context window and your budget.

**So we built the external business intelligence MCP server that didn't exist.**

An open-source **Node.js `stdio` Model Context Protocol (MCP) server** implemented in [`src/mcp-server.mjs`](./src/mcp-server.mjs) (with [`Dockerfile`](./Dockerfile) and [`glama.json`](./glama.json)) using `@modelcontextprotocol/sdk` and `StdioServerTransport` — exposing **7 zero-proxy, pay-only-for-real-results tools** that cost **$0 whenever nothing changed or nothing matched**.

> **Zero-Token Discovery:** `initialize` and `tools/list` run cleanly with **no `APIFY_TOKEN` required**, allowing MCP clients and automated Glama / Docker health inspectors to discover all 7 tool schemas out of the box. `APIFY_TOKEN` is only read from the environment when a client invokes `tools/call`.

---

## How This MCP Suite Compares to Existing MCP Categories

| Real Operator Job-to-Be-Done | **This Open-Source MCP Suite** | Typical Official / Platform MCPs | Commercial Data / Scraper MCPs |
|---|---|---|---|
| **Competitor Shopify Price, Stock & MAP Deltas** | **Tracks up to 50 external stores (125K SKUs) · `$0` when unchanged · `CRITICAL`/`INVENTORY`/`CATALOG` severity** | Only manages *your own* storefront | Re-scrapes & bills full catalog every run |
| **Competitor Retail Stockists + Buyer Emails** | **Extracts 250–1,200+ doors + buyer emails + skips national chains at `$0`** | Only edits *your own* store map | Addresses only ($6/1K), no buyer emails |
| **External SaaS Trust Center & AI Subprocessor Audit** | **Audits up to 500 external vendors + `complianceScore` + `missingSoc2Lead` · `$0` unchanged** | Only reads *your own* paid GRC account | $15K–$50K/yr TPRM enterprise contracts |
| **South Korea MFDS Cosmetic Recalls & 219K+ OEM DB** | **Plain English auto-bridge (`sunscreen`, `Cosmax`) + `isActiveRecall` + hidden OEM reveal** | Static INCI dictionaries only (no live Korea MFDS MCP exists) | Unavailable or Korean-only |
| **3-in-1 B2B Company → Domain + LinkedIn + Email** | **Live Cloudflare-decoded emails + `leadQualityScore` + `$0` when no email (`$2.50/1K`)** | Not available | $99–$500/mo subscriptions + stale DBs |
| **Creator Link-in-Bio Agency Email & Deal Readiness** | **15+ bio platforms + 1-hop personal sites + Cloudflare decoding + 0–100 score (`$2.50/1K`)** | Only edits *your own* bio links | Single-platform scrapers with forced proxies |
| **Infrastructure & Monthly Lock-In** | **$0/mo subscription · $0 proxy · 128–256 MB pure HTTP** | Locked to one SaaS account | High monthly minimums + proxy burn |

---

## Exposed MCP Tools (`src/mcp-server.mjs`)

| MCP Tool Name | Key Inputs | What It Returns | Backing Actor |
| :--- | :--- | :--- | :--- |
| **`brand_store_locator_stockist_email_enricher`** | `urls`, `enrichEmails`, `onlyIndependentStores`, `onlyWithEmail`, `countryFilter`, `maxStoresPerBrand` | Physical retail stockists & boutiques carrying competitor brands **plus** prioritized buyer/wholesale emails (with Cloudflare `data-cfemail` decoding), Instagram/LinkedIn, Contact Form URLs, independent-vs-chain tags, and 0–100 Outreach Readiness Score — `$5/1K`, `$0` when filtered/empty | [Brand Store Locator & Stockist Email Scraper](https://apify.com/maitreya_buddha/brand-store-locator-stockist-email-enricher) |
| **`shopify_competitor_delta_monitor`** | `storeUrls`, `stateStoreName`, `minPriceChangePercent`, `eventTypes`, `mapThresholds` | Real catalog & pricing deltas across up to 50 stores × 2,500 products with deterministic `severity` (`CRITICAL`/`INVENTORY`/`CATALOG`), `price_drop`, `price_increase`, `restocked`, `out_of_stock`, `new_product`, `discount_started`, and MAP violations — `$2/1K`, `$0` on baseline or unchanged runs | [Shopify Competitor Delta Monitor](https://apify.com/maitreya_buddha/shopify-competitor-delta-monitor) |
| **`saas_trust_center_soc2_monitor`** | `domains`, `mode` (`audit` / `monitor`), `checkSubprocessors`, `checkDnsIam` | External Trust Center platform (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust), SOC 2 / ISO 27001 / HIPAA certs, `complianceScore` (0–100), `missingSoc2Lead` boolean, DNS IAM/SSO, and 75+ subprocessors including AI vendors — `$5/1K`, `$0` unchanged | [SaaS Trust Center & SOC 2 Monitor](https://apify.com/maitreya_buddha/saas-trust-center-soc2-monitor) |
| **`b2b_company_domain_linkedin_enricher`** | `inputs`, `datasetId`, `enrichContactPages`, `onlyWithEmail`, `minConfidence` | Official domain, verified LinkedIn `/company/` URL, Cloudflare-decoded corporate role emails, WhatsApp links, phones, 6 social profiles, and 0–100 `leadQualityScore` — `$2.50/1K`, `$0` on misses or no-email skips | [B2B Company Domain & LinkedIn Enricher](https://apify.com/maitreya_buddha/b2b-company-domain-linkedin-enricher) |
| **`creator_link_in_bio_email_enricher`** | `urls`, `datasetId`, `enableDeepContactFollow`, `onlyWithEmail`, `minReadinessScore` | Creator talent-agency & business emails (across 15+ bio platforms + 1-hop personal sites with Cloudflare decoding), phones/WhatsApp, 14 normalized social links, monetization classification, promo codes, and 0–100 Brand-Deal Readiness Score — `$2.50/1K`, `$0` on misses | [Creator Link-in-Bio Email Enricher](https://apify.com/maitreya_buddha/creator-link-in-bio-email-enricher) |
| **`korea_mfds_cosmetic_recalls`** | `companyName`, `productName`, `onlyActiveRecalls`, `businessNumber`, `recallOrderDateFrom`, `maxItems` | Official South Korea MFDS (식약처) cosmetic recall & sales suspension records with plain-English auto-bridge (`sunscreen`, `soap`, `Cosmax`), `isActiveRecall` boolean, exact `lotNumber`, and recall reasons — `$3/1K`, `$0` when clean | [Korea MFDS Cosmetic Recalls API](https://apify.com/maitreya_buddha/korea-mfds-cosmetic-recalls) |
| **`korea_mfds_functional_cosmetics_oem`** | `datasetType`, `productName`, `brandOrDistributor`, `oemManufacturer`, `efficacyKeyword`, `resolveOemFromReviewed` | 219,000+ official MFDS functional cosmetics (기능성화장품) filings with plain-English auto-bridge (`sunscreen`, `Cosmax`, `Kolmar`), hidden OEM/ODM factory auto-reveal, SPF/PA ratings, and English claim tags — `$2/1K`, `$0` when empty | [Korea MFDS Functional Cosmetics & OEM API](https://apify.com/maitreya_buddha/korea-mfds-functional-cosmetics-oem) |

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
  - `ListToolsRequestSchema`: Returns static JSON Schema definitions for all 7 tools synchronously without external network calls or authentication.
  - `CallToolRequestSchema`: Validates the requested tool name, checks `process.env.APIFY_TOKEN`, and executes the backing Apify Actor (`run-sync-get-dataset-items?memory=256`) with a 180-second `AbortController` timeout.
- **Zero-Proxy Lean Compute:** All 7 backing Actors default to `256 MB` RAM with pure Node.js HTTP / HTTP/2 / DNS (zero Puppeteer/Playwright and `$0` proxy fees).

---

## Bonus: Ready-to-Import n8n Workflow Templates (`n8n-workflows/`)

This repository also ships 5 multi-branch, production-grade n8n workflows (12–13 functional nodes each, `httpHeaderAuth`) and Node.js / Python scripts for teams automating the same pipelines outside MCP:

1. **[`n8n-workflows/01-shopify-price-stock-alert-slack.json`](./n8n-workflows/01-shopify-price-stock-alert-slack.json)** — Scheduled 6-hour Shopify competitor delta monitor -> severity Switch routing -> Slack `#pricing-alerts` + Gmail + Google Sheets `DeltaHistory`.
2. **[`n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json`](./n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json)** — Weekly vendor Trust Center monitor -> AI subprocessor risk Switch routing -> Slack `#security-alerts` + Gmail + Google Sheets `ComplianceLog`.
3. **[`n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json`](./n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json)** — Google Sheets company batch -> 3-in-1 enrichment -> lead-tier Switch routing (`HOT`/`WARM`/`RESEARCH`) -> Slack + Gmail + Google Sheets `Enriched` / `Unresolved`.
4. **[`n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json`](./n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json)** — Google Sheets creator Link-in-Bio URLs -> business/agency email & Readiness Score tiering -> Slack + Gmail + Google Sheets.
5. **[`n8n-workflows/05-brand-stockist-buyer-email-outreach.json`](./n8n-workflows/05-brand-stockist-buyer-email-outreach.json)** — Competitor brand list -> retail stockists & buyer/wholesale emails (skipping national chains) -> VIP buyer Switch routing -> Slack `#wholesale-leads` + Gmail pitch brief + Google Sheets `StockistLeads`.

### Direct Node.js / Python Examples (`examples/`)
- Node.js (v20+, zero dependencies): `APIFY_TOKEN="..." node examples/node/run-actors.mjs`
- Python: `APIFY_TOKEN="..." python examples/python/run_actors.py`

---

## License

MIT © 2026 BoGeun Kim ([wonderpick](https://github.com/wonderpick) / [maitreya_buddha](https://apify.com/maitreya_buddha))
