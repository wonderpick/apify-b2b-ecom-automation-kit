# Apify External Business Intelligence MCP Server (Remote HTTP + Stdio + Docker)

[![Glama MCP Score](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit/badges/score.svg)](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit)
[![mcptry 100/100 #1 Sales & CRM](https://img.shields.io/badge/mcptry-100%2F100%20(%231%20Sales%20%26%20CRM%20%C2%B7%20Security%20A%20%C2%B7%2023ms)-10B981?style=flat-square)](https://mcptry.com/servers/io.github.wonderpick/apify-b2b-ecom-automation-kit)
[![Official MCP Registry](https://img.shields.io/badge/Official%20MCP%20Registry-v2.8.1%20Verified-2563EB?style=flat-square)](https://registry.modelcontextprotocol.io/v0/servers?search=wonderpick)
[![Official n8n Creator](https://img.shields.io/badge/n8n%20Marketplace-Official%20Template%20%2323378-EA4B71?style=flat-square)](https://n8n.io/workflows/23378-send-shopify-competitor-price-and-restock-alerts-with-apify-and-slack/)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](./LICENSE)

> **Give your team AND your AI assistants real-time eyes on the outside world — 14 zero-proxy external intelligence tools, 12 one-click workflow Prompts, 12 multi-branch n8n templates ([Official n8n Marketplace #23378 Live](https://n8n.io/workflows/23378-send-shopify-competitor-price-and-restock-alerts-with-apify-and-slack/)), 8 live HTML dashboards, Clay HTTP recipes, Make blueprints, zero monthly SaaS subscriptions, and `$0` billing whenever nothing changed or nothing matched.**

<p align="center">
  <a href="https://wonderpick.github.io/apify-b2b-ecom-automation-kit/">
    <img src="./docs/demos/demo-live-suite-overview.gif" alt="Live Demo: 8 Free Zero-Login B2B Tools (Stripe ATS, Substack Revenue & Sponsors) and Official n8n Marketplace Template #23378" width="880" />
  </a>
</p>

> **Independently Verified Reliability:** Ranked **100/100 (#1 of 1,913 in Sales & CRM · Security Grade A · 23 ms edge latency)** on [mcptry.com](https://mcptry.com/servers/io.github.wonderpick/apify-b2b-ecom-automation-kit), **Grade A (`4.8/5.0` TDQS)** on [Glama](https://glama.ai/mcp/servers/wonderpick/apify-b2b-ecom-automation-kit), published on the **Official MCP Registry (`v2.8.1`)**, and backed by live public REST APIs on [RapidAPI](https://rapidapi.com/BoGeunKim/api/local-b2b-website-audit-email-cold-pitch-api).

---

### 8 Free Instant Web Tools & Live 2026 Directories (Zero Login · Instant CSV)
Try our production extraction engines directly in your browser with no account or API key:
- **[Free Google News URL Decoder & Live Story Extractor](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/google-news-url-decoder.html)** — Decode `news.google.com/articles/CBMi...` links or pull live headlines in 2 seconds (Excel-safe CSV + Bing News fallback).
- **[Free Substack Paid Revenue & Active Sponsor Checker](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/substack-sponsor-checker.html)** — Inspect any Substack's Stripe pricing, paid ARR floor, active sponsors, media kit, and cadence live.
- **[Free Live ATS Job Board Checker (Greenhouse, Ashby & Lever)](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/ats-jobs-checker.html)** — Check real-time open roles (0% ghost jobs), 45+ day hard-to-fill roles, and hiring tech signals.
- **[Free SaaS Trust Center, SOC 2 & AI Subprocessor Checker](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/saas-soc2-checker.html)** — Probe Vanta/Drata/SafeBase Trust Centers, SOC 2/ISO/HIPAA badges, DNS IAM/SSO, and AI subprocessors.
- **[Free Website 8-Point Weakness & DMARC A–F Grader](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/website-dmarc-audit.html)** — Audit HTTPS, mobile, SEO, GA4/Meta pixels, booking/chat widgets, CMS, and DNS DMARC/SPF grade (A–F).
- **[Free Shopify Store Price & Stock X-Ray](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/shopify-store-xray.html)** — Inspect live Shopify SKUs, price ranges, markdowns, and out-of-stock status in 2 seconds.
- **[Free Creator Link-in-Bio Email & Brand-Deal Checker](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/creator-bio-checker.html)** — Extract creator business emails, social profiles, shop/media-kit links, and monetization signals.
- **[Free B2B Company Domain, LinkedIn & Contact Enricher](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/tools/b2b-company-enricher.html)** — Enrich any domain into its verified LinkedIn `/company/` URL, corporate emails, phones, and tech stack.
- **[Top 55 Paid Substack Newsletters & Active Sponsors Directory (2026)](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/guides/substack-paid-sponsors-directory-2026.html)** — Searchable live-verified directory + [Google News Decoding Guide](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/guides/decode-google-news-urls-2026.html) · [ATS Public API Guide](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/guides/ats-public-job-board-apis-2026.html) · [Shopify Churn Guide](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/guides/shopify-app-store-churn-reviews-guide.html).

### Quick Navigation
- **[For Human Operators (Agencies, Founders & Outbound Teams)](#for-human-operators-agencies-founders--outbound-teams):** Plain-English use cases, `$0.25–$5/1K` vs `$49–$995/mo` comparison table, and 1-click n8n/Clay/Make templates.
- **[For AI Agents & Developers (MCP, Stdio, Docker & Remote HTTP)](#for-ai-agents--developers-mcp-stdio-docker--remote-http):** Zero-install Remote `/mcp` URL, 1-line `npx` / `src/mcp-server.mjs` / `Dockerfile` setup, 14 typed `verb_noun` tools, and 12 built-in Prompts.

---

# For Human Operators (Agencies, Founders & Outbound Teams)

Think about the moment every agency owner, growth operator, wholesale director, e-commerce lead, and security manager hits today:

You open Claude, Cursor, Windsurf, or your weekly spreadsheet and ask a real business question:
- **NEW (`v2.8.1`):** *"Decode Google News redirect URLs in 5-in-1 pure HTTP (with automatic Bing News fallback), stream-strip heavy publisher HTML (`72–79%` RAM saved), rescue paywalled stories via cluster siblings, output LLM-ready 512-token RAG chunks + 10 B2B/PR crisis triggers across `EN/KO/JA/DE/ES`, and skip seen stories at `$0` pre-decode (`$0.80/1K` headlines · `$1.50/1K` full-text RAG, up to 50% tiered store discounts)."*
- *"Find top paid Substack newsletters across 35 categories, compute verified Stripe USD paid ARR floors, detect active sponsor brands & media kits, extract MX/DMARC verified author emails, stream full-text RAG post archives, and pull public Notes & nested reader comments in 128 MB pure HTTP (`$4/1K` newsletters · `$0.40/1K` posts · `$0.25/1K` notes/comments, up to 50% tiered store discounts)."*
- *"Audit Shopify App Store competitors for `"product reviews"` or extract 1–2★ unhappy merchant leads on `klaviyo-email-marketing` with USD pricing tiers, Built for Shopify status, 14-language silent churn NLP, micro-PE scores, and verified developer contacts at `$5/1K` apps (`$0.30/1K` merchant reviews, `$0` proxy)."*
- *"Audit iOS App Store and Google Play apps for `"invoice maker"` across `us, de, jp, kr`, measure silent churn & per-store version regressions in 14 languages, verify paid UA/MMP stacks past Cloudflare WAF, pull EU-DSA developer emails & phones, and generate an interactive HTML Dashboard at `$5/1K` apps (`$0.50/1K` streamed reviews)."*
- *"Find every company actively hiring for `Snowflake`, `Rust`, or `Account Executive` across 13 live ATS engines & 71,900+ boards (0% ghost jobs), flag 45–120d hard-to-fill roles and weekly `watch_diff` repost loops, and export Instantly/HubSpot outreach at `$0.99/1K`."*
- *"Audit these 500 Meta Ad Library advertisers or local B2B sites from Google Maps, run 11-query DNS deliverability grading (A-F), catch 404/OOS/DMARC leaks, track weekly `watch_diff` triggers, isolate CS ticket queues, and export CRM-ready cold pitches."*
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

| Real Operator Job-to-Be-Done | **This Open-Source Suite (`v2.8.1`, Pay-As-You-Go)** | Official / Inward-Only MCPs | Monthly Store / Tech Databases (`$49–$995/mo`) | Multi-Step Enrichment Workbenches (`$149–$800/mo`) |
|---|---|---|---|---|
| **Google News Full-Text RAG, URL Decoder, B2B/PR Crisis Triggers & Cross-Lingual Monitor** | **5-in-1 pure-HTTP URL decoding (Bing News fallback), streaming HTML stripper (`72–79%` RAM saved), 3-layer paywall sibling rescue, 512-token RAG chunks, 10 B2B/PR triggers, EN/KO/JA/DE/ES clustering & `$0`-skip `watchDiff` (`$0.80/1K` · `$1.50/1K` RAG, up to 50% off)** | Not available | `$99–$499/mo` news APIs with truncated snippets & no paywall rescue | Obfuscated `news.google.com` URLs or 2–4 GB headless scrapers |
| **Substack Paid Revenue, Sponsors, Author Emails, RAG Archives & Notes** | **35-category paid/trending/all discovery, Stripe USD paid ARR floors, block & banner sponsor + media-kit detection, MX/DMARC emails, `/api/v1/archive` RAG plain text & public Notes + nested comments (`$4/1K` · `$0.40/1K` posts · `$0.25/1K` notes, up to 50% off)** | Not available | `$99–$399/mo` creator DBs without live sponsor blocks or RAG archives | Single-mode post scrapers with no ARR, sponsors, emails, or Notes/comments |
| **Shopify App Store Pricing, Built for Shopify, Churn & Unhappy Merchant Leads** | **Turbo-Frame search + USD pricing normalization, 5★ histogram, Built for Shopify badge, 14-lang churn NLP, 1–2★ veteran merchant leads, dev DNS/email enrichment, 8-trigger `watch_diff` & HTML Dashboard (`$5/1K` apps · `$0.30/1K` reviews · `$0` proxy/skips)** | Only edits *your own* Shopify Partner app | `$79–$299/mo` static SaaS indexes; no 1–2★ merchant switcher export | Fragile headless scrapers with FX/pagination misses & no churn NLP |
| **Unified iOS App Store & Google Play Churn Intel, Reviews, ASO & EU-DSA Leads** | **Tier 0A/0B AASA/assetlinks matching, Apple Catalog deep reviews + dev replies, GP 199/page + EU-DSA, 14-lang NLP + TF-IDF topics, Wayback->Live GTM + CNAME MMPs, ASO Audit & HTML Dashboard (`$5/1K` apps · `$0.50/1K` reviews · `$0` skips)** | Only manages *your own* published app | `$179–$599/mo` per seat; no outbound emails or CRM CSVs | Single-store scrapers (no dev replies, no matching, no SDK/ad X-Ray) |
| **Live ATS Jobs, Hiring Intent & 70+ Tech Stack (13 ATS + 71K Boards)** | **Works with domains OR zero-list keywords (`Snowflake`/`Rust`), 64-shard live router (0% ghost jobs), 45–120d aging, Bulk-Sync De-Clustering, 7 `watch_diff` triggers & 5 CRM presets (`$0.99/1K` · `$0` proxy & skips)** | Not available | `$49–$400/mo` or `$5/1K` stale cached DBs with ghost jobs | Proxy-heavy 3-ATS scrapers (`$2/1K` + proxy) with no delta tracking |
| **Meta Ads Advertiser Leak Audit + 110+ Stack + DMARC + Pitches** | **Dedupes ads -> brands, 4-layer 110+ stack (34 Shopify Web Pixels + OS 2.0 + CSP), 404/OOS/DMARC A–F, `buyerFitTier`, `inboxType` CS-queue guard, Tier-2 growth pitches, 16-shard `watch_diff` (`$4.50/1K` · `$0` skips)** | Not available | Static store indexes; miss live 404/OOS & sandboxed web pixels | `$150–$600/1K` across 4+ credit steps; misfires on GTM/headless |
| **Local B2B / Google Maps 8-Point Audit + Owner Email + Cold Pitch** | **Audits SSL/mobile/speed/©/SEO/pixels/chat/CMS + Cloudflare owner emails + factual openers (`$4.50/1K` · `$0` filtered)** | Not available | No live website weakness audit | Split across 3+ paid tools |
| **Competitor Retail Stockists + Buyer Emails** | **Extracts 250–1,200+ doors + buyer emails + skips national chains at `$0` (`$5/1K`)** | Only edits *your own* store map | Addresses only; no buyer emails | Manual enrichment per door |
| **Competitor Shopify Price, Stock & MAP Deltas** | **Tracks up to 50 external stores (125K SKUs) · `$0` when unchanged · `CRITICAL`/`INVENTORY`/`CATALOG` (`$2/1K`)** | Only manages *your own* storefront | Re-scrapes & bills full catalog | No built-in delta KV store |
| **External SaaS Trust Center & AI Subprocessor Audit** | **Audits up to 500 external vendors + `complianceScore` + `missingSoc2Lead` · `$0` unchanged (`$5/1K`)** | Only reads *your own* paid GRC account | `$15K–$50K/yr` enterprise TPRM | Not available |
| **South Korea MFDS Cosmetic Recalls & 219K+ OEM DB** | **Plain English auto-bridge (`sunscreen`, `Cosmax`) + `isActiveRecall` + hidden OEM reveal (`$2–$3/1K`)** | Static INCI dictionaries only | Korean-only or unavailable | Not available |
| **3-in-1 B2B Company & Creator Bio Email Enrichment** | **Live Cloudflare-decoded emails + LinkedIn `/company/` + 15+ bio platforms + 0–100 score (`$2.50/1K` · `$0` misses)** | Only edits *your own* bio page | Stale cached emails | High seat + credit minimums |

---

# For AI Agents & Developers (MCP, Stdio, Docker & Remote HTTP)

An open-source **Node.js `stdio` Model Context Protocol (MCP) server** implemented in [`src/mcp-server.mjs`](./src/mcp-server.mjs) (with [`src/mcp-catalog.mjs`](./src/mcp-catalog.mjs), [`Dockerfile`](./Dockerfile), [`glama.json`](./glama.json), and [`server.json`](./server.json)) using `@modelcontextprotocol/sdk` and `StdioServerTransport` — **plus a free, zero-install Remote Streamable HTTP endpoint (`/mcp`)** on Cloudflare Workers. It exposes **14 structured, zero-proxy tools (`outputSchema` + `structuredContent` + full MCP `annotations`)** and **12 ready-to-run workflow Prompts** that cost **$0 whenever nothing changed or nothing matched**.

> **Zero-Token Discovery:** `initialize`, `tools/list`, `prompts/list`, `prompts/get`, and `resources/list` work cleanly with **no `APIFY_TOKEN` required**, allowing MCP clients and automated Glama / Official MCP Registry inspectors to discover all 14 tool schemas and 12 workflow prompts out of the box. `APIFY_TOKEN` is only required when invoking `tools/call`.

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

All 14 tools follow strict `verb_noun` naming, return typed `structuredContent` matching concise `outputSchema` definitions, and declare MCP safety `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`). *(Legacy v1.x tool names remain transparently supported as silent internal aliases.)*

| MCP Tool Name | Key Inputs | Structured Output & Pricing | Backing Actor |
| :--- | :--- | :--- | :--- |
| **`monitor_google_news_rag_triggers`** | `mode`, `queries`, `topics`, `locales`, `timeframe`, `maxArticles`, `decodeUrls`, `dedupeSimilarStories`, `onlyFullText`, `onlyWithTriggers`, `ragChunkMaxTokens`, `watchDiff` | 5-in-1 Google News URL decoding (Bing News fallback), streaming HTML full-text & 512-token RAG chunks (`72–79%` RAM saved), 3-layer paywall sibling rescue, 10 B2B/PR triggers, negation-aware crisis scoring, EN/KO/JA/DE/ES clustering, `$0`-skip `watchDiff` & HTML Dashboard — `$0.80/1K` headlines (`$1.50/1K` RAG, up to 50% off) | [Google News Scraper — Full Text, RAG, Triggers & Monitor](https://apify.com/maitreya_buddha/google-news-intel-rag-trigger-monitor) |
| **`audit_substack_newsletters_leads`** | `mode`, `categories`, `discoveryBoard`, `searchQueries`, `publicationUrlsOrHandles`, `maxPublications`, `maxPostsPerPublication`, `includeCleanPostText`, `maxNotesPerAuthor`, `maxCommentsPerPost`, `watchDiff`, `crmPreset` | 35-category Substack discovery, Stripe USD paid ARR floors, block & banner sponsor + media-kit detection, MX/DMARC verified author emails, `/api/v1/archive` RAG plain text, public Notes + nested comments & HTML Dashboard — `$4/1K` newsletters (`$0.40/1K` posts · `$0.25/1K` notes, up to 50% off, `$0` skips) | [Substack Scraper — Revenue, Sponsors, Posts & Author Leads](https://apify.com/maitreya_buddha/substack-scraper-sponsor-revenue-leads) |
| **`audit_shopify_app_churn_leads`** | `mode`, `searchQueries`, `appHandlesOrUrls`, `categoryUrls`, `partnerUrlsOrSlugs`, `maxApps`, `sampleReviewsPerApp`, `maxReviewsPerApp`, `starFilter`, `watchDiff`, `crmPreset` | Shopify App Store USD pricing tiers, Built for Shopify badges, 5-star histograms, 14-language silent churn NLP, micro-PE scores, developer DNS/email contacts, 1–2★ unhappy merchant leads & HTML Dashboard — `$5/1K` apps (`$0.30/1K` reviews), `$0` proxy & skips | [Shopify App Store Scraper — Pricing, Churn & Merchant Leads](https://apify.com/maitreya_buddha/shopify-app-store-churn-intel-merchant-leads) |
| **`audit_app_store_churn_leads`** | `mode`, `searchTerms`, `iosAppIds`, `androidPackageIds`, `upstreamItems`, `countries`, `autoLocalLanguage`, `starFilter`, `maxApps`, `watchDiff`, `outreachPersona`, `crmPreset` | Unified iOS + Google Play silent churn divergence, 14-language negation-aware NLP + TF-IDF emerging topics, per-store version regressions, EU-DSA contacts, Wayback->Live `gtm.js` + CNAME MMP stacks, ASO audits & HTML Dashboard — `$5/1K` apps (`$0.50/1K` reviews), `$0` proxy & skips | [App Store & Google Play Churn Intel, Reviews & Lead Enricher](https://apify.com/maitreya_buddha/app-store-google-play-churn-intel-lead-enricher) |
| **`monitor_ats_hiring_intent`** | `targets`, `presetPacks`, `rawCsvOrUrls`, `datasetId`, `sourceRunId`, `titleKeywords`, `techStackFilter`, `outputMode`, `agencyPersona`, `onlyNewSinceLastRun`, `crmExportPreset`, `maxTotalJobs` | Live ATS jobs & company hiring dossiers across 13 ATS engines + 71,900+ board directory + 64-shard live router + 7 global feeds (0% ghost jobs), 45–120d hard-to-fill aging, Bulk-Sync De-Clustering, 70+ zero-FP tech tags, 7 weekly `watch_diff` triggers & 5 CRM presets — `$0.99/1K`, `$0` proxy & filtered/unchanged skips | [ATS Jobs, Hiring Intent & Tech-Stack Monitor](https://apify.com/maitreya_buddha/ats-jobs-hiring-intent-tech-stack-monitor) |
| **`audit_meta_ads_advertisers`** | `landingPageUrls`, `sourceDatasetId`, `sourceRunId`, `rawCsvOrUrls`, `agencyPreset`, `crmExportPreset`, `dedupStoreName`, `dedupMode`, `onlyWithEmail`, `maxBrands` | Brand dedup, 4-layer 110+ tech stack (34 Shopify Web Pixels + OS 2.0 + CSP), live 404/OOS/DMARC A–F, `buyerFitTier`, `inboxType` CS-queue safety guard, Tier-2 `expansionOpportunities`, 16-shard `watch_diff` triggers, verified emails & zero-AI agency pitches — `$4.50/1K`, `$0` on marketplaces/WAF/repeats/filtered misses | [Meta Ads Advertiser Leak Audit & Email Enricher](https://apify.com/maitreya_buddha/meta-ads-advertiser-leak-audit-email-enricher) |
| **`audit_local_b2b_websites`** | `websiteUrls`, `rawCsvOrUrls`, `datasetId`, `sourceRunId`, `presetChambers`, `agencyPreset`, `crmExportPreset`, `dedupStoreName`, `dedupMode`, `enableDnsEmailCheck`, `webhookUrl` | 8-point local business website weakness X-ray + 11-query DNS deliverability grade (A-F) + `deliverability_agency` preset + 16-shard `watch_diff`, Cloudflare-decoded owner emails, `inboxType`/`outreachStatus`, CRM presets, 0–100 `pitchPriorityScore`, and zero-hallucination cold-email openers — `$4.50/1K`, `$0` on filtered misses or repeats | [Local B2B Lead Audit, Email & Cold-Pitch Finder](https://apify.com/maitreya_buddha/local-b2b-website-audit-email-pitch-finder) |
| **`extract_brand_store_stockists`** | `urls`, `rawCsvOrUrls`, `datasetId`, `sourceRunId`, `enrichEmails`, `enableDnsEmailCheck`, `onlyIndependentStores`, `crmExportPreset`, `webhookUrl` | Physical retail stockists & independent boutiques carrying competitor brands + buyer/wholesale emails (Cloudflare decoded), DNS deliverability grade (A-F), `inboxType`, Instagram/LinkedIn, `retailerType`, CRM presets, and 0–100 `outreachReadinessScore` — `$5/1K`, `$0` when filtered/empty | [Brand Store Locator & Stockist Email Scraper](https://apify.com/maitreya_buddha/brand-store-locator-stockist-email-enricher) |
| **`monitor_shopify_competitor_deltas`** | `storeUrls`, `stateStoreName`, `minPriceChangePercent`, `eventTypes`, `mapThresholds`, `webhookUrl` | Real catalog & pricing deltas across up to 50 stores × 2,500 products with deterministic `severity` (`CRITICAL`/`INVENTORY`/`CATALOG`), `price_drop`, `price_increase`, `restocked`, `out_of_stock`, `new_product`, and `mapViolation` — `$2/1K`, `$0` on baseline or unchanged runs | [Shopify Competitor Delta Monitor](https://apify.com/maitreya_buddha/shopify-competitor-delta-monitor) |
| **`audit_saas_trust_center`** | `domains`, `mode` (`audit` / `monitor`), `checkSubprocessors`, `checkDnsIam`, `emitBaselineSummary`, `webhookUrl` | External Trust Center platform (`trustCenterPlatform`: Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust), SOC 2 / ISO 27001 / HIPAA certs, `complianceScore` (0–100), `missingSoc2Lead`, DNS IAM/SSO, and 75+ third-party & AI subprocessors — `$5/1K`, `$0` unchanged | [SaaS Trust Center & SOC 2 Monitor](https://apify.com/maitreya_buddha/saas-trust-center-soc2-monitor) |
| **`enrich_b2b_company_leads`** | `inputs`, `rawCsvOrUrls`, `datasetId`, `sourceRunId`, `enrichContactPages`, `enableDnsEmailCheck`, `onlyWithEmail`, `crmExportPreset`, `webhookUrl` | Official domain, verified LinkedIn `/company/` URL (`linkedinUrl`), Cloudflare-decoded corporate role emails, 11-query DNS deliverability grade (A-F), `inboxType`, WhatsApp links, phones, 6 social profiles, CRM presets, and 0–100 `leadQualityScore` — `$2.50/1K`, `$0` on misses or no-email skips | [B2B Company Domain & LinkedIn Enricher](https://apify.com/maitreya_buddha/b2b-company-domain-linkedin-enricher) |
| **`enrich_creator_bio_leads`** | `urls`, `rawCsvOrUrls`, `datasetId`, `sourceRunId`, `enableDeepContactFollow`, `enableDnsEmailCheck`, `onlyWithEmail`, `minReadinessScore`, `crmExportPreset`, `webhookUrl` | Creator talent-agency & business emails (across 15+ bio platforms + 1-hop personal sites with Cloudflare decoding), DNS deliverability grade (A-F), `inboxType`, phones/WhatsApp, 14 social links, monetization signals, promo codes, CRM presets, and 0–100 `creatorReadinessScore` — `$2.50/1K`, `$0` on misses | [Creator Link-in-Bio Email Enricher](https://apify.com/maitreya_buddha/creator-link-in-bio-email-enricher) |
| **`search_korea_mfds_recalls`** | `companyName`, `productName`, `onlyActiveRecalls`, `businessNumber`, `recallOrderDateFrom`, `maxItems` | Official South Korea MFDS (식약처) cosmetic recall & sales suspension records with plain-English auto-bridge (`sunscreen`, `soap`, `Cosmax`), `isActiveRecall` boolean, `lotNumber`, and recall reasons — `$3/1K`, `$0` when clean | [Korea MFDS Cosmetic Recalls API](https://apify.com/maitreya_buddha/korea-mfds-cosmetic-recalls) |
| **`search_korea_mfds_oem_filings`** | `datasetType`, `productName`, `brandOrDistributor`, `oemManufacturer`, `efficacyKeyword`, `resolveOemFromReviewed` | 219,000+ official MFDS functional cosmetics (기능성화장품) filings with plain-English auto-bridge (`sunscreen`, `retinol cream`, `Cosmax`, `Kolmar`), hidden OEM/ODM factory auto-reveal, SPF/PA ratings, and English `functionalClaims` — `$2/1K`, `$0` when empty | [Korea MFDS Functional Cosmetics & OEM API](https://apify.com/maitreya_buddha/korea-mfds-functional-cosmetics-oem) |

---

## Built-In One-Click MCP Prompts (`prompts/list` & `prompts/get`)

Non-developer operators can trigger ready-made multi-step workflows directly from Claude, Cursor, or any MCP prompt picker:

| Prompt Name | What It Does in One Click | Tools Chained |
| :--- | :--- | :--- |
| **`monitor_google_news_rag_and_triggers`** | Decodes Google News URLs across EN/KO/JA/DE/ES, extracts full-text articles + 512-token RAG chunks with 3-layer paywall sibling rescue, flags 10 B2B/PR crisis triggers & synthesizes a citation-backed executive brief. | `monitor_google_news_rag_triggers` |
| **`audit_substack_sponsors_and_rag_archive`** | Audits Substack categories or publication URLs/handles for Stripe USD paid ARR floors, sponsor brands, MX-verified author emails, full-text RAG post archives, or public Notes & nested comments, and drafts a prioritized sponsor/research brief. | `audit_substack_newsletters_leads` |
| **`audit_shopify_app_churn_and_draft_outreach`** | Audits Shopify App Store competitors or extracts 1–2★ unhappy merchant leads with USD pricing, Built for Shopify status, 14-language pain clusters & verified dev contacts, then builds a prioritized positioning/outreach brief. | `audit_shopify_app_churn_leads` |
| **`audit_app_store_churn_and_draft_outreach`** | Audits iOS App Store & Google Play apps by keyword or app IDs for silent churn, 14-language pain clusters, ASO gaps, paid UA/MMP stacks & EU-DSA developer contacts, and drafts a prioritized agency outreach brief. | `audit_app_store_churn_leads` |
| **`monitor_ats_hiring_signals_and_draft_outreach`** | Searches 13 live ATS engines + 7 global feeds by keyword (`Snowflake`, `Rust`) OR company domains, highlights 45–120d hard-to-fill roles & 70+ tech stacks (0% ghost jobs), and drafts persona outreach. | `monitor_ats_hiring_intent` |
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
  - `ListToolsRequestSchema`: Returns 14 `verb_noun` tool schemas with `annotations` and concise `outputSchema` synchronously without authentication.
  - `ListPromptsRequestSchema` / `GetPromptRequestSchema`: Returns 12 ready-to-run workflow prompts synchronously without authentication.
  - `CallToolRequestSchema`: Resolves canonical or legacy v1.x tool names, validates `APIFY_TOKEN`, executes the backing Apify Actor (`run-sync-get-dataset-items?memory=256`), and returns both `content` text and typed `structuredContent`.
- **Zero-Proxy Lean Compute:** All 14 backing Actors default to `256 MB` RAM (verified at `128 MB`) with pure Node.js HTTP / HTTP/2 / DNS (zero Puppeteer/Playwright and `$0` proxy fees).

---

## Bonus: Ready-to-Import n8n Workflow & Clay Templates (`n8n-workflows/`, `clay-templates/`)

This repository also ships 12 multi-branch, production-grade n8n workflows (12–13 functional nodes each, `httpHeaderAuth`), Clay HTTP enrichment recipes, Make blueprints, and Node.js / Python scripts for teams automating the same pipelines outside MCP:

1. **[`n8n-workflows/01-shopify-price-stock-alert-slack.json`](./n8n-workflows/01-shopify-price-stock-alert-slack.json)** — Scheduled 6-hour Shopify competitor delta monitor -> severity Switch routing -> Slack `#pricing-alerts` + Gmail + Google Sheets `DeltaHistory`.
2. **[`n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json`](./n8n-workflows/02-saas-soc2-ai-subprocessor-alert-slack.json)** — Weekly vendor Trust Center monitor -> AI subprocessor risk Switch routing -> Slack `#security-alerts` + Gmail + Google Sheets `ComplianceLog`.
3. **[`n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json`](./n8n-workflows/03-b2b-company-linkedin-email-enricher-sheets.json)** — Google Sheets company batch -> 3-in-1 enrichment -> lead-tier Switch routing (`HOT`/`WARM`/`RESEARCH`) -> Slack + Gmail + Google Sheets `Enriched` / `Unresolved`.
4. **[`n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json`](./n8n-workflows/04-creator-link-in-bio-email-enricher-sheets.json)** — Google Sheets creator Link-in-Bio URLs -> business/agency email & Readiness Score tiering -> Slack + Gmail + Google Sheets.
5. **[`n8n-workflows/05-brand-stockist-buyer-email-outreach.json`](./n8n-workflows/05-brand-stockist-buyer-email-outreach.json)** — Competitor brand list -> retail stockists & buyer/wholesale emails (skipping national chains) -> VIP buyer Switch routing -> Slack `#wholesale-leads` + Gmail pitch brief + Google Sheets `StockistLeads`.
6. **[`n8n-workflows/06-local-b2b-website-audit-cold-pitch-outreach.json`](./n8n-workflows/06-local-b2b-website-audit-cold-pitch-outreach.json)** — Local business URLs / US Chamber batch -> 8-point website audit + owner emails + factual cold-email openers -> `VIP_HOT` / `WARM_PITCH` / `NURTURE` Switch routing -> Slack `#agency-leads` + Gmail draft pitch + Google Sheets `AuditedLeads`.
7. **[`n8n-workflows/07-meta-ads-advertiser-leak-audit-outreach.json`](./n8n-workflows/07-meta-ads-advertiser-leak-audit-outreach.json)** — Weekly Meta Ad Library / DTC URL batch -> 4-layer 110+ stack + 404/OOS/DMARC leak audit + 16-shard `watch_diff` -> CS-queue safety gate -> `VIP_HOT` / `WARM` / `NURTURE` Switch routing -> Slack `#agency-leads` + Gmail pitch brief + Google Sheets `AuditedAdvertisers` / `ManualReviewOrCS`.
8. **[`n8n-workflows/08-ats-jobs-hiring-intent-outreach.json`](./n8n-workflows/08-ats-jobs-hiring-intent-outreach.json)** — Weekly Monday 08:00 ATS Hiring-Intent & Tech-Stack Monitor (`watch_diff`, 13 ATS engines + 71,900+ board directory) -> intent-score Switch routing -> Slack alert + Gmail digest + optional CRM webhook delivery.
9. **[`n8n-workflows/09-app-store-churn-intel-lead-outreach.json`](./n8n-workflows/09-app-store-churn-intel-lead-outreach.json)** — Daily App Store & Google Play Silent Churn Monitor (`watchDiff`, 14-language NLP + EU-DSA contacts + GTM/MMP X-Ray) -> opportunity-score Switch routing -> Slack `#app-churn-alerts` + Gmail digest + guarded CRM webhook delivery.
10. **[`n8n-workflows/10-shopify-app-store-churn-intel-outreach.json`](./n8n-workflows/10-shopify-app-store-churn-intel-outreach.json)** — Daily Shopify App Store Pricing, Churn & Unhappy Merchant Monitor (`watchDiff`, 128MB zero-proxy HTTP) -> churn/switcher Switch routing -> Slack `#shopify-app-churn-alerts` + Gmail digest + guarded CRM webhook delivery.
11. **[`n8n-workflows/11-substack-revenue-sponsor-outreach-rag.json`](./n8n-workflows/11-substack-revenue-sponsor-outreach-rag.json)** — Weekly Monday 08:00 Substack Paid Revenue, Sponsor Signal & Author Outreach Pipeline (`watchDiff`, 128MB zero-proxy HTTP) -> sponsor-score Switch routing -> Slack `#substack-sponsor-leads` + Gmail digest + guarded CRM webhook delivery.
12. **[`n8n-workflows/12-google-news-rag-crisis-trigger-monitor.json`](./n8n-workflows/12-google-news-rag-crisis-trigger-monitor.json)** — 6-Hour Google News Full-Text RAG, B2B Triggers & PR Crisis Monitor (`watchDiff`, 128MB zero-proxy HTTP) -> crisis/urgency Switch routing -> Slack `#news-crisis-triggers` + Gmail executive brief + guarded Vector/CRM webhook delivery.

### Live Interactive Executive Dashboards (GitHub Pages)
- **[Open All 8 Live `OUTPUT_DASHBOARD.html` Demos](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/demos/index.html)** — Unedited HTML dashboards generated in 128 MB zero-proxy Apify Cloud runs (Slots #7–#14, including [Slot #14 Google News Full-Text RAG & Crisis Triggers](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/demos/slot-14-google-news-intel.html), [Slot #13 Substack Revenue & Sponsors](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/demos/slot-13-substack-intel.html), and [Slot #12 Shopify App Store Churn Intel](https://wonderpick.github.io/apify-b2b-ecom-automation-kit/demos/slot-12-shopify-apps.html)).

### Free Clay.com HTTP Recipes, Make.com Blueprints & Live Sample CSVs
- **Clay.com Free Recipes ([`clay-templates/`](./clay-templates/README.md))**: 60-second Native Apify Block + Custom HTTP JSON recipes for **Google News B2B Triggers & RAG**, **Substack Paid Revenue & Sponsors**, **Shopify App Store Churn & Merchant Leads**, **App Store & Google Play Churn**, **ATS Jobs (71K Boards)**, and **Meta Ads Leak Audit**.
- **Make.com Free Blueprints ([`make-blueprints/`](./make-blueprints/README.md))**: 1-click import `.json` scenarios routing high-priority Google News crisis/RAG triggers, Substack sponsor leads, Shopify app churn, mobile churn, hiring-intent, and DTC ad-leak signals to Slack/CRM.
- **Live Verified Sample CSVs ([`samples/`](./samples/))**: Real extracted outputs (`sample-14-google-news-headlines-intel.csv`, `sample-14-google-news-rag-fulltext.csv`, `sample-13-substack-newsletter-intel.csv`, `sample-13-substack-posts-rag.csv`, `sample-12-shopify-app-churn-intel.csv`, `sample-12-shopify-unhappy-merchant-leads.csv`, `sample-11-app-store-churn-leads.csv`, `sample-10-ats-hiring-intent-signals.csv`, `sample-09-meta-ads-leak-audit.csv`) so you can inspect data quality before running.

### Direct Node.js / Python Examples (`examples/`)
- Node.js (v20+, zero dependencies): `APIFY_TOKEN="..." node examples/node/run-actors.mjs`
- Python: `APIFY_TOKEN="..." python examples/python/run_actors.py`

---

## License

MIT © 2026 BoGeun Kim ([wonderpick](https://github.com/wonderpick) / [maitreya_buddha](https://apify.com/maitreya_buddha))
