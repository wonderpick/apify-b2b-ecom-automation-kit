# Apify External Business Intelligence MCP Server (Remote HTTP + Stdio + Docker)

[![Glama MCP Score](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit/badges/score.svg)](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit)
[![mcptry 100/100 #1 Sales & CRM](https://img.shields.io/badge/mcptry-100%2F100%20(%231%20Sales%20%26%20CRM%20%C2%B7%20Security%20A%20%C2%B7%2023ms)-10B981?style=flat-square)](https://mcptry.com/servers/io.github.wonderpick/apify-b2b-ecom-automation-kit)
[![Official MCP Registry](https://img.shields.io/badge/Official%20MCP%20Registry-v2.2.0%20Verified-2563EB?style=flat-square)](https://registry.modelcontextprotocol.io/v0/servers?search=wonderpick)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](./LICENSE)

> **Give your team AND your AI assistants real-time eyes on the outside world — 9 zero-proxy external intelligence tools, 7 one-click workflow Prompts, 7 multi-branch n8n templates, zero monthly SaaS subscriptions, and `$0` billing whenever nothing changed or nothing matched.**

> **Independently Verified Reliability:** Ranked **100/100 (#1 of 1,913 in Sales & CRM · Security Grade A · 23 ms edge latency)** on [mcptry.com](https://mcptry.com/servers/io.github.wonderpick/apify-b2b-ecom-automation-kit), **Grade A (`5/5` Disambiguation & Naming Consistency)** on [Glama](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit), published on the **Official MCP Registry (`v2.2.0`)**, and backed by live public REST APIs on [RapidAPI](https://rapidapi.com/BoGeunKim/api/local-b2b-website-audit-email-cold-pitch-api).

---

### Quick Navigation
- **[For Human Operators (Agencies, Founders & Outbound Teams)](#for-human-operators-agencies-founders--outbound-teams):** Plain-English use cases, `$4.50/1K` vs `$250–$995/mo` comparison table, and 1-click n8n workflows.
- **[For AI Agents & Developers (MCP, Stdio, Docker & Remote HTTP)](#for-ai-agents--developers-mcp-stdio-docker--remote-http):** Zero-install Remote `/mcp` URL, 1-line `npx` / `src/mcp-server.mjs` / `Dockerfile` setup, 9 typed `verb_noun` tools, and 7 built-in Prompts.

---

# For Human Operators (Agencies, Founders & Outbound Teams)

Think about the moment every agency owner, growth operator, wholesale director, e-commerce lead, and security manager hits today:

You open Claude, Cursor, Windsurf, or your weekly spreadsheet and ask a real business question:
- **NEW (`v2.2.0`):** *"Take these 500 Meta Ad Library advertisers, merge duplicates, find who's sending paid traffic to 404/OOS pages or failing DMARC, X-ray their 110+ marketing stack without false positives, warn me if their email is a CS ticket queue, and write evidence-backed cold pitches."*
- *"Audit these 100 local businesses from Google Maps for 8 website weaknesses, grab their owner emails, and draft a factual cold-email opener for each."*
- *"Which independent boutiques carry our top competitor right now — and what are their wholesale buyer emails?"*
- *"Did any of our 15 Shopify competitors slash prices or sell out of their hero SKU overnight?"*
- *"Did any of our 200 SaaS vendors quietly add OpenAI or Anthropic to their Trust Center subprocessors this week?"*
- *"Which Korean factory makes this viral SPF50+ sunscreen — and do they have any active MFDS recall orders?"*
- *"Find every creator on our shortlist who already runs paid brand deals and grab their talent agency's email."*

### Why Existing Tools & MCP Servers Couldn't Answer These Questions

- **Official platform MCPs only look *inward*** — they edit *your own* store, *your own* bio link, or *your own* GRC workspace. They **cannot** audit external advertisers, watch competitors, or scout retail stockists.
- **Monthly SaaS databases & multi-step enrichment workbenches cost `$75–$995/month`** (or `$150–$600/1K` across credit waterfalls), rely on stale monthly snapshots, and misfire on Shopify Checkout Extensibility, server-side GTM, or headless Next.js storefronts.
- **Generic web-scraping MCPs bill for every duplicate ad or unchanged SKU**, blowing up your context window and your budget.

### Side-by-Side Comparison vs. Existing Tool Categories

| Real Operator Job-to-Be-Done | **This Open-Source Suite (`v2.2.0`, Pay-As-You-Go)** | Official / Inward-Only MCPs | Monthly Store / Tech Databases (`$75–$995/mo`) | Multi-Step Enrichment Workbenches (`$149–$800/mo`) |
|---|---|---|---|---|
| **Meta Ads Advertiser Leak Audit + 110+ Stack + DMARC + Pitches** | **Dedupes ads -> brands, 4-layer 110+ stack (34 Shopify Web Pixels + OS 2.0 + CSP), 404/OOS/DMARC A–F, `buyerFitTier`, `inboxType` CS-queue guard, Tier-2 growth pitches, 16-shard `watch_diff` (`$4.50/1K` · `$0` skips)** | Not available | Static store indexes; miss live 404/OOS & sandboxed web pixels | `$150–$600/1K` across 4+ credit steps; misfires on GTM/headless |
| **Local B2B / Google Maps 8-Point Audit + Owner Email + Cold Pitch** | **Audits SSL/mobile/speed/©/SEO/pixels/chat/CMS + Cloudflare owner emails + factual openers (`$4.50/1K` · `$0` filtered)** | Not available | No live website weakness audit | Split across 3+ paid tools |
| **Competitor Retail Stockists + Buyer Emails** | **Extracts 250–1,200+ doors + buyer emails + skips national chains at `$0` (`$5/1K`)** | Only edits *your own* store map | Addresses only; no buyer emails | Manual enrichment per door |
| **Competitor Shopify Price, Stock & MAP Deltas** | **Tracks up to 50 external stores (125K SKUs) · `$0` when unchanged · `CRITICAL`/`INVENTORY`/`CATALOG` (`$2/1K`)** | Only manages *your own* storefront | Re-scrapes & bills full catalog | No built-in delta KV store |
| **External SaaS Trust Center & AI Subprocessor Audit** | **Audits up to 500 external vendors + `complianceScore` + `missingSoc2Lead` · `$0` unchanged (`$5/1K`)** | Only reads *your own* paid GRC account | `$15K–$50K/yr` enterprise TPRM | Not available |
| **South Korea MFDS Cosmetic Recalls & 219K+ OEM DB** | **Plain English auto-bridge (`sunscreen`, `Cosmax`) + `isActiveRecall` + hidden OEM reveal (`$2–$3/1K`)** | Static INCI dictionaries only | Korean-only or unavailable | Not available |
| **3-in-1 B2B Company & Creator Bio Email Enrichment** | **Live Cloudflare-decoded emails + LinkedIn `/company/` + 15+ bio platforms + 0–100 score (`$2.50/1K` · `$0` misses)** | Only edits *your own* bio page | Stale cached emails | High seat + credit minimums |

---

# For AI Agents & Developers (MCP, Stdio, Docker & Remote HTTP)

An open-source **Node.js `stdio` Model Context Protocol (MCP) server** implemented in [`src/mcp-server.mjs`](./src/mcp-server.mjs) (with [`src/mcp-catalog.mjs`](./src/mcp-catalog.mjs), [`Dockerfile`](./Dockerfile), [`glama.json`](./glama.json), and [`server.json`](./server.json)) using `@modelcontextprotocol/sdk` and `StdioServerTransport` — **plus a free, zero-install Remote Streamable HTTP endpoint (`/mcp`)** on Cloudflare Workers. It exposes **9 structured, zero-proxy tools (`outputSchema` + `structuredContent` + full MCP `annotations`)** and **7 ready-to-run workflow Prompts** that cost **$0 whenever nothing changed or nothing matched**.

> **Zero-Token Discovery:** `initialize`, `tools/list`, `prompts/list`, `prompts/get`, and `resources/list` work cleanly with **no `APIFY_TOKEN` required**, allowing MCP clients and automated Glama / Official MCP Registry inspectors to discover all 9 tool schemas and 7 workflow prompts out of the box. `APIFY_TOKEN` is only required when invoking `tools/call`.

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

All 9 tools follow strict `verb_noun` naming, return typed `structuredContent` matching concise `outputSchema` definitions, and declare MCP safety `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`). *(Legacy v1.x tool names remain transparently supported as silent internal aliases.)*

| MCP Tool Name | Key Inputs | Structured Output & Pricing | Backing Actor |
| :--- | :--- | :--- | :--- |
| **`audit_meta_ads_advertisers`** | `landingPageUrls`, `sourceDatasetId`, `sourceRunId`, `rawCsvOrUrls`, `agencyPreset`, `crmExportPreset`, `dedupStoreName`, `dedupMode`, `onlyWithEmail`, `maxBrands` | Brand dedup, 4-layer 110+ tech stack (34 Shopify Web Pixels + OS 2.0 + CSP), live 404/OOS/DMARC A–F, `buyerFitTier`, `inboxType` CS-queue safety guard, Tier-2 `expansionOpportunities`, 16-shard `watch_diff` triggers, verified emails & zero-AI agency pitches — `$4.50/1K`, `$0` on marketplaces/WAF/repeats/filtered misses | [Meta Ads Advertiser Leak Audit & Email Enricher](https://apify.com/maitreya_buddha/meta-ads-advertiser-leak-audit-email-enricher) |
| **`audit_local_b2b_websites`** | `websiteUrls`, `datasetId`, `presetChambers`, `chamberCategoryKeyword`, `agencyPreset`, `onlyWithEmail`, `minPitchScore` | 8-point local business website weakness X-ray (SSL, mobile, speed, `©` year, SEO/LocalBusiness schema, GA4/Meta/TikTok pixels, booking/chat widgets, CMS), Cloudflare-decoded owner emails, 0–100 `pitchPriorityScore`, and zero-hallucination cold-email openers — `$4.50/1K`, `$0` on filtered misses | [Local B2B Lead Audit, Email & Cold-Pitch Finder](https://apify.com/maitreya_buddha/local-b2b-website-audit-email-pitch-finder) |
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
| **`audit_meta_ads_leaks_and_draft_pitches`** | Deduplicates Meta Ad Library datasets/Run IDs or DTC landing URLs, audits 110+ stack + 404/OOS/DMARC leaks, separates `cs_ticket_queue` rows to LinkedIn DM, and builds a prioritized DTC outreach brief. | `audit_meta_ads_advertisers` |
| **`audit_local_leads_and_draft_pitches`** | Audits local business URLs, Google Maps datasets, or US Chamber cities for 8 website weaknesses, recovers owner emails, and builds a ranked cold-pitch table (skipping WAF-protected rows). | `audit_local_b2b_websites` |
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
  - `ListToolsRequestSchema`: Returns 9 `verb_noun` tool schemas with `annotations` and concise `outputSchema` synchronously without authentication.
  - `ListPromptsRequestSchema` / `GetPromptRequestSchema`: Returns 7 ready-to-run workflow prompts synchronously without authentication.
  - `CallToolRequestSchema`: Resolves canonical or legacy v1.x tool names, validates `APIFY_TOKEN`, executes the backing Apify Actor (`run-sync-get-dataset-items?memory=256`), and returns both `content` text and typed `structuredContent`.
- **Zero-Proxy Lean Compute:** All 9 backing Actors default to `256 MB` RAM (verified at `128 MB`) with pure Node.js HTTP / HTTP/2 / DNS (zero Puppeteer/Playwright and `$0` proxy fees).

---

## Bonus: Ready-to-Import n8n Workflow Templates (`n8n-workflows/`)

This repository also ships 7 multi-branch, production-grade n8n workflows (12–13 functional nodes each, `httpHeaderAuth`) and Node.js / Python scripts for teams automating the same pipelines outside MCP:

1. **[`n8n-workflows/01-shopify-price-stock-alert-slack.json`](./n8n-workflows/01-shopify-price-stock-alert-slack.json)** — Scheduled 6-hour Shopify competitor delta monitor -> severity Switch routing -> Slack `#pricing-alerts` + Gmail + Google Sheets `DeltaHistory`.
2. **[`n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json`](./n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json)** — Weekly vendor Trust Center monitor -> AI subprocessor risk Switch routing -> Slack `#security-alerts` + Gmail + Google Sheets `ComplianceLog`.
3. **[`n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json`](./n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json)** — Google Sheets company batch -> 3-in-1 enrichment -> lead-tier Switch routing (`HOT`/`WARM`/`RESEARCH`) -> Slack + Gmail + Google Sheets `Enriched` / `Unresolved`.
4. **[`n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json`](./n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json)** — Google Sheets creator Link-in-Bio URLs -> business/agency email & Readiness Score tiering -> Slack + Gmail + Google Sheets.
5. **[`n8n-workflows/05-brand-stockist-buyer-email-outreach.json`](./n8n-workflows/05-brand-stockist-buyer-email-outreach.json)** — Competitor brand list -> retail stockists & buyer/wholesale emails (skipping national chains) -> VIP buyer Switch routing -> Slack `#wholesale-leads` + Gmail pitch brief + Google Sheets `StockistLeads`.
6. **[`n8n-workflows/06-local-b2b-website-audit-cold-pitch-outreach.json`](./n8n-workflows/06-local-b2b-website-audit-cold-pitch-outreach.json)** — Local business URLs / US Chamber batch -> 8-point website audit + owner emails + factual cold-email openers -> `VIP_HOT` / `WARM_PITCH` / `ARCHIVE` Switch routing -> Slack `#agency-leads` + Gmail draft pitch + Google Sheets `AuditedLeads`.
7. **[`n8n-workflows/07-meta-ads-advertiser-leak-audit-outreach.json`](./n8n-workflows/07-meta-ads-advertiser-leak-audit-outreach.json)** — Weekly Meta Ad Library / DTC URL batch -> 4-layer 110+ stack + 404/OOS/DMARC leak audit + 16-shard `watch_diff` -> CS-queue safety gate -> `VIP_HOT` / `WARM` / `NURTURE` Switch routing -> Slack `#agency-leads` + Gmail pitch brief + Google Sheets `AuditedAdvertisers` / `ManualReviewOrCS`.

### Direct Node.js / Python Examples (`examples/`)
- Node.js (v20+, zero dependencies): `APIFY_TOKEN="..." node examples/node/run-actors.mjs`
- Python: `APIFY_TOKEN="..." python examples/python/run_actors.py`

---

## License

MIT © 2026 BoGeun Kim ([wonderpick](https://github.com/wonderpick) / [maitreya_buddha](https://apify.com/maitreya_buddha))
