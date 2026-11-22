#!/usr/bin/env node
/**
 * Apify B2B, E-Commerce, Retail Stockist, TPRM & Creator MCP Server (stdio)
 * Exposes 7 lightweight, zero-proxy 128MB Apify Actors as standard MCP tools.
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
    description:
      'Monitor Shopify competitor stores for price drops, price hikes, restocks, out-of-stock alerts, new product launches, and MAP violations using persistent Key-Value Store snapshots ($2/1K real deltas; $0 on baseline or unchanged runs). Returns delta records with eventType, store, title, variantTitle, sku, oldPrice, newPrice, priceChangePercent, available, mapViolation, and productUrl. Use whenever you need change-only e-commerce price or inventory tracking without paying for unchanged pages.',
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
          description: 'Optional JSON map of SKU or product handle to Minimum Advertised Price (flags mapViolation: true if below threshold).',
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
    description:
      'Audit or continuously monitor B2B SaaS vendor Trust Centers (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust) for SOC 2 Type I/II, ISO 27001, HIPAA, PCI-DSS, DNS IAM/SSO providers, and 75+ subprocessors including AI vendors (OpenAI, Anthropic, AWS Bedrock, Vertex AI). Returns compliance posture in audit mode or change deltas in monitor mode ($5/1K audits or changes; $0 unchanged). Ideal for Third-Party Risk Management (TPRM) and vendor security questionnaires.',
    inputSchema: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of 1 to 500 SaaS vendor domains or URLs to inspect, e.g. ["apify.com", "linear.app", "canva.com"].',
        },
        mode: {
          type: 'string',
          enum: ['audit', 'monitor'],
          description: 'Execution mode: "audit" returns complete Trust Center, cert, IAM, and AI subprocessor posture; "monitor" emits only real changes against snapshots.',
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
    description:
      '3-in-1 B2B lead enrichment resolver: pass company names, domains, work emails, or an upstream Apify datasetId and get verified official domain, websiteUrl, LinkedIn company/school URL (rejects personal /in/ noise), prioritized corporate role emails (sales@, contact@, hello@), WhatsApp links, phones, and 6 social links ($2.50/1K enriched; $0 for misses, parked domains, or SSRF inputs).',
    inputSchema: {
      type: 'object',
      properties: {
        inputs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Up to 2,000 company names, domains, URLs, or work emails, e.g. ["Stripe", "Linear", "canva.com"]. Optional when datasetId is provided.',
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
    description:
      'Query official South Korea MFDS (Ministry of Food and Drug Safety / 식약처) cosmetic recall notices and administrative suspension records. Filter by companyName, productName, Korean business registration number (businessNumber), or recallOrderDate range. Returns structured JSON with product name, manufacturer, business registration number, violation details, recall order date, and disposal status ($3/1K records). Built for K-beauty importers, retail marketplaces, and regulatory compliance checks.',
    inputSchema: {
      type: 'object',
      properties: {
        companyName: {
          type: 'string',
          description: 'Optional partial-match filter for the manufacturer or responsible company name (Korean or English), e.g. "코스맥스".',
        },
        productName: {
          type: 'string',
          description: 'Optional partial-match filter for the cosmetic product name, e.g. "선크림".',
        },
        businessNumber: {
          type: 'string',
          description: 'Optional Korean 10-digit business registration number (hyphens ignored), e.g. "1234567890".',
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
    description:
      'Search 219,000+ official South Korea MFDS functional cosmetics (기능성화장품) reported and reviewed filings. Filter by Korean product keywords, brand or responsible distributor, OEM/ODM manufacturer (such as Cosmax or Kolmar), efficacy claims (whitening, anti-wrinkle, SPF/PA UV protection, hair-loss), or exact itemCode. Automatically cross-references reviewed base formulas via resolveOemFromReviewed to reveal hidden OEM/ODM makers and active ingredients ($2/1K records).',
    inputSchema: {
      type: 'object',
      properties: {
        datasetType: {
          type: 'string',
          enum: ['both', 'reported', 'reviewed'],
          description: 'Which MFDS functional cosmetic registry to query: "reported" (198k+ market filings), "reviewed" (20k+ base formulas), or "both".',
          default: 'reported',
        },
        productName: {
          type: 'string',
          description: 'Server-side partial-match product name filter; Korean keywords (e.g. "선크림", "세럼", "앰플") run fastest.',
        },
        brandOrDistributor: {
          type: 'string',
          description: 'Partial-match filter for brand owner or responsible distributor company, e.g. "아모레퍼시픽" or "올리브영".',
        },
        oemManufacturer: {
          type: 'string',
          description: 'Partial-match filter for OEM/ODM factory or base-formula owner, e.g. "코스맥스" or "한국콜마".',
        },
        efficacyKeyword: {
          type: 'string',
          description: 'Filter by efficacy claim or English tag: "미백", "주름", "자외선", "탈모", "SPF", "whitening", "anti-wrinkle", "uv-protection", or "hair-loss".',
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
    description:
      'Enrich Instagram, TikTok, and YouTube creator Link-in-Bio pages (Linktree, Stan.store, Bio.site, Beacons, Komi, Hoo.be, Bento, Lnk.bio, Carrd, etc.) into outreach-ready leads. Extracts prioritized business & talent agency emails, phones/WhatsApp, normalized social links across 14 networks, monetization link classification (affiliate storefronts, brand deals, digital products, newsletters, media kits), promo codes, and a deterministic 0-100 Creator Readiness Score. Supports 1-hop SSRF-safe deep contact following and Instagram/TikTok/YouTube datasetId chaining ($2.50/1K enriched; $0 for 404/WAF/filtered misses).',
    inputSchema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of creator Link-in-Bio URLs or handles, e.g. ["https://linktr.ee/halleykmcg", "https://stan.store/stan"]. Optional when datasetId is provided.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional Apify Dataset ID from an upstream Instagram, TikTok, or YouTube scraper (auto-detects externalUrl, bioLink, biography, channelLinks while preserving upstreamHandle and upstreamFollowers).',
        },
        enableDeepContactFollow: {
          type: 'boolean',
          description: 'When no agency/business email is on the bio page, follow up to 2 creator personal website, Contact, or Media Kit links (1-hop, SSRF-safe).',
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
    description:
      'Find every boutique, specialty shop, and retail stockist carrying a competitor brand AND enrich each unique retailer website with prioritized buyer/wholesale emails (wholesale@, buyers@, sales@, info@), Instagram, LinkedIn, Contact Form URLs, independent-boutique vs national-chain classification, and a 0-100 Outreach Readiness Score in one zero-proxy run ($5/1K stores; $0 for filtered national chains, no-email skips, or empty sites). Paste brand homepages or store locator URLs.',
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

const server = new Server(
  {
    name: 'apify-b2b-ecom-mcp-server',
    version: '1.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
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
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args ?? {}),
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
