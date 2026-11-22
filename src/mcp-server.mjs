#!/usr/bin/env node
/**
 * Apify B2B, E-Commerce, Retail Stockist, TPRM & Creator MCP Server (stdio)
 * Exposes 7 lightweight, zero-proxy 128MB-256MB Apify Actors as standard MCP tools.
 * Note: tool discovery (tools/list) works with NO APIFY_TOKEN so automated MCP
 * indexers (e.g. Glama.ai) inspect all schemas cleanly without HTTP 401 errors.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    name: 'shopify_competitor_delta_monitor',
    actorSlug: 'maitreya_buddha~shopify-competitor-delta-monitor',
    annotations: {
      title: 'Shopify Competitor Price & Restock Delta Monitor',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Monitor up to 50 external Shopify competitor stores (up to 2,500 products each = 125K SKUs) for price drops, price hikes, restocks, stockouts, new launches, and MAP violations using persistent Key-Value Store snapshots ($2/1K real deltas; $0 on baseline or unchanged runs). Returns severity (CRITICAL, INVENTORY, CATALOG), oldPrice, newPrice, priceChangePercent, mapViolation, and productUrl. Use when watching external Shopify competitors for catalog changes; do not use for editing your own Shopify admin or non-Shopify sites.',
    inputSchema: {
      type: 'object',
      properties: {
        storeUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of 1 to 50 Shopify store or collection URLs to monitor, e.g. ["https://www.allbirds.com"].',
        },
        stateStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store (alphanumeric and hyphens only) used to persist product snapshots between runs.',
          default: 'shopify-delta-monitor-state',
        },
        maxProductsPerStore: {
          type: 'integer',
          description: 'Maximum products to fetch per store URL (50-2500, paginated at 250/page).',
          default: 500,
        },
        minPriceChangePercent: {
          type: 'number',
          description: 'Minimum percentage change threshold (0-100) before emitting price_drop or price_increase.',
          default: 1.0,
        },
        eventTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional subset of event types to emit: new_product, removed_product, price_drop, price_increase, discount_started, discount_ended, out_of_stock, restocked.',
        },
        mapThresholds: {
          type: 'object',
          description: 'Optional JSON map of SKU or product handle to Minimum Advertised Price (flags mapViolation: true and severity: CRITICAL if below threshold).',
        },
        emitBaselineSummary: {
          type: 'boolean',
          description: 'Emit 1 zero-cost baseline_initialized record on the first snapshot of each store.',
          default: true,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional Slack, Discord, or n8n webhook URL notified when >= 1 delta event occurs.',
        },
      },
      required: ['storeUrls'],
    },
  },
  {
    name: 'saas_trust_center_soc2_monitor',
    actorSlug: 'maitreya_buddha~saas-trust-center-soc2-monitor',
    annotations: {
      title: 'SaaS Trust Center, SOC 2 & AI Subprocessor Monitor',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Audit or monitor up to 500 external SaaS vendor Trust Centers (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust) for SOC 2/ISO 27001/HIPAA/PCI-DSS certs, DNS IAM/SSO, 75+ third-party & AI subprocessors (OpenAI, Anthropic, AWS Bedrock, Vertex AI), complianceScore (0-100), and missingSoc2Lead ($5/1K audits or changes; $0 unchanged). Use for third-party vendor risk (TPRM) or finding SaaS companies missing SOC 2; do not use for editing your own internal GRC workspace.',
    inputSchema: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of 1 to 500 SaaS vendor or prospect domains to inspect, e.g. ["apify.com", "linear.app", "canva.com"].',
        },
        mode: {
          type: 'string',
          enum: ['audit', 'monitor'],
          description: 'Execution mode: "audit" returns complete Trust Center, complianceScore (0-100), missingSoc2Lead, certs, IAM, and AI subprocessor posture; "monitor" emits only real changes against snapshots.',
          default: 'audit',
        },
        stateStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store to persist baseline snapshots in monitor mode.',
          default: 'saas-trust-monitor-state',
        },
        checkSubprocessors: {
          type: 'boolean',
          description: 'Inspect /subprocessors pages and Trust Center content for third-party and AI vendors.',
          default: true,
        },
        checkDnsIam: {
          type: 'boolean',
          description: 'Query DNS CNAME/TXT/MX records to verify Trust Center hosting and SSO/IAM providers (Okta, Entra, Google Workspace).',
          default: true,
        },
        concurrency: {
          type: 'integer',
          description: 'Concurrent domains to check (1-15).',
          default: 5,
        },
      },
      required: ['domains'],
    },
  },
  {
    name: 'b2b_company_domain_linkedin_enricher',
    actorSlug: 'maitreya_buddha~b2b-company-domain-linkedin-enricher',
    annotations: {
      title: 'B2B Company Domain, LinkedIn & Email Enricher',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Read-only 3-in-1 B2B lead enricher: resolve company names, domains, work emails, or an Apify datasetId into verified official domain, LinkedIn /company/ URL (rejecting /in/ noise), Cloudflare-decoded corporate emails (sales@, contact@, hello@), WhatsApp links, phones, 6 socials, and 0-100 leadQualityScore ($2.50/1K enriched; $0 for misses, parked domains, or onlyWithEmail skips). Use for B2B company enrichment; do not use for creator/influencer bios (use creator_link_in_bio_email_enricher instead).',
    inputSchema: {
      type: 'object',
      properties: {
        inputs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Up to 2,000 company names, domains, URLs, or work emails, e.g. ["Stripe", "Linear", "apify.com"]. Optional when datasetId is provided.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional Apify Dataset ID from an upstream scraper (auto-detects website, domain, companyName, name, or email fields).',
        },
        datasetField: {
          type: 'string',
          description: 'Optional explicit field name to read from datasetId items when chaining.',
        },
        enrichContactPages: {
          type: 'boolean',
          description: 'Follow up to 2 internal /contact or /about pages when the homepage lacks emails, WhatsApp, or LinkedIn URLs.',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill ONLY companies where at least 1 verified email is found ($0 otherwise).',
          default: false,
        },
        includeUnresolved: {
          type: 'boolean',
          description: 'Include unresolved/not_found rows in the output dataset for auditability (always $0 cost).',
          default: false,
        },
        minConfidence: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Minimum confidence threshold for accepting company-name-to-domain matches.',
          default: 'medium',
        },
        concurrency: {
          type: 'integer',
          description: 'Concurrent domain resolutions (1-15).',
          default: 6,
        },
      },
    },
  },
  {
    name: 'korea_mfds_cosmetic_recalls',
    actorSlug: 'maitreya_buddha~korea-mfds-cosmetic-recalls',
    annotations: {
      title: 'Korea MFDS Cosmetic Recalls & Safety Lookup',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Read-only lookup of official South Korea MFDS (식약처) cosmetic recall and sales suspension notices in plain English or Korean (auto-bridges 50+ K-Beauty terms like "sunscreen", "soap", "Cosmax"). Returns productName, companyName, isActiveRecall, lotNumber, recallReason, recallOrderDate, and businessNumber ($3/1K matches; $0 if none). Use for K-Beauty import safety & compliance screening; do not use for US FDA/EU recalls or functional OEM formula discovery (use korea_mfds_functional_cosmetics_oem instead).',
    inputSchema: {
      type: 'object',
      properties: {
        companyName: {
          type: 'string',
          description: 'Optional filter for brand or manufacturer name in English or Korean, e.g. "Cosmax", "Cowell", or "코스맥스".',
        },
        productName: {
          type: 'string',
          description: 'Optional filter for cosmetic product keyword in English or Korean, e.g. "sunscreen", "soap", "lip balm", or "선크림".',
        },
        onlyActiveRecalls: {
          type: 'boolean',
          description: 'When true, return and bill ONLY currently active recall orders (hiding expired notices at $0).',
          default: false,
        },
        businessNumber: {
          type: 'string',
          description: 'Optional Korean 10-digit business registration number (hyphens ignored), e.g. "2158733119".',
        },
        recallOrderDateFrom: {
          type: 'string',
          description: 'Optional start date filter in YYYY-MM-DD format, e.g. "2025-01-01".',
        },
        recallOrderDateTo: {
          type: 'string',
          description: 'Optional end date filter in YYYY-MM-DD format, e.g. "2026-12-31".',
        },
        maxItems: {
          type: 'integer',
          description: 'Maximum recall records to return (1-1000).',
          default: 50,
        },
      },
    },
  },
  {
    name: 'korea_mfds_functional_cosmetics_oem',
    actorSlug: 'maitreya_buddha~korea-mfds-functional-cosmetics-oem',
    annotations: {
      title: 'Korea MFDS Functional Cosmetics & OEM Factory DB',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Read-only search across 219,000+ official South Korea MFDS functional cosmetic filings in plain English or Korean ("sunscreen", "retinol cream", "Cosmax", "Kolmar" auto-bridge to Korean queries). Auto-joins reviewed base formulas to uncover hidden Korean OEM/ODM factories, SPF/PA specs, and English functionalClaims ($2/1K records; $0 if empty). Use for K-Beauty OEM sourcing & regulatory R&D; do not use for cosmetic recall checks (use korea_mfds_cosmetic_recalls instead).',
    inputSchema: {
      type: 'object',
      properties: {
        datasetType: {
          type: 'string',
          enum: ['both', 'reported', 'reviewed'],
          description: 'Which MFDS functional cosmetic registry to query: "reported" (198k+ brand filings), "reviewed" (20k+ OEM base formulas), or "both".',
          default: 'reported',
        },
        productName: {
          type: 'string',
          description: 'Product keyword in English or Korean (e.g. "sunscreen", "serum", "ampoule", "선크림", "세럼") — English auto-translates for instant server-side search.',
        },
        brandOrDistributor: {
          type: 'string',
          description: 'Brand or responsible seller in English or Korean, e.g. "Amorepacific", "Olive Young", "Medicube", or "아모레퍼시픽".',
        },
        oemManufacturer: {
          type: 'string',
          description: 'OEM/ODM factory in English or Korean, e.g. "Cosmax", "Kolmar", "Cosmecca", "코스맥스", or "한국콜마".',
        },
        efficacyKeyword: {
          type: 'string',
          description: 'Filter by efficacy claim in English or Korean: "whitening", "anti-wrinkle", "uv-protection", "SPF", "hair-loss", "미백", "주름", "자외선".',
        },
        itemCode: {
          type: 'string',
          description: 'Exact MFDS ITEM_SEQ or COSMETIC_REPORT_SEQ identifier for instant single-product lookup.',
        },
        resolveOemFromReviewed: {
          type: 'boolean',
          description: 'Query linked reviewed base formulas automatically to reveal hidden OEM/ODM manufacturers when missing on reported records.',
          default: true,
        },
        maxItems: {
          type: 'integer',
          description: 'Maximum cosmetic records to return (1-1000).',
          default: 50,
        },
      },
    },
  },
  {
    name: 'creator_link_in_bio_email_enricher',
    actorSlug: 'maitreya_buddha~creator-link-in-bio-email-enricher',
    annotations: {
      title: 'Creator Link-in-Bio Email & Brand-Deal Enricher',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Read-only creator enricher across 15+ Link-in-Bio platforms (Linktree, Stan.store, Bio.site, Beacons, Komi, Hoo.be, Carrd, etc.). Extracts talent agency & business emails (including 1-hop personal site following + Cloudflare email decoding), phones/WhatsApp, 14 social networks, monetization links, promo codes, and a 0-100 Creator Readiness Score ($2.50/1K enriched; $0 for 404/WAF/no-email skips). Use for influencer outreach; do not use for corporate B2B company lookup (use b2b_company_domain_linkedin_enricher instead).',
    inputSchema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of creator Link-in-Bio URLs or handles, e.g. ["https://linktr.ee/heathertraska", "https://stan.store/stan"]. Optional when datasetId is provided.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional Apify Dataset ID from an upstream Instagram, TikTok, or YouTube scraper (auto-detects externalUrl, bioLink, biography, channelLinks while preserving upstreamHandle and upstreamFollowers).',
        },
        enableDeepContactFollow: {
          type: 'boolean',
          description: 'When no agency/business email is on the bio page, follow up to 2 creator personal website, Contact, or Media Kit links (1-hop, SSRF-safe, Cloudflare email decoding included).',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, only save and bill creators with at least 1 valid email ($0 when missing).',
          default: false,
        },
        minReadinessScore: {
          type: 'integer',
          description: 'Minimum Creator Brand-Deal Readiness Score (0-100) required to save and bill.',
          default: 0,
        },
        maxProfiles: {
          type: 'integer',
          description: 'Maximum unique creator bio URLs to process (1-50,000).',
          default: 500,
        },
        maxConcurrency: {
          type: 'integer',
          description: 'Concurrent requests (1-20; capped automatically at 3 on 128-256 MB containers).',
          default: 5,
        },
      },
    },
  },
  {
    name: 'brand_store_locator_stockist_email_enricher',
    actorSlug: 'maitreya_buddha~brand-store-locator-stockist-email-enricher',
    annotations: {
      title: 'Brand Store Locator & Stockist Buyer Email Scraper',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Read-only extractor that discovers physical retail stockists carrying competitor brands (Stockist, Storepoint, StoreRocket, Storemapper, WP Store Locator, JSON-LD, HTML) AND enriches each unique retailer website with buyer/wholesale emails (including Cloudflare email decoding), Instagram, LinkedIn, independent-boutique vs national-chain tags, and 0-100 Outreach Readiness Score ($5/1K stores; $0 for filtered chains or empty sites). Use for wholesale retail prospecting; do not use for editing your own store locator map.',
    inputSchema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Brand homepages or store locator URLs, e.g. ["https://fellowproducts.com", "https://brooklynhotdogcompany.com"]. Optional when datasetId is provided.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional upstream Apify Dataset ID containing brand or store locator URLs.',
        },
        enrichEmails: {
          type: 'boolean',
          description: 'Visit each unique retailer website (plus /wholesale and /contact) to extract buyer emails and social links.',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'Only save and bill stores where a valid email address is found ($0 otherwise).',
          default: false,
        },
        onlyIndependentStores: {
          type: 'boolean',
          description: 'Skip giant national chains (Target, Walmart, Sephora, Whole Foods, etc.) at $0 and return independent boutiques & regional shops.',
          default: false,
        },
        maxStoresPerBrand: {
          type: 'integer',
          description: 'Maximum stockist locations to return per brand (1-5,000).',
          default: 100,
        },
        countryFilter: {
          type: 'string',
          description: 'Optional country code or name filter (e.g. "US", "GB", "CA", "AU", "DE", "KR").',
        },
        minReadinessScore: {
          type: 'integer',
          description: 'Minimum Outreach Readiness Score (0-100) required to save and bill ($0 for filtered stores).',
          default: 0,
        },
      },
    },
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]));

const SERVER_INSTRUCTIONS = [
  'Apify B2B, E-Commerce, Retail Stockist, TPRM & K-Beauty Intelligence MCP Server (7 zero-proxy tools; $0 billed on empty, unchanged, or filtered misses).',
  'Tool Routing Guide:',
  '- Wholesale retail stockists + buyer emails from competitor brands -> brand_store_locator_stockist_email_enricher.',
  '- Ongoing Shopify competitor price drops, restocks, stockouts, or MAP violations -> shopify_competitor_delta_monitor.',
  '- External SaaS vendor Trust Centers, SOC 2/ISO certs, IAM/SSO, or AI subprocessors -> saas_trust_center_soc2_monitor.',
  '- Corporate B2B company domain, LinkedIn /company/ URL, role emails, WhatsApp, and phones -> b2b_company_domain_linkedin_enricher.',
  '- Influencer/creator Link-in-Bio emails, agency contacts, monetization links, and Readiness Score -> creator_link_in_bio_email_enricher.',
  '- South Korea MFDS cosmetic recall & safety notices (English or Korean queries) -> korea_mfds_cosmetic_recalls.',
  '- South Korea MFDS 219,000+ functional cosmetic filings & hidden Korean OEM/ODM factories -> korea_mfds_functional_cosmetics_oem.',
  'Safety: All lookup/enrichment tools are read-only and idempotent; monitor tools only write non-destructive Apify Key-Value Store snapshots.',
].join('\n');

const server = new Server(
  {
    name: 'apify-b2b-ecom-mcp-server',
    version: '1.5.0',
  },
  {
    capabilities: {
      tools: {},
    },
    instructions: SERVER_INSTRUCTIONS,
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema, annotations }) => ({
    name,
    description,
    inputSchema,
    annotations,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const tool = TOOL_MAP.get(name);
  if (!tool) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    };
  }

  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: 'APIFY_TOKEN environment variable is required to invoke Apify Actors. Get your token at https://console.apify.com/settings/integrations and pass it via env: { "APIFY_TOKEN": "..." }.',
        },
      ],
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180_000);

  try {
    const endpoint = `https://api.apify.com/v2/acts/${tool.actorSlug}/run-sync-get-dataset-items?memory=256`;
    const payload =
      tool.name === 'b2b_company_domain_linkedin_enricher'
        ? { includeUnresolved: false, ...(args ?? {}) }
        : (args ?? {});
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await res.text();
    if (!res.ok) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Apify Actor ${tool.actorSlug} returned HTTP ${res.status}: ${text.slice(0, 1000)}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Failed to execute ${tool.actorSlug}: ${err?.name === 'AbortError' ? 'Request timed out after 180s' : err.message}`,
        },
      ],
    };
  } finally {
    clearTimeout(timeoutId);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
