# Apify External Business Intelligence MCP Server (Remote HTTP + Stdio + Docker)

> **Give your AI assistant eyes on the outside world — with zero monthly SaaS subscriptions, zero-install Remote MCP URL or 1-line `npx` setup, 5 one-click workflow Prompts, and `$0` billing whenever nothing changed or nothing matched.**

Think about the moment every founder, wholesale director, e-commerce operator, and security lead hits with AI today:

You open Claude, Cursor, or Windsurf and ask a real business question:
- *"Which independent boutiques carry our top competitor right now — and what are their wholesale buyer emails?"*
- *"Did any of our 15 Shopify competitors slash prices or sell out of their hero SKU overnight?"*
- *"Did any of our 200 SaaS vendors quietly add OpenAI or Anthropic to their Trust Center subprocessors this week?"*
- *"Which Korean factory makes this viral SPF50+ sunscreen — and do they have any active MFDS recall orders?"*
- *"Find every creator on our shortlist who already runs paid brand deals and grab their talent agency's email."*

And your AI replies: *"I can't check live external business data for you."*

### Why Existing MCP Servers Couldn't Answer These Questions

When we audited the MCP ecosystem, we discovered a striking divide:
- **Official storefront, store-locator, link-in-bio, and GRC compliance MCPs only look *inward*** — they let you edit *your own* shop, *your own* store map, *your own* bio page, or *your own* internal compliance account. They **cannot** watch competitors, audit external vendors, scout creators, or extract competing brands' retail stockists.
- **Legacy B2B data MCPs lock you into $99–$500/month SaaS contracts**, bill you for stale cached records, and miss live Cloudflare-obfuscated emails.
- **Generic web-scraping MCPs dump raw HTML or bill you for 10,000 unchanged SKUs** every single run — drowning your AI's context window and your budget.

**So we built the external business intelligence MCP server that didn't exist.**

An open-source **Node.js `stdio` Model Context Protocol (MCP) server** implemented in [`src/mcp-server.mjs`](./src/mcp-server.mjs) (with [`src/mcp-catalog.mjs`](./src/mcp-catalog.mjs), [`Dockerfile`](./Dockerfile), [`glama.json`](./glama.json), and [`server.json`](./server.json)) using `@modelcontextprotocol/sdk` and `StdioServerTransport` — **plus a free, zero-install Remote Streamable HTTP endpoint (`/mcp`)** on Cloudflare Workers. It exposes **7 structured, zero-proxy tools (`outputSchema` + `structuredContent` + full MCP `annotations`)** and **5 ready-to-run workflow Prompts** that cost **$0 whenever nothing changed or nothing matched**.

> **Zero-Token Discovery:** `initialize`, `tools/list`, `prompts/list`, and `prompts/get` work cleanly with **no `APIFY_TOKEN` required**, allowing MCP clients and automated Glama / registry inspectors to discover all 7 tool schemas and 5 workflow prompts out of the box. `APIFY_TOKEN` is only required when invoking `tools/call`.

---

## How This MCP Suite Compares to Existing MCP Categories

| Real Operator Job-to-Be-Done | **This Open-Source MCP Suite (v2.0)** | Typical Official / Platform MCPs | Commercial Data / Scraper MCPs |
|---|---|---|---|
| **Competitor Retail Stockists + Buyer Emails** | **Extracts 250–1,200+ doors + buyer emails + skips national chains at `$0`** | Only edits *your own* store map | Addresses only ($6/1K), no buyer emails |
| **Competitor Shopify Price, Stock & MAP Deltas** | **Tracks up to 50 external stores (125K SKUs) · `$0` when unchanged · `CRITICAL`/`INVENTORY`/`CATALOG` severity** | Only manages *your own* storefront | Re-scrapes & bills full catalog every run |
| **External SaaS Trust Center & AI Subprocessor Audit** | **Audits up to 500 external vendors + `complianceScore` + `missingSoc2Lead` · `$0` unchanged** | Only reads *your own* paid GRC account | $15K–$50K/yr TPRM enterprise contracts |
| **South Korea MFDS Cosmetic Recalls & 219K+ OEM DB** | **Plain English auto-bridge (`sunscreen`, `Cosmax`) + `isActiveRecall` + hidden OEM reveal** | Static INCI dictionaries only (no live Korea MFDS MCP exists) | Unavailable or Korean-only |
| **3-in-1 B2B Company → Domain + LinkedIn + Email** | **Live Cloudflare-decoded emails + `leadQualityScore` + `$0` when no email (`$2.50/1K`)** | Not available | $99–$500/mo subscriptions + stale DBs |
| **Creator Link-in-Bio Agency Email & Deal Readiness** | **15+ bio platforms + 1-hop personal sites + Cloudflare decoding + 0–100 score (`$2.50/1K`)** | Only edits *your own* bio links | Single-platform scrapers with forced proxies |
| **Setup Friction & Protocol Quality** | **Zero-install Remote HTTP `/mcp` + 1-line `npx` + Docker `stdio` + 5 built-in Prompts + `outputSchema`** | Locked to one SaaS workspace | Manual setup + high monthly minimums |

---

## Quick Connect (Choose Zero-Install Remote, 1-Line `npx`, or Docker `stdio`)

> Get your free Apify API token (includes $5 free monthly platform credits) at **https://console.apify.com/settings/integrations**.

### Option 1: Zero-Install Remote MCP URL (Streamable HTTP — No Node or Docker Needed)
Paste this URL into **Claude Web, Cursor, Windsurf, or any Streamable HTTP MCP client**:

- **Remote MCP Endpoint:** `https://apify-factory-rapidapi-gateway.apify-factory-rapidapi-gateway.workers.dev/mcp`
- **Auth Header (for `tools/call`):** `Authorization: Bearer YOUR_APIFY_API_TOKEN` (or `X-Apify-Token: YOUR_APIFY_API_TOKEN`)

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

### Option 2: 1-Line Local `npx` Stdio MCP ([`mcp/claude-desktop-config.json`](./mcp/claude-desktop-config.json))
No `git clone` required — runs directly over `stdio`:
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

### Option 3: Run Locally via Node.js (`src/mcp-server.mjs`) or Docker (`Dockerfile`)
```bash
# Local Node.js (v20+) stdio transport
git clone https://github.com/wonderpick/apify-b2b-ecom-automation-kit.git
cd apify-b2b-ecom-automation-kit
npm install
APIFY_TOKEN="apify_api_your_token" node src/mcp-server.mjs

# Or containerized via Docker stdio transport
docker build -t apify-b2b-ecom-mcp .
docker run -i --rm -e APIFY_TOKEN="apify_api_your_token" apify-b2b-ecom-mcp
```

---

## Exposed MCP Tools (`src/mcp-server.mjs` & Remote `/mcp`)

All 7 tools follow strict `verb_noun` naming, return typed `structuredContent` matching concise `outputSchema` definitions, and declare MCP safety `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`). *(Legacy v1.x tool names remain transparently supported as silent internal aliases.)*

| MCP Tool Name | Key Inputs | Structured Output & Pricing | Backing Actor |
| :--- | :--- | :--- | :--- |
| **`extract_brand_store_stockists`** | `urls`, `enrichEmails`, `onlyIndependentStores`, `onlyWithEmail`, `countryFilter`, `maxStoresPerBrand` | Physical retail stockists & independent boutiques carrying competitor brands + buyer/wholesale emails (Cloudflare decoded), Instagram/LinkedIn, `retailerType`, and 0–100 `outreachReadinessScore` — `$5/1K`, `$0` when filtered/empty | [Brand Store Locator & Stockist Email Scraper](https://apify.com/maitreya_buddha/brand-store-locator-stockist-email-enricher) |
| **`monitor_shopify_competitor_deltas`** | `storeUrls`, `stateStoreName`, `minPriceChangePercent`, `eventTypes`, `mapThresholds` | Real catalog & pricing deltas across up to 50 stores × 2,500 products with deterministic `severity` (`CRITICAL`/`INVENTORY`/`CATALOG`), `price_drop`, `price_increase`, `restocked`, `out_of_stock`, `new_product`, and `mapViolation` — `$2/1K`, `$0` on baseline or unchanged runs | [Shopify Competitor Delta Monitor](https://apify.com/maitreya_buddha/shopify-competitor-delta-monitor) |
| **`audit_saas_trust_center`** | `domains`, `mode` (`audit` / `monitor`), `checkSubprocessors`, `checkDnsIam` | External Trust Center platform (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust), SOC 2 / ISO 27001 / HIPAA certs, `complianceScore` (0–100), `missingSoc2Lead`, DNS IAM/SSO, and 75+ third-party & AI subprocessors — `$5/1K`, `$0` unchanged | [SaaS Trust Center & SOC 2 Monitor](https://apify.com/maitreya_buddha/saas-trust-center-soc2-monitor) |
| **`enrich_b2b_company_leads`** | `inputs`, `datasetId`, `enrichContactPages`, `onlyWithEmail`, `minConfidence` | Official domain, verified LinkedIn `/company/` URL, Cloudflare-decoded corporate role emails, WhatsApp links, phones, 6 social profiles, and 0–100 `leadQualityScore` — `$2.50/1K`, `$0` on misses or no-email skips | [B2B Company Domain & LinkedIn Enricher](https://apify.com/maitreya_buddha/b2b-company-domain-linkedin-enricher) |
| **`enrich_creator_bio_leads`** | `urls`, `datasetId`, `enableDeepContactFollow`, `onlyWithEmail`, `minReadinessScore` | Creator talent-agency & business emails (across 15+ bio platforms + 1-hop personal sites with Cloudflare decoding), phones/WhatsApp, 14 social links, monetization signals, promo codes, and 0–100 Readiness Score — `$2.50/1K`, `$0` on misses | [Creator Link-in-Bio Email Enricher](https://apify.com/maitreya_buddha/creator-link-in-bio-email-enricher) |
| **`search_korea_mfds_recalls`** | `companyName`, `productName`, `onlyActiveRecalls`, `businessNumber`, `recallOrderDateFrom`, `maxItems` | Official South Korea MFDS (식약처) cosmetic recall & sales suspension records with plain-English auto-bridge (`sunscreen`, `soap`, `Cosmax`), `isActiveRecall` boolean, `lotNumber`, and recall reasons — `$3/1K`, `$0` when clean | [Korea MFDS Cosmetic Recalls API](https://apify.com/maitreya_buddha/korea-mfds-cosmetic-recalls) |
| **`search_korea_mfds_oem_filings`** | `datasetType`, `productName`, `brandOrDistributor`, `oemManufacturer`, `efficacyKeyword`, `resolveOemFromReviewed` | 219,000+ official MFDS functional cosmetics (기능성화장품) filings with plain-English auto-bridge (`sunscreen`, `retinol cream`, `Cosmax`, `Kolmar`), hidden OEM/ODM factory auto-reveal, SPF/PA ratings, and English `functionalClaims` — `$2/1K`, `$0` when empty | [Korea MFDS Functional Cosmetics & OEM API](https://apify.com/maitreya_buddha/korea-mfds-functional-cosmetics-oem) |

---

## Built-In One-Click MCP Prompts (`prompts/list` & `prompts/get`)

Non-developer operators can trigger ready-made multi-step workflows directly from Claude, Cursor, or any MCP prompt picker:

| Prompt Name | What It Does in One Click | Tools Chained |
| :--- | :--- | :--- |
| **`prospect_competitor_retail_stockists`** | Pulls independent boutiques carrying a competitor brand, skips national chains at `$0`, and builds a prioritized wholesale outreach table + pitch opener. | `extract_brand_store_stockists` |
| **`kbeauty_supplier_due_diligence`** | Reveals hidden Korean OEM/ODM factories & SPF/PA filings AND cross-checks official MFDS recall orders for a PASS / CAUTION / STOP verdict. | `search_korea_mfds_oem_filings` + `search_korea_mfds_recalls` |
| **`audit_vendor_security_and_ai_risk`** | Audits SaaS vendor Trust Centers for SOC 2 & AI subprocessors, then enriches missing-SOC-2 or high-risk vendors with verified corporate contact emails. | `audit_saas_trust_center` + `enrich_b2b_company_leads` |
| **`monitor_competitor_shopify_changes`** | Checks competitor Shopify stores for real catalog/price deltas and organizes an executive brief by `CRITICAL`, `INVENTORY`, and `CATALOG`. | `monitor_shopify_competitor_deltas` |
| **`build_creator_sponsorship_shortlist`** | Enriches creator Link-in-Bio pages to surface talent agency emails, monetization signals, promo codes, and a ranked Brand-Deal Readiness shortlist. | `enrich_creator_bio_leads` |

---

## Architecture & Implementation Notes (`src/mcp-server.mjs`)

- **Local Transport:** `StdioServerTransport` from `@modelcontextprotocol/sdk/server/stdio.js` (`Dockerfile` + `src/mcp-server.mjs` + `src/mcp-catalog.mjs`).
- **Remote Transport:** Stateless Streamable HTTP JSON-RPC 2.0 endpoint at `https://apify-factory-rapidapi-gateway.apify-factory-rapidapi-gateway.workers.dev/mcp`.
- **Handlers:**
  - `ListToolsRequestSchema`: Returns 7 `verb_noun` tool schemas with `annotations` and concise `outputSchema` synchronously without authentication.
  - `ListPromptsRequestSchema` / `GetPromptRequestSchema`: Returns 5 ready-to-run workflow prompts synchronously without authentication.
  - `CallToolRequestSchema`: Resolves canonical or legacy v1.x tool names, validates `APIFY_TOKEN`, executes the backing Apify Actor (`run-sync-get-dataset-items?memory=256`), and returns both `content` text and typed `structuredContent`.
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
