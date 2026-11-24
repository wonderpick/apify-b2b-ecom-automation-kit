/**
 * Shared MCP Catalog (v2.5.0) — 11 verb_noun External-Intelligence Tools + 9 One-Click Prompts
 * Used by the stdio/Docker MCP server (`src/mcp-server.mjs`) and Cloudflare Remote `/mcp`.
 */

export const SERVER_NAME = 'apify-b2b-ecom-mcp-server';
export const SERVER_VERSION = '2.5.0';

function makeOutputSchema(itemDescription, itemProperties) {
  return {
    type: 'object',
    properties: {
      actor: {
        type: 'string',
        description: 'Apify Actor slug that produced these records.',
      },
      count: {
        type: 'integer',
        minimum: 0,
        description: 'Total number of records returned in items.',
      },
      items: {
        type: 'array',
        description: itemDescription,
        items: {
          type: 'object',
          properties: itemProperties,
          additionalProperties: true,
        },
      },
    },
    required: ['actor', 'count', 'items'],
  };
}

export const TOOLS = [
  {
    name: 'extract_brand_store_stockists',
    actorSlug: 'maitreya_buddha~brand-store-locator-stockist-email-enricher',
    annotations: {
      title: 'Extract Brand Store Stockists & Buyer Emails',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Extract retail stockists carrying external brands and enrich each store domain with verified buyer emails and DNS deliverability checks. Supply at least one source (urls, rawCsvOrUrls, datasetId, or sourceRunId); omitting all sources returns 0 items at $0. Optional filters (onlyIndependentStores, onlyWithEmail, minReadinessScore) gate billing before charge, while maxStoresPerBrand (1-5,000) bounds fan-out per brand. Bills $5/1K stores ($0 when empty or filtered), runs ~15-60s per brand with per-store failure isolation in OUTPUT_SUMMARY, and optionally posts to webhookUrl. Use for wholesale retail prospecting; do not use for editing your own store map or enriching corporate B2B companies (use enrich_b2b_company_leads instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        urls: {
          type: 'array',
          minItems: 1,
          maxItems: 50,
          items: { type: 'string' },
          description:
            'Competitor brand homepages or store locator URLs, e.g. ["https://fellowproducts.com", "https://brooklynhotdogcompany.com"]. Optional when rawCsvOrUrls, datasetId, or sourceRunId is provided.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description: 'Optional pasted CSV/TSV rows or newline-separated brand/locator URLs.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional upstream Apify Dataset ID or URL containing brand or store locator URLs.',
        },
        sourceRunId: {
          type: 'string',
          description: 'Optional upstream Apify Run ID or URL; automatically resolves defaultDatasetId.',
        },
        enrichEmails: {
          type: 'boolean',
          description:
            'Visit each unique retailer website (plus /wholesale and /contact) to extract buyer emails and social links.',
          default: true,
        },
        enableDnsEmailCheck: {
          type: 'boolean',
          description: 'Run out-of-band 11-query DNS MX/SPF/DMARC/BIMI checks ($0) to output deliverabilityGrade (A-F) and emailProvider.',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill only stores where at least one valid email is found ($0 otherwise).',
          default: false,
        },
        onlyIndependentStores: {
          type: 'boolean',
          description:
            'When true, skip national chains (Target, Walmart, Sephora, Whole Foods, etc.) at $0 and return independent boutiques and regional shops.',
          default: false,
        },
        maxStoresPerBrand: {
          type: 'integer',
          minimum: 1,
          maximum: 5000,
          description: 'Maximum stockist locations to return per brand (1-5,000).',
          default: 100,
        },
        countryFilter: {
          type: 'string',
          description: 'Optional country code or name filter, e.g. "US", "GB", "CA", "AU", "DE", or "KR".',
        },
        minReadinessScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Minimum outreachReadinessScore (0-100) required to save and bill ($0 for filtered stores).',
          default: 0,
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat CRM column mapping preset while preserving standard fields.',
          default: 'default',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL notified with run metrics and top stockists on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Extracted retail stockist locations enriched with buyer contacts.', {
      brandUrl: { type: 'string', description: 'Source competitor brand URL.' },
      storeName: { type: 'string', description: 'Physical retail store or boutique name.' },
      city: { type: 'string', description: 'Store city.' },
      country: { type: 'string', description: 'Store country code or name.' },
      retailerType: { type: 'string', description: 'Classification such as independent_boutique or national_chain.' },
      website: { type: 'string', description: 'Retailer website URL.' },
      primaryEmail: { type: 'string', description: 'Highest-priority buyer or wholesale email.' },
      inboxType: { type: 'string', description: 'Inbox risk classification (b2b_direct, general, cs_ticket_queue, or none).' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC/BIMI deliverability grade (A-F).' },
      linkedinDecisionMakerSearchUrl: { type: 'string', description: '1-click LinkedIn buyer decision-maker search URL.' },
      outreachReadinessScore: { type: 'integer', description: '0-100 wholesale outreach readiness score.' },
    }),
  },
  {
    name: 'monitor_shopify_competitor_deltas',
    actorSlug: 'maitreya_buddha~shopify-competitor-delta-monitor',
    annotations: {
      title: 'Monitor Shopify Competitor Price & Restock Deltas',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Monitor up to 50 external Shopify competitor stores (up to 2,500 products each) for price, stock, catalog, and MAP changes against persisted Key-Value Store snapshots. Requires storeUrls; minPriceChangePercent and mapFloorPrices drive CRITICAL alerts, while stateStoreName isolates snapshots per workflow (avoid concurrent runs on the same stateStoreName to prevent race overwrites). Persists snapshot state and optional webhookUrl alerts (explaining readOnlyHint=false), isolating per-store or webhook failures in OUTPUT_SUMMARY without aborting the run. Bills $2/1K real deltas ($0 on baseline or unchanged runs). Use for recurring Shopify SKU tracking; do not use for editing your Shopify admin, Meta ad audits (use audit_meta_ads_advertisers), or retail stockists (use extract_brand_store_stockists).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        storeUrls: {
          type: 'array',
          minItems: 1,
          maxItems: 50,
          items: { type: 'string' },
          description: 'List of 1 to 50 external Shopify store or collection URLs, e.g. ["https://www.allbirds.com"].',
        },
        stateStoreName: {
          type: 'string',
          description:
            'Named Apify Key-Value Store (alphanumeric and hyphens only) used to persist snapshots between runs.',
          default: 'shopify-delta-monitor-state',
        },
        maxProductsPerStore: {
          type: 'integer',
          minimum: 50,
          maximum: 2500,
          description: 'Maximum products to fetch per store URL (50-2,500, paginated at 250/page).',
          default: 500,
        },
        minPriceChangePercent: {
          type: 'number',
          minimum: 0,
          maximum: 100,
          description: 'Minimum percentage change threshold (0-100) before emitting price_drop or price_increase.',
          default: 1.0,
        },
        eventTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'new_product',
              'removed_product',
              'price_drop',
              'price_increase',
              'discount_started',
              'discount_ended',
              'out_of_stock',
              'restocked',
            ],
          },
          description: 'Optional subset of catalog or pricing event types to emit.',
          default: [
            'new_product',
            'removed_product',
            'price_drop',
            'price_increase',
            'discount_started',
            'discount_ended',
            'out_of_stock',
            'restocked',
          ],
        },
        mapThresholds: {
          type: 'object',
          additionalProperties: { type: 'number' },
          description:
            'Optional map of SKU or product handle to Minimum Advertised Price (flags mapViolation: true and severity: CRITICAL if below threshold).',
        },
        emitBaselineSummary: {
          type: 'boolean',
          description: 'Emit 1 zero-cost baseline_initialized summary on the first snapshot of each store.',
          default: true,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional Slack, Discord, or n8n webhook URL notified when at least 1 delta occurs.',
        },
      },
      required: ['storeUrls'],
    },
    outputSchema: makeOutputSchema('Detected Shopify competitor pricing, inventory, or catalog delta events.', {
      store: { type: 'string', description: 'Monitored Shopify store URL.' },
      eventType: { type: 'string', description: 'Delta type (price_drop, restocked, out_of_stock, etc.).' },
      severity: { type: 'string', description: 'Action priority tier: CRITICAL, INVENTORY, or CATALOG.' },
      title: { type: 'string', description: 'Product title.' },
      oldPrice: { type: 'number', description: 'Previous variant price.' },
      newPrice: { type: 'number', description: 'Current variant price.' },
      priceChangePercent: { type: 'number', description: 'Percentage price change.' },
      mapViolation: { type: 'boolean', description: 'True if price fell below configured MAP threshold.' },
    }),
  },
  {
    name: 'audit_saas_trust_center',
    actorSlug: 'maitreya_buddha~saas-trust-center-soc2-monitor',
    annotations: {
      title: 'Audit SaaS Trust Center, SOC 2 & AI Subprocessors',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Audit or monitor up to 500 external SaaS vendor Trust Centers for security certifications, DNS IAM/SSO, and third-party/AI subprocessors. Requires domains (empty input returns 0 items at $0); mode="audit" runs statelessly, while mode="monitor" diffs against stateStoreName snapshots and emitBaselineSummary controls first-run output. Persists monitor snapshots and optional webhookUrl alerts (explaining readOnlyHint=false), isolating per-domain 403/timeout failures in OUTPUT_SUMMARY. Bills $5/1K audited domains or real changes ($0 when unchanged or WAF-blocked). Use for TPRM vendor risk or finding SaaS vendors lacking SOC 2; do not use for editing internal GRC workspaces or local SMB website audits (use audit_local_b2b_websites instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        domains: {
          type: 'array',
          minItems: 1,
          maxItems: 500,
          items: { type: 'string' },
          description: 'List of 1 to 500 external SaaS vendor or prospect domains, e.g. ["apify.com", "linear.app"].',
        },
        mode: {
          type: 'string',
          enum: ['audit', 'monitor'],
          description:
            '"audit" returns complete security posture immediately; "monitor" compares against snapshots and emits only real changes ($0 unchanged).',
          default: 'audit',
        },
        stateStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store used to persist baseline snapshots in monitor mode.',
          default: 'saas-trust-monitor-state',
        },
        checkSubprocessors: {
          type: 'boolean',
          description: 'Inspect /subprocessors pages and Trust Center content for third-party and AI vendors.',
          default: true,
        },
        checkDnsIam: {
          type: 'boolean',
          description: 'Query DNS CNAME/TXT/MX records to verify Trust Center hosting and SSO/IAM providers.',
          default: true,
        },
        concurrency: {
          type: 'integer',
          minimum: 1,
          maximum: 15,
          description: 'Concurrent domains to check (1-15).',
          default: 5,
        },
        emitBaselineSummary: {
          type: 'boolean',
          description: 'In monitor mode, emit 1 zero-cost baseline_initialized summary record per domain on its first run.',
          default: true,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional Slack, Discord, or n8n webhook URL notified in monitor mode when compliance or AI subprocessor changes occur.',
        },
      },
      required: ['domains'],
    },
    outputSchema: makeOutputSchema('Audited SaaS vendor Trust Center compliance and AI subprocessor records.', {
      domain: { type: 'string', description: 'Audited SaaS vendor domain.' },
      trustCenterUrl: { type: 'string', description: 'Discovered Trust Center URL.' },
      trustCenterPlatform: { type: 'string', description: 'Detected platform (Vanta, Drata, SafeBase, etc.).' },
      complianceScore: { type: 'integer', description: '0-100 deterministic security posture score.' },
      missingSoc2Lead: { type: 'boolean', description: 'True when vendor lacks verified SOC 2 certification.' },
      certifications: { type: 'array', items: { type: 'string' }, description: 'Detected compliance certifications.' },
      aiSubprocessors: { type: 'array', items: { type: 'string' }, description: 'Detected AI subprocessors.' },
    }),
  },
  {
    name: 'enrich_b2b_company_leads',
    actorSlug: 'maitreya_buddha~b2b-company-domain-linkedin-enricher',
    annotations: {
      title: 'Enrich B2B Company Domains, LinkedIn & Emails',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Resolve company names, domains, or work emails into verified official websites, LinkedIn company pages, business emails, and DNS deliverability grades. Supply at least one source (inputs, rawCsvOrUrls, datasetId, or sourceRunId; omitting all returns 0 items at $0); datasetField selects the upstream column, minConfidence sets name-match strictness, and onlyWithEmail or includeUnresolved=false drops misses before billing. Streams in 50-item chunks (~10-45s per 100 companies) with per-company error isolation in OUTPUT_SUMMARY, optional webhookUrl delivery, and $2.50/1K enriched billing ($0 for parked, unresolved, or filtered skips). Use for B2B corporate enrichment; do not use for creator link-in-bio pages (use enrich_creator_bio_leads instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        inputs: {
          type: 'array',
          minItems: 1,
          maxItems: 2000,
          items: { type: 'string' },
          description:
            'Up to 2,000 company names, domains, URLs, or work emails, e.g. ["Stripe", "Linear", "apify.com"]. Optional when rawCsvOrUrls, datasetId, or sourceRunId is provided.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description: 'Optional pasted CSV/TSV rows or newline-separated company names, domains, URLs, or work emails.',
        },
        datasetId: {
          type: 'string',
          description:
            'Optional upstream Apify Dataset ID or URL (auto-detects website, domain, companyName, name, or email fields).',
        },
        sourceRunId: {
          type: 'string',
          description: 'Optional upstream Apify Run ID or URL; automatically resolves defaultDatasetId.',
        },
        datasetField: {
          type: 'string',
          description: 'Optional explicit field name to read from datasetId/sourceRunId items when chaining.',
        },
        enrichContactPages: {
          type: 'boolean',
          description: 'Follow up to 2 internal /contact or /about pages when the homepage lacks emails or LinkedIn.',
          default: true,
        },
        enableDnsEmailCheck: {
          type: 'boolean',
          description: 'Run out-of-band 11-query DNS MX/SPF/DMARC/BIMI checks ($0) to output deliverabilityGrade (A-F) and emailProvider.',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill only companies where at least 1 verified email is found ($0 otherwise).',
          default: false,
        },
        includeUnresolved: {
          type: 'boolean',
          description: 'Include unresolved/not_found rows in the dataset for auditability (always $0 cost).',
          default: true,
        },
        minConfidence: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Minimum confidence threshold for accepting company-name-to-domain matches.',
          default: 'medium',
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat CRM column mapping preset while preserving standard fields.',
          default: 'default',
        },
        concurrency: {
          type: 'integer',
          minimum: 1,
          maximum: 15,
          description: 'Concurrent domain resolutions (1-15).',
          default: 6,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL notified with run metrics and top leads on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Enriched B2B company lead records.', {
      input: { type: 'string', description: 'Original company name, domain, or email input.' },
      domain: { type: 'string', description: 'Resolved official company domain.' },
      linkedinUrl: { type: 'string', description: 'Verified LinkedIn /company/ URL.' },
      primaryEmail: { type: 'string', description: 'Top prioritized corporate email.' },
      emails: { type: 'array', items: { type: 'string' }, description: 'All discovered corporate emails.' },
      inboxType: { type: 'string', description: 'Inbox risk classification (b2b_direct, general, cs_ticket_queue, or none).' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC/BIMI deliverability grade (A-F).' },
      linkedinDecisionMakerSearchUrl: { type: 'string', description: '1-click LinkedIn decision-maker search URL.' },
      leadQualityScore: { type: 'integer', description: '0-100 B2B lead completeness score.' },
    }),
  },
  {
    name: 'enrich_creator_bio_leads',
    actorSlug: 'maitreya_buddha~creator-link-in-bio-email-enricher',
    annotations: {
      title: 'Enrich Creator Link-in-Bio Emails & Deal Readiness',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Enrich creator Link-in-Bio pages across 15+ bio platforms with agency or business emails, DNS deliverability checks, and sponsorship readiness scores. Supply at least one source (urls, rawCsvOrUrls, datasetId, or sourceRunId; omitting all returns 0 items at $0); enableDeepContactFollow toggles 1-hop personal-site crawling, while onlyWithEmail and minReadinessScore gate billing before charge. Streams up to 50,000 profiles in 50-item chunks at $2.50/1K enriched ($0 on 404, WAF, or filtered skips), isolating per-profile failures in OUTPUT_SUMMARY with optional webhookUrl delivery. Use for influencer and UGC sponsorship outreach; do not use for corporate B2B companies (use enrich_b2b_company_leads instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        urls: {
          type: 'array',
          minItems: 1,
          maxItems: 50000,
          items: { type: 'string' },
          description:
            'List of creator Link-in-Bio URLs or handles, e.g. ["https://linktr.ee/heathertraska", "https://stan.store/stan"]. Optional when rawCsvOrUrls, datasetId, or sourceRunId is provided.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description: 'Optional pasted CSV/TSV rows or newline-separated creator Link-in-Bio URLs.',
        },
        datasetId: {
          type: 'string',
          description:
            'Optional Apify Dataset ID or URL from an upstream Instagram, TikTok, or YouTube scraper (preserves upstreamHandle and upstreamFollowers).',
        },
        sourceRunId: {
          type: 'string',
          description: 'Optional upstream Apify Run ID or URL; automatically resolves defaultDatasetId.',
        },
        enableDeepContactFollow: {
          type: 'boolean',
          description:
            'When no email is on the bio page, follow up to 2 personal website, Contact, or Media Kit links (1-hop, SSRF-safe, Cloudflare decoding included).',
          default: true,
        },
        enableDnsEmailCheck: {
          type: 'boolean',
          description: 'Run out-of-band 11-query DNS MX/SPF/DMARC/BIMI checks ($0) on custom creator/agency email domains.',
          default: true,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill only creators with at least 1 valid email ($0 when missing).',
          default: false,
        },
        minReadinessScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Minimum Creator Brand-Deal Readiness Score (0-100) required to save and bill.',
          default: 0,
        },
        maxProfiles: {
          type: 'integer',
          minimum: 1,
          maximum: 50000,
          description: 'Maximum unique creator bio URLs to process (1-50,000).',
          default: 500,
        },
        maxConcurrency: {
          type: 'integer',
          minimum: 1,
          maximum: 20,
          description: 'Concurrent requests (1-20; capped automatically on 128-256 MB containers).',
          default: 5,
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat CRM column mapping preset while preserving standard fields.',
          default: 'default',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL notified with run metrics and top creators on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Enriched creator outreach profiles from Link-in-Bio pages.', {
      sourceUrl: { type: 'string', description: 'Creator Link-in-Bio URL.' },
      platform: { type: 'string', description: 'Detected bio platform (linktree, stan_store, beacons, etc.).' },
      displayName: { type: 'string', description: 'Creator display name.' },
      primaryEmail: { type: 'string', description: 'Prioritized talent agency or business email.' },
      emails: { type: 'array', items: { type: 'object' }, description: 'All discovered creator contact email entries.' },
      inboxType: { type: 'string', description: 'Inbox risk classification (management_agency, creator_direct, general, cs_ticket_queue, or none).' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC/BIMI deliverability grade (A-F).' },
      linkedinDecisionMakerSearchUrl: { type: 'string', description: '1-click LinkedIn creator/manager search URL.' },
      creatorReadinessScore: { type: 'integer', description: '0-100 Brand-Deal Readiness Score.' },
    }),
  },
  {
    name: 'search_korea_mfds_recalls',
    actorSlug: 'maitreya_buddha~korea-mfds-cosmetic-recalls',
    annotations: {
      title: 'Search Korea MFDS Cosmetic Recalls & Safety Notices',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Search official South Korea MFDS cosmetic recall and sales-suspension orders in English or Korean. Filter inputs accept English or Korean terms (50+ K-Beauty terms like "sunscreen", "soap", and "Cosmax" auto-translate server-side); omitting all filters returns recent orders up to maxItems (default 100), and onlyActiveRecalls excludes lifted orders before billing. Queries the live MFDS public API (~2-10s) with automatic retries on transient gateway errors and bills $3/1K matches ($0 if none). Use for K-Beauty import safety and recall screening; do not use for US FDA/EU recalls or functional OEM factory discovery (use search_korea_mfds_oem_filings instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        companyName: {
          type: 'string',
          description: 'Optional brand or manufacturer filter in English or Korean, e.g. "Cosmax", "Cowell", or "코스맥스".',
        },
        productName: {
          type: 'string',
          description: 'Optional product keyword in English or Korean, e.g. "sunscreen", "soap", "lip balm", or "선크림".',
        },
        onlyActiveRecalls: {
          type: 'boolean',
          description: 'When true, return and bill only currently active recall orders (hiding expired notices at $0).',
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
          minimum: 1,
          maximum: 1000,
          description: 'Maximum recall records to return (1-1,000).',
          default: 50,
        },
      },
    },
    outputSchema: makeOutputSchema('Official South Korea MFDS cosmetic recall and suspension notices.', {
      productName: { type: 'string', description: 'Recalled cosmetic product name.' },
      companyName: { type: 'string', description: 'Responsible brand or manufacturer.' },
      isActiveRecall: { type: 'boolean', description: 'True if the recall order is currently active.' },
      lotNumber: { type: 'string', description: 'Affected batch or lot number.' },
      recallReason: { type: 'string', description: 'Official MFDS reason for recall or suspension.' },
      recallOrderDate: { type: 'string', description: 'Recall order date (YYYY-MM-DD).' },
    }),
  },
  {
    name: 'search_korea_mfds_oem_filings',
    actorSlug: 'maitreya_buddha~korea-mfds-functional-cosmetics-oem',
    annotations: {
      title: 'Search Korea MFDS Functional Cosmetics & OEM Factories',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Search 219,000+ official South Korea MFDS functional cosmetic filings in English or Korean to uncover Korean OEM/ODM factories and functional claims. Filter inputs accept English or Korean (common terms like "sunscreen", "Cosmax", "Kolmar" auto-bridge; unmapped English falls back to raw substring match), datasetType selects reported/reviewed/both registries, resolveOemFromReviewed joins reviewed base formulas to expose hidden factories, and maxItems/maxPagesToScan cap scan volume. Queries the live MFDS API (~5-20s; slower when resolveOemFromReviewed joins formulas) with transient retries and bills $2/1K records ($0 if empty). Use for K-Beauty OEM sourcing and R&D; do not use for recall checks (use search_korea_mfds_recalls instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        datasetType: {
          type: 'string',
          enum: ['both', 'reported', 'reviewed'],
          description:
            'Which MFDS registry to query: "reported" (198k+ brand filings), "reviewed" (20k+ OEM base formulas), or "both".',
          default: 'reported',
        },
        productName: {
          type: 'string',
          description:
            'Product keyword in English or Korean (e.g. "sunscreen", "retinol cream", "serum", "선크림") — English auto-translates server-side.',
        },
        brandOrDistributor: {
          type: 'string',
          description:
            'Brand or responsible seller in English or Korean, e.g. "Amorepacific", "Olive Young", "Medicube", or "아모레퍼시픽".',
        },
        oemManufacturer: {
          type: 'string',
          description: 'OEM/ODM factory in English or Korean, e.g. "Cosmax", "Kolmar", "Cosmecca", or "코스맥스".',
        },
        efficacyKeyword: {
          type: 'string',
          description:
            'Efficacy claim filter in English or Korean: "whitening", "anti-wrinkle", "uv-protection", "SPF", "hair-loss", "미백", "주름".',
        },
        itemCode: {
          type: 'string',
          description: 'Exact MFDS ITEM_SEQ or COSMETIC_REPORT_SEQ identifier for single-product lookup.',
        },
        resolveOemFromReviewed: {
          type: 'boolean',
          description:
            'Query linked reviewed base formulas automatically to reveal hidden OEM/ODM factories when missing on reported filings.',
          default: true,
        },
        maxItems: {
          type: 'integer',
          minimum: 1,
          maximum: 1000,
          description: 'Maximum cosmetic records to return (1-1,000).',
          default: 50,
        },
      },
    },
    outputSchema: makeOutputSchema('Official South Korea MFDS functional cosmetic filings and OEM factory records.', {
      productName: { type: 'string', description: 'Registered functional cosmetic product name.' },
      brandOrDistributor: { type: 'string', description: 'Responsible brand or distributor.' },
      oemManufacturer: { type: 'string', description: 'Actual Korean OEM/ODM manufacturing factory.' },
      spf: { type: 'string', description: 'SPF sun protection value if applicable.' },
      pa: { type: 'string', description: 'PA UV-A rating if applicable.' },
      functionalClaims: { type: 'array', items: { type: 'string' }, description: 'Normalized English functional claims.' },
    }),
  },
  {
    name: 'audit_local_b2b_websites',
    actorSlug: 'maitreya_buddha~local-b2b-website-audit-email-pitch-finder',
    annotations: {
      title: 'Audit Local B2B Websites, Owner Emails & Cold Pitches',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Audit local SMB websites for technical, SEO, pixel, and DNS deliverability weaknesses, then extract owner emails and factual cold-pitch copy. Supply at least one source (websiteUrls, rawCsvOrUrls, datasetId + datasetField, sourceRunId, or presetChambers; omitting all returns 0 items at $0); agencyPreset tailors scoring and copy, dedupStoreName persists 16-shard KV snapshots for skip_seen or watch_diff modes, and onlyWithEmail/onlyWithWeakness/minPitchScore filter before billing. Persists KV dedup shards and optional webhookUrl payloads (explaining readOnlyHint=false), isolates per-site WAF/timeout errors in OUTPUT_SUMMARY, and bills $4.50/1K leads ($0 on WAF, filtered misses, or skip_seen repeats). Use for local agency prospecting; do not use for SaaS SOC 2 audits (use audit_saas_trust_center) or Meta/DTC ad audits (use audit_meta_ads_advertisers).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        websiteUrls: {
          type: 'array',
          minItems: 1,
          maxItems: 2000,
          items: { type: 'string' },
          description: 'Optional list of up to 2,000 local business website URLs to audit, e.g. ["https://ddofoods.com"]. Optional when rawCsvOrUrls, datasetId, sourceRunId, or presetChambers is provided.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description: 'Optional pasted CSV, TSV spreadsheet rows, or newline-separated company website URLs/domains.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional upstream Apify Dataset ID or URL (e.g. from Google Maps Scraper) to chain leads directly, preserving no_website VIP leads.',
        },
        sourceRunId: {
          type: 'string',
          description: 'Optional upstream Apify Run ID or Console URL; automatically resolves defaultDatasetId and streams leads.',
        },
        datasetField: {
          type: 'string',
          description: 'Optional explicit field name to read from datasetId/sourceRunId items when chaining non-standard datasets.',
        },
        presetChambers: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'phoenix_az',
              'scottsdale_az',
              'chandler_az',
              'gilbert_az',
              'fort_worth_tx',
              'denton_tx',
              'lubbock_tx',
              'beverly_hills_ca',
              'anaheim_ca',
              'fresno_ca',
              'tacoma_wa',
              'salem_or',
              'anchorage_ak',
            ],
          },
          description: 'Optional verified US Chamber of Commerce city presets to auto-collect paying local businesses.',
        },
        chamberDirectoryUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional custom ChamberMaster / GrowthZone directory URLs.',
        },
        chamberCategoryKeyword: {
          type: 'string',
          description: 'Optional category keyword filter for Chamber directories (e.g. "dental", "plumbing", "restaurant", "roofing").',
        },
        agencyPreset: {
          type: 'string',
          enum: ['all', 'web_design', 'local_seo', 'paid_ads', 'ai_chatbot_booking', 'deliverability_agency'],
          description: 'Agency service vertical used to weight pitchPriorityScore and tailor coldEmailSubject, coldEmailIcebreaker, and linkedInDm.',
          default: 'all',
        },
        customAgencyOffer: {
          type: 'string',
          description: 'Optional 1-line agency value proposition deterministically woven into coldEmailBody ($0 AI).',
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat CRM column mapping preset (default keeps standard structured schema).',
          default: 'default',
        },
        dedupStoreName: {
          type: 'string',
          description: 'Optional Apify Named Key-Value Store (16-shard compact snapshots) for weekly skip_seen ($0 repeats) or watch_diff buying-trigger tracking.',
        },
        dedupMode: {
          type: 'string',
          enum: ['skip_seen', 'watch_diff'],
          description: 'When dedupStoreName is set: skip_seen skips previously audited leads at $0; watch_diff detects website/DNS buying triggers.',
          default: 'skip_seen',
        },
        enableContactPageFollow: {
          type: 'boolean',
          description: 'Follow up to 1 internal /contact, /about, or /team page when the homepage lacks an email.',
          default: true,
        },
        enableDnsEmailCheck: {
          type: 'boolean',
          description: 'Run out-of-band 11-query DNS MX/SPF/DMARC/BIMI checks ($0) to output deliverabilityGrade (A-F) and emailProvider.',
          default: true,
        },
        dnsFallbackOnBlocked: {
          type: 'boolean',
          description: 'Default false skips WAF-blocked (403/429) sites at $0. Set true to run out-of-band DNS-only audit on live blocked domains.',
          default: false,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill only leads where an email is found ($0 otherwise).',
          default: false,
        },
        onlyWithWeakness: {
          type: 'boolean',
          description: 'When true, skip polished websites with 0 detected weaknesses at $0.',
          default: false,
        },
        minPitchScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Minimum 0-100 pitchPriorityScore required to save and bill ($0 below threshold).',
          default: 0,
        },
        maxItems: {
          type: 'integer',
          minimum: 1,
          maximum: 2000,
          description: 'Maximum total leads to audit and save (1-2,000).',
          default: 100,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTP/HTTPS webhook URL to receive audited leads JSON on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Audited local B2B business leads with 8-point website weaknesses, 11-query DNS deliverability grades, owner emails, and custom cold pitches.', {
      companyName: { type: 'string', description: 'Business or company name.' },
      websiteUrl: { type: 'string', description: 'Audited website URL (or null if no_website).' },
      leadPriority: { type: 'string', description: 'Deterministic priority tier: VIP_HOT, WARM, or NURTURE.' },
      siteStatus: { type: 'string', description: 'ok, slow, no_website, unreachable, http_error, bot_protected, or bot_protected_dns_audited.' },
      primaryEmail: { type: 'string', description: 'Prioritized owner or business email (null when none or quarantined).' },
      inboxType: { type: 'string', description: 'Inbox risk classification: b2b_direct, general, cs_ticket_queue, or none.' },
      outreachStatus: { type: 'string', description: 'Copy safety gate: ready or manual_review_required.' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC/BIMI deliverability grade (A-F).' },
      linkedinDecisionMakerSearchUrl: { type: 'string', description: '1-click LinkedIn owner/decision-maker search URL.' },
      cmsPlatform: { type: 'string', description: 'Detected CMS (WordPress, Wix, Squarespace, Shopify, etc.).' },
      detectedPainPoints: { type: 'array', items: { type: 'string' }, description: 'Factual detected website weaknesses.' },
      pitchPriorityScore: { type: 'integer', description: '0-100 agency pitch priority score.' },
      coldEmailSubject: { type: 'string', description: 'Factual personalized cold-email subject line.' },
      coldEmailIcebreaker: { type: 'string', description: 'Zero-hallucination personalized opening sentence.' },
    }),
  },
  {
    name: 'audit_meta_ads_advertisers',
    actorSlug: 'maitreya_buddha~meta-ads-advertiser-leak-audit-email-enricher',
    annotations: {
      title: 'Audit Meta Ads Advertisers for Leaks, Stack & Emails',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Deduplicate Meta Ad Library datasets or DTC ad landing URLs into audited advertiser brands with tech-stack detection, DNS deliverability checks, verified emails, and outreach copy. Supply at least one source (landingPageUrls, rawCsvOrUrls, sourceDatasetId, or sourceRunId; omitting all returns 0 items at $0); dedupStoreName persists 16-shard KV snapshots for skip_seen ($0 repeats) or weekly watch_diff triggers, while onlyWithEmail, onlyWithActiveLeaks, and minLeakScore filter before billing. Persists KV dedup snapshots and optional webhookUrl batches (explaining readOnlyHint=false), runs ~15-60s per 20 brands with per-brand WAF/403/timeout isolation in OUTPUT_SUMMARY, and bills $4.50/1K unique brands ($0 on marketplaces, WAF skips, repeats, or filtered misses). Use for Meta Ad Library and DTC advertiser audits; do not use for local SMB audits (use audit_local_b2b_websites) or Shopify SKU price tracking (use monitor_shopify_competitor_deltas).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        landingPageUrls: {
          type: 'array',
          minItems: 1,
          maxItems: 2000,
          items: { type: 'string' },
          description:
            'Up to 2,000 ad landing URLs, bare DTC domains, l.facebook.com links, or shorteners/bio links (bit.ly, linktr.ee). Optional when sourceDatasetId, sourceRunId, or rawCsvOrUrls is provided.',
        },
        sourceDatasetId: {
          type: 'string',
          description:
            'Optional upstream Apify Dataset ID or URL from any Meta/Social Ad Library scraper (streams in 250-item pages and aggregates active ads per brand).',
        },
        sourceRunId: {
          type: 'string',
          description:
            'Optional upstream Apify Run ID or Console URL; automatically resolves defaultDatasetId and streams records.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description:
            'Optional pasted CSV, TSV/Google Sheets rows, or newline-separated URLs/domains.',
        },
        agencyPreset: {
          type: 'string',
          enum: [
            'auto_best_fit',
            'tiktok_google_ads',
            'tiktok_ads_agency',
            'google_ads_agency',
            'email_sms_retention',
            'cro_landing_page',
            'ugc_creative',
            'deliverability_agency',
          ],
          description: 'Agency service vertical used to score leaks and tailor coldEmailSubject, coldEmailOpener, and linkedInDm.',
          default: 'auto_best_fit',
        },
        customAgencyOffer: {
          type: 'string',
          description: 'Optional 1-line agency value proposition deterministically woven into outreach copy ($0 AI).',
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional CRM flat column mapping preset (default keeps standard structured schema).',
          default: 'default',
        },
        dedupStoreName: {
          type: 'string',
          description:
            'Optional Apify Named Key-Value Store (16-shard compact snapshots) for weekly skip_seen ($0 repeats) or watch_diff buying-trigger tracking.',
        },
        dedupMode: {
          type: 'string',
          enum: ['skip_seen', 'watch_diff'],
          description: 'When dedupStoreName is set: skip_seen skips previously audited brands at $0; watch_diff detects ad/ESP/pixel/404/DMARC changes.',
          default: 'skip_seen',
        },
        enableDnsEmailCheck: {
          type: 'boolean',
          description: 'Run out-of-band 11-query DNS MX/SPF/DMARC/BIMI checks ($0) to output deliverabilityGrade (A-F) and emailProvider.',
          default: true,
        },
        dnsFallbackOnBlocked: {
          type: 'boolean',
          description: 'Default false skips WAF-blocked (403/429) brands at $0. Set true to run out-of-band DNS-only audit on live blocked domains.',
          default: false,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'When true, save and bill only advertisers where at least 1 brand email is recovered ($0 otherwise).',
          default: false,
        },
        onlyWithActiveLeaks: {
          type: 'boolean',
          description: 'When true, skip leak-free advertisers at $0.',
          default: false,
        },
        minLeakScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Optional minimum 0-100 leakScore threshold ($0 below threshold).',
          default: 0,
        },
        maxBrands: {
          type: 'integer',
          minimum: 1,
          maximum: 2000,
          description: 'Maximum unique deduplicated brand domains to audit (1-2,000).',
          default: 100,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTP/HTTPS webhook URL to receive audited advertiser JSON on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Audited DTC advertiser leads with 4-layer tech stack, live 404/OOS/DMARC leaks, buyer fit, inbox safety, and outreach copy.', {
      brandName: { type: 'string', description: 'Resolved brand name.' },
      brandDomain: { type: 'string', description: 'Canonical deduplicated brand domain.' },
      leadPriority: { type: 'string', description: 'Deterministic priority tier: VIP_HOT, WARM, or NURTURE.' },
      buyerFitTier: { type: 'string', description: 'Evidence-based maturity tier: Enterprise, Scaling DTC, Growing SMB, Early Stage, or Unknown.' },
      siteStatus: { type: 'string', description: 'Landing page status (ok, slow, landing_404, landing_5xx, parked_or_locked, headless_spa, headless_ssr_hydrated, bot_protected, bot_protected_dns_audited, or unreachable).' },
      leakScore: { type: 'integer', description: '0-100 ad-spend and deliverability leak score.' },
      expansionScore: { type: 'integer', description: '0-100 Tier-2 growth expansion score for healthy brands.' },
      primaryEmail: { type: 'string', description: 'Highest-priority verified brand email (null when none or quarantined).' },
      inboxType: { type: 'string', description: 'Inbox risk classification: b2b_direct, general, cs_ticket_queue, or none.' },
      outreachStatus: { type: 'string', description: 'Copy safety gate: ready or manual_review_required (pair with primaryEmail, inboxType, and zeroBounceUnsafe before sending).' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC/BIMI deliverability grade (A-F).' },
      linkedinDecisionMakerSearchUrl: { type: 'string', description: '1-click LinkedIn decision-maker search URL.' },
      detectedLeaksSummary: { type: 'string', description: 'Plain-English summary of verified ad-spend or deliverability leaks.' },
      coldEmailSubject: { type: 'string', description: 'Zero-hallucination evidence-based subject line.' },
      coldEmailOpener: { type: 'string', description: 'Zero-hallucination personalized opening sentence.' },
    }),
  },
  {
    name: 'monitor_ats_hiring_intent',
    actorSlug: 'maitreya_buddha~ats-jobs-hiring-intent-tech-stack-monitor',
    annotations: {
      title: 'Monitor ATS Jobs, Hiring Intent & 70+ Tech-Stack Signals',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Monitor live ATS job openings, 45-120d hard-to-fill aging, and 70+ tech-stack buying signals across 13 ATS engines and 7 global feeds via a 71,900+ board directory and 64-shard live discovery router. Supply targets, presetPacks, rawCsvOrUrls, datasetId, or sourceRunId, OR leave targets empty with titleKeywords/techStackFilter to auto-trigger global live discovery and Reverse-Pivot; omitting both targets and filters returns 0 items at $0. Bills $0.99/1K saved rows ($0 filtered or unchanged), runs ~5-30s isolating per-board failures in OUTPUT_SUMMARY, and persists optional watch_diff KV snapshots or webhookUrl alerts (explaining readOnlyHint=false). Use for recruiting signals, tech-stack buying intent, or weekly job-board delta tracking; do not use for editing your own ATS or corporate domain/LinkedIn enrichment without job signals (use enrich_b2b_company_leads instead).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        targets: {
          type: 'array',
          maxItems: 500,
          items: { type: 'string' },
          description:
            'Company domains, names, or direct ATS URLs (e.g. ["linear.app", "ramp.com", "nvidia.eightfold.ai"]). Leave empty [] with titleKeywords/techStackFilter for Auto-Global 64-shard + 7-feed discovery.',
        },
        presetPacks: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['ai_llm', 'fintech', 'devtools_cloud', 'enterprise_saas', 'ecommerce_dtc', 'europe_scaleups', 'fortune500_enterprise'],
          },
          description: 'Optional curated live-verified vertical ATS board bundles.',
        },
        rawCsvOrUrls: {
          type: 'string',
          description: 'Optional pasted CSV/TSV rows or newline-separated company domains/ATS URLs.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional upstream Apify Dataset ID or URL containing target company domains.',
        },
        sourceRunId: {
          type: 'string',
          description: 'Optional upstream Apify Run ID or URL; automatically resolves defaultDatasetId.',
        },
        titleKeywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional job keywords (e.g. ["Snowflake", "Account Executive"]). Activates Auto-Global live search when targets is empty.',
        },
        techStackFilter: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional tech-stack tags to require (e.g. ["Rust", "Kubernetes", "Snowflake", "PyTorch"]). Filtered roles are skipped at $0.',
        },
        keywordScope: {
          type: 'string',
          enum: ['title', 'title_and_description'],
          description: 'Match titleKeywords in title only or title + full decoded description.',
          default: 'title',
        },
        outputMode: {
          type: 'string',
          enum: ['jobs', 'companies', 'both'],
          description: 'Emit individual job rows, 1 aggregated hiring-intent dossier per company, or both.',
          default: 'jobs',
        },
        agencyPersona: {
          type: 'string',
          enum: ['all', 'recruiting_agency', 'b2b_saas_sdr', 'dev_shop_agency', 'vc_investor'],
          description: 'Tailors intentScore weighting and deterministic outreach openers ($0 LLM cost).',
          default: 'recruiting_agency',
        },
        onlyHardToFillSweetSpot: {
          type: 'boolean',
          description: 'When true, keep only roles aged 45-120 days ($0 skip otherwise).',
          default: false,
        },
        onlyNewSinceLastRun: {
          type: 'boolean',
          description: '1-click weekly delta mode: skips unchanged seen roles at $0 and emits 7 time-series triggers.',
          default: false,
        },
        dedupStoreName: {
          type: 'string',
          description: 'Optional Named Apify Key-Value Store for 16-shard watch_diff or skip_seen tracking.',
        },
        dedupMode: {
          type: 'string',
          enum: ['watch_diff', 'skip_seen'],
          description: 'watch_diff emits 7 time-series triggers & skips unchanged at $0; skip_seen skips all previously seen IDs at $0.',
          default: 'watch_diff',
        },
        crmExportPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat CRM column mapping preset.',
          default: 'default',
        },
        maxJobsPerCompany: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
          description: 'Maximum matching jobs emitted per company board (1-500).',
          default: 25,
        },
        maxTotalJobs: {
          type: 'integer',
          minimum: 1,
          maximum: 10000,
          description: 'Hard global cap on total billed rows returned (1-10,000).',
          default: 50,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTP/HTTPS webhook URL notified on completion.',
        },
      },
    },
    outputSchema: makeOutputSchema('Live ATS jobs or aggregated company hiring-intent dossiers with tech-stack tags, aging tiers, watch triggers, and outreach copy.', {
      recordType: { type: 'string', description: 'Record type: job or company.' },
      companyName: { type: 'string', description: 'Resolved hiring company name.' },
      atsPlatform: { type: 'string', description: 'Source ATS engine or global feed (greenhouse, ashby, lever, eightfold, smartrecruiters, personio, himalayas, etc.).' },
      title: { type: 'string', description: 'Job title (or top role headline for company dossiers).' },
      location: { type: 'string', description: 'Job location or remote region.' },
      intentScore: { type: 'integer', description: '0-100 persona-weighted hiring-intent score.' },
      hardToFillTier: { type: 'string', description: 'Honest aging bucket: FRESH_0_14D, ACTIVE_15_44D, STUCK_SWEET_SPOT_45_120D, EVERGREEN_120D_PLUS, or UNKNOWN.' },
      daysOpen: { type: 'integer', description: 'Verified days open since initial posting (null if unavailable).' },
      techStackCsv: { type: 'string', description: 'Comma-separated verified tech-stack tags (zero-FP context anchored).' },
      salaryDisplay: { type: 'string', description: 'Formatted disclosed salary range if present.' },
      watchTriggers: { type: 'array', items: { type: 'string' }, description: 'Detected time-series triggers in watch_diff mode.' },
      linkedinHiringManagerSearchUrl: { type: 'string', description: '1-click LinkedIn hiring-manager search URL.' },
      outreachSubject: { type: 'string', description: 'Deterministic persona-ready outreach subject ($0 LLM cost).' },
      outreachOpener: { type: 'string', description: 'Deterministic persona-ready opening sentence ($0 LLM cost).' },
      jobUrl: { type: 'string', description: 'Direct official ATS or source posting URL.' },
    }),
  },
  {
    name: 'audit_app_store_churn_leads',
    actorSlug: 'maitreya_buddha~app-store-google-play-churn-intel-lead-enricher',
    annotations: {
      title: 'Audit App Store & Google Play Churn, ASO & Developer Leads',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Analyze iOS App Store and Google Play apps for silent churn divergence, 14-language review pain clusters, ASO gaps, WAF-resilient ad/MMP stacks, and verified EU-DSA developer contacts in one 128MB run. Supply searchTerms, iosAppIds, androidPackageIds, upstreamItems, or topChartFeed (omitting all defaults to a 3-app demo query), choose app_intelligence or review_stream mode, and optionally enable watchDiff (Named KV snapshots) or webhookUrl alerts (explaining readOnlyHint=false). Optional pre-charge filters (minOpportunityScore, painBucketFilter, switchIntentOnly, onlyWithEmail) and unchanged watchDiff skips cost $0, while per-app WAF or store errors are isolated in OUTPUT_SUMMARY without crashing; bills $5/1K unified apps or $0.50/1K streamed reviews. Use for mobile app churn intelligence, ASO audits, and mobile agency outbound; do not use for Shopify web store tracking (use monitor_shopify_competitor_deltas) or local SMB website audits (use audit_local_b2b_websites).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        mode: {
          type: 'string',
          enum: ['app_intelligence', 'review_stream'],
          description: 'app_intelligence outputs unified iOS+Android app audits ($5/1K); review_stream streams individual reviews up to 10,000/app ($0.50/1K).',
          default: 'app_intelligence',
        },
        searchTerms: {
          type: 'array',
          items: { type: 'string' },
          description: 'Keywords searched simultaneously across iOS App Store and Google Play (e.g. ["invoice maker", "habit tracker"]).',
        },
        iosAppIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Numeric Apple track IDs (e.g. ["570060128"]) or apps.apple.com URLs; auto-matched to Google Play via AASA/assetlinks.',
        },
        androidPackageIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Google Play package IDs (e.g. ["com.duolingo"]) or play.google.com URLs; auto-matched to iOS including cross-script pairs.',
        },
        upstreamItems: {
          type: 'array',
          items: { type: 'object' },
          description: 'Optional structured pipeline items ({ iosAppId, androidPackageId, appUrl, domain, companyName, label }) for zero-permission n8n/Clay/MCP chaining.',
        },
        topChartFeed: {
          type: 'string',
          enum: ['none', 'topfreeapplications', 'toppaidapplications', 'topgrossingapplications', 'googleplaytop'],
          description: 'Optional live App Store or Google Play Top Chart seed feed.',
          default: 'none',
        },
        topChartCategory: {
          type: 'string',
          enum: ['ALL', 'BUSINESS', 'FINANCE', 'PRODUCTIVITY', 'HEALTH_AND_FITNESS', 'EDUCATION', 'SHOPPING', 'LIFESTYLE', 'SOCIAL', 'TOOLS', 'TRAVEL_AND_LOCAL', 'FOOD_AND_DRINK', 'PHOTOGRAPHY'],
          description: 'Commercial category applied when topChartFeed is enabled.',
          default: 'ALL',
        },
        countries: {
          type: 'array',
          items: { type: 'string' },
          description: 'ISO-2 country storefronts to query (e.g. ["us", "de", "jp", "kr"]).',
          default: ['us'],
        },
        autoLocalLanguage: {
          type: 'boolean',
          description: 'Auto-map each country storefront to its native local review language across 35+ countries.',
          default: true,
        },
        starFilter: {
          type: 'string',
          enum: ['all', 'critical_1_2', '1', '2', '3', '4', '5'],
          description: 'Optional review rating filter while preserving unbiased recent churn baselines.',
          default: 'all',
        },
        maxApps: {
          type: 'integer',
          minimum: 1,
          maximum: 200,
          description: 'Maximum unified apps to analyze or scan (1-200).',
          default: 5,
        },
        sampleReviewsPerStore: {
          type: 'integer',
          minimum: 0,
          maximum: 500,
          description: 'Reviews sampled per store in app_intelligence mode at $0 extra review charge (0-500).',
          default: 40,
        },
        maxReviewsPerApp: {
          type: 'integer',
          minimum: 1,
          maximum: 10000,
          description: 'Maximum combined iOS+Android reviews per app in review_stream mode (1-10,000).',
          default: 100,
        },
        includeWebsiteGtmXray: {
          type: 'boolean',
          description: 'Run pure-HTTP gtm.js, 12-subdomain CNAME MMP, DNS TXT, .well-known & app-ads.txt X-Ray.',
          default: true,
        },
        includeDeveloperEmailEnrich: {
          type: 'boolean',
          description: 'Combine EU-DSA trader contacts with 1-hop website contact discovery and MX verification.',
          default: true,
        },
        minOpportunityScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Pre-charge filter: emit only apps with opportunityScore >= threshold ($0 below).',
          default: 0,
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps with a verified developer email ($0 otherwise).',
          default: false,
        },
        switchIntentOnly: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps/reviews showing competitor switch intent ($0 otherwise).',
          default: false,
        },
        outreachPersona: {
          type: 'string',
          enum: ['mobile_agency', 'aso_growth_agency', 'sdk_b2b_sales', 'product_competitor_intel'],
          description: 'Tailors deterministic $0-LLM outreach copy to your agency or sales motion.',
          default: 'aso_growth_agency',
        },
        crmPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat OWASP CSV-safe CRM export preset.',
          default: 'default',
        },
        watchDiff: {
          type: 'boolean',
          description: 'Persist per-app snapshots (10,000-ID ring buffer + 90-run history) to skip unchanged runs at $0.',
          default: false,
        },
        dedupStoreName: {
          type: 'string',
          description: 'Named Key-Value Store used when watchDiff is enabled.',
          default: 'app-store-churn-intel-watch',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL (Slack Block Kit / Discord Embed / Make / n8n).',
        },
      },
    },
    outputSchema: makeOutputSchema('Unified iOS + Google Play app churn intelligence records or streamed reviews.', {
      recordType: { type: 'string', description: 'Record type: app_intelligence or review.' },
      appName: { type: 'string', description: 'Unified mobile application title.' },
      developerName: { type: 'string', description: 'Publisher or developer name.' },
      platformCoverage: { type: 'string', description: 'BOTH, IOS_ONLY, or ANDROID_ONLY.' },
      overallBlendedRating: { type: 'number', description: 'Lifetime blended rating across available stores.' },
      recentReviewsAvg: { type: 'number', description: 'Unbiased recent review rating average.' },
      silentChurnDivergence: { type: 'number', description: 'Recent minus lifetime rating divergence (negative indicates silent churn).' },
      asoMetadataScore: { type: 'integer', description: '0-100 platform-normalized ASO audit score.' },
      topPainBucket: { type: 'string', description: 'Primary review pain category.' },
      opportunityScore: { type: 'integer', description: '0-100 churn & outreach opportunity score.' },
      primaryEmail: { type: 'string', description: 'Prioritized verified developer email (or null).' },
      paidAdSpendVerified: { type: 'boolean', description: 'Whether active paid-UA tags or MMPs were verified.' },
      inAppSdkStack: { type: 'array', items: { type: 'string' }, description: 'Observable ad, MMP, and privacy SDK stack.' },
      outreachSubject: { type: 'string', description: 'Deterministic $0-LLM cold-outreach subject.' },
      outreachOpener: { type: 'string', description: 'Deterministic $0-LLM cold-outreach opener.' },
    }),
  },
];

// Backward-compatible internal alias map for v1.x tool names (never advertised in tools/list)
export const LEGACY_TOOL_ALIASES = {
  brand_store_locator_stockist_email_enricher: 'extract_brand_store_stockists',
  shopify_competitor_delta_monitor: 'monitor_shopify_competitor_deltas',
  saas_trust_center_soc2_monitor: 'audit_saas_trust_center',
  b2b_company_domain_linkedin_enricher: 'enrich_b2b_company_leads',
  creator_link_in_bio_email_enricher: 'enrich_creator_bio_leads',
  korea_mfds_cosmetic_recalls: 'search_korea_mfds_recalls',
  korea_mfds_functional_cosmetics_oem: 'search_korea_mfds_oem_filings',
  local_b2b_website_audit_email_pitch_finder: 'audit_local_b2b_websites',
  meta_ads_advertiser_leak_audit_email_enricher: 'audit_meta_ads_advertisers',
  ats_jobs_hiring_intent_tech_stack_monitor: 'monitor_ats_hiring_intent',
  app_store_google_play_churn_intel_lead_enricher: 'audit_app_store_churn_leads',
};

export const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]));

export function resolveTool(name) {
  const canonical = LEGACY_TOOL_ALIASES[name] || name;
  return TOOL_MAP.get(canonical) || null;
}

export const PROMPTS = [
  {
    name: 'prospect_competitor_retail_stockists',
    title: 'Prospect Competitor Retail Stockists & Buyer Emails',
    description:
      'Extract independent boutiques carrying a competitor brand, skip giant national chains at $0, and build a prioritized wholesale buyer outreach table.',
    arguments: [
      {
        name: 'brandUrl',
        description: 'Competitor brand homepage or store locator URL (e.g. https://fellowproducts.com).',
        required: true,
      },
      {
        name: 'countryFilter',
        description: 'Optional country filter such as US, GB, CA, AU, or KR.',
        required: false,
      },
      {
        name: 'maxStores',
        description: 'Maximum stores to return (default: 50).',
        required: false,
      },
    ],
  },
  {
    name: 'kbeauty_supplier_due_diligence',
    title: 'K-Beauty OEM Factory & MFDS Recall Due Diligence',
    description:
      'Chain South Korea MFDS functional cosmetic filings and official recall notices in one workflow to verify OEM factories, SPF/PA claims, and active recall risks.',
    arguments: [
      {
        name: 'productKeyword',
        description: 'Product or ingredient keyword in English or Korean (e.g. "sunscreen", "retinol cream").',
        required: true,
      },
      {
        name: 'manufacturerOrBrand',
        description: 'Optional Korean OEM factory or brand name (e.g. "Cosmax", "Kolmar", "Medicube").',
        required: false,
      },
    ],
  },
  {
    name: 'audit_vendor_security_and_ai_risk',
    title: 'Third-Party SaaS Security, SOC 2 & AI Subprocessor Audit',
    description:
      'Audit external SaaS vendor Trust Centers for SOC 2/ISO certs and AI subprocessors, then enrich missing-SOC-2 or high-risk vendors with verified corporate contacts.',
    arguments: [
      {
        name: 'domains',
        description: 'Comma-separated SaaS vendor domains (e.g. "linear.app, apify.com, canva.com").',
        required: true,
      },
    ],
  },
  {
    name: 'monitor_competitor_shopify_changes',
    title: 'Competitor Shopify Price Drop, Restock & MAP Violation Brief',
    description:
      'Check external Shopify competitor stores for real catalog deltas and produce an executive brief grouped by CRITICAL, INVENTORY, and CATALOG severity.',
    arguments: [
      {
        name: 'storeUrls',
        description: 'Comma-separated Shopify store URLs (e.g. "https://www.allbirds.com").',
        required: true,
      },
      {
        name: 'stateStoreName',
        description: 'Optional snapshot store name to track diffs across runs (default: shopify-delta-monitor-state).',
        required: false,
      },
    ],
  },
  {
    name: 'build_creator_sponsorship_shortlist',
    title: 'Build Creator Sponsorship & Agency Outreach Shortlist',
    description:
      'Enrich creator Link-in-Bio pages to pull talent agency emails, monetization signals, promo codes, and rank creators by Brand-Deal Readiness Score.',
    arguments: [
      {
        name: 'urls',
        description: 'Comma-separated Link-in-Bio URLs (e.g. "https://linktr.ee/heathertraska, https://stan.store/stan").',
        required: true,
      },
      {
        name: 'minReadinessScore',
        description: 'Optional minimum 0-100 Brand-Deal Readiness Score filter (default: 40).',
        required: false,
      },
    ],
  },
  {
    name: 'audit_local_leads_and_draft_pitches',
    title: 'Audit Local Business Websites & Draft Factual Cold Pitches',
    description:
      'Audit local business URLs, a Google Maps Apify datasetId, or US Chamber of Commerce cities for 8 website weaknesses, recover owner emails, and generate a ready-to-send agency outreach CSV.',
    arguments: [
      {
        name: 'targets',
        description: 'Comma-separated website URLs OR US Chamber preset codes (e.g. "phoenix_az, fort_worth_tx" or "https://ddofoods.com").',
        required: true,
      },
      {
        name: 'agencyPreset',
        description: 'Agency focus: all, web_design, local_seo, paid_ads, ai_chatbot_booking, or deliverability_agency (default: all).',
        required: false,
      },
      {
        name: 'categoryKeyword',
        description: 'Optional Chamber industry filter such as dental, plumbing, restaurant, or roofing.',
        required: false,
      },
    ],
  },
  {
    name: 'audit_meta_ads_leaks_and_draft_pitches',
    title: 'Audit Meta Ads Advertisers for Leaks & Draft DTC Pitches',
    description:
      'Deduplicate Meta Ad Library datasets, Apify Run IDs, or DTC landing URLs, run 4-layer 110+ stack + 404/OOS/DMARC audit, flag CS ticket queues safely, and draft evidence-backed agency pitches.',
    arguments: [
      {
        name: 'targets',
        description: 'Apify Dataset ID/Run ID OR comma-separated DTC landing URLs (e.g. "https://www.chomps.com/, https://www.brooklinen.com/products/discontinued-summer-promo-demo-404").',
        required: true,
      },
      {
        name: 'agencyPreset',
        description: 'Agency vertical: auto_best_fit, tiktok_google_ads, email_sms_retention, cro_landing_page, ugc_creative, or deliverability_agency (default: auto_best_fit).',
        required: false,
      },
      {
        name: 'dedupStoreName',
        description: 'Optional Named Key-Value Store for weekly skip_seen ($0 repeats) or watch_diff change triggers.',
        required: false,
      },
    ],
  },
  {
    name: 'monitor_ats_hiring_signals_and_draft_outreach',
    title: 'Discover Live ATS Hiring Intent & Draft Recruiting/SDR Outreach',
    description:
      'Search 13 live ATS engines + 7 global feeds by keyword/tech stack OR target company domains, surface 45-120d hard-to-fill roles and 70+ tech stacks (0% ghost jobs), and draft persona-tailored outreach.',
    arguments: [
      {
        name: 'keywordsOrTargets',
        description: 'Either keywords/tech stack (e.g. "Snowflake, Rust") for zero-list Auto-Global search OR comma-separated company domains (e.g. "linear.app, ramp.com, stripe.com").',
        required: true,
      },
      {
        name: 'agencyPersona',
        description: 'Outreach persona: recruiting_agency, b2b_saas_sdr, dev_shop_agency, vc_investor, or all (default: recruiting_agency).',
        required: false,
      },
      {
        name: 'outputMode',
        description: 'Output granularity: jobs, companies, or both (default: jobs).',
        required: false,
      },
    ],
  },
  {
    name: 'audit_app_store_churn_and_draft_outreach',
    title: 'Audit App Store & Google Play Silent Churn & Draft Agency Outreach',
    description:
      'Audit mobile apps across iOS App Store and Google Play for silent churn divergence, 14-language pain clusters, ASO gaps, paid UA/MMP stacks, and EU-DSA contacts, then produce a prioritized outreach and CS-response brief.',
    arguments: [
      {
        name: 'keywordsOrAppIds',
        description: 'Search keywords (e.g. "invoice maker, habit tracker") OR comma-separated iOS numeric IDs / Android package IDs (e.g. "570060128, com.duolingo").',
        required: true,
      },
      {
        name: 'countries',
        description: 'Optional comma-separated ISO-2 countries (default: "us", e.g. "us, de, jp, kr").',
        required: false,
      },
      {
        name: 'outreachPersona',
        description: 'Outreach persona: mobile_agency, aso_growth_agency, sdk_b2b_sales, or product_competitor_intel (default: aso_growth_agency).',
        required: false,
      },
    ],
  },
];

export const PROMPT_MAP = new Map(PROMPTS.map((p) => [p.name, p]));

export function buildPromptResult(name, args = {}) {
  const prompt = PROMPT_MAP.get(name);
  if (!prompt) return null;

  const clean = (v, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

  switch (name) {
    case 'prospect_competitor_retail_stockists': {
      const brandUrl = clean(args.brandUrl, 'https://fellowproducts.com');
      const country = clean(args.countryFilter);
      const maxStores = Number.parseInt(clean(args.maxStores, '50'), 10) || 50;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Run \`extract_brand_store_stockists\` on ${brandUrl} with \`onlyIndependentStores: true\`, \`enrichEmails: true\`, \`maxStoresPerBrand: ${maxStores}\`${country ? `, and \`countryFilter: "${country}"\`` : ''}.`,
                'Then produce:',
                '1. A prioritized outreach table sorted by `outreachReadinessScore` (Store Name, City/Country, Primary Buyer Email, Website, Instagram, Readiness Score).',
                '2. A 3-sentence wholesale pitch angle tailored to independent boutiques that already carry this brand.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'kbeauty_supplier_due_diligence': {
      const productKeyword = clean(args.productKeyword, 'sunscreen');
      const mfr = clean(args.manufacturerOrBrand);
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Perform a 2-step South Korea MFDS due diligence check for "${productKeyword}"${mfr ? ` (brand/OEM focus: "${mfr}")` : ''}:`,
                `1. Call \`search_korea_mfds_oem_filings\` with \`productName: "${productKeyword}"\`${mfr ? `, \`oemManufacturer: "${mfr}"\`` : ''}, and \`resolveOemFromReviewed: true\` to uncover real Korean OEM/ODM factories and SPF/PA specs.`,
                `2. Call \`search_korea_mfds_recalls\` with \`productName: "${productKeyword}"\`${mfr ? ` and \`companyName: "${mfr}"\`` : ''} to check for any active or historical MFDS recall orders.`,
                'Summarize top OEM factories, regulatory claims, and a clear PASS / CAUTION / STOP recall risk verdict.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'audit_vendor_security_and_ai_risk': {
      const domains = clean(args.domains, 'linear.app, apify.com')
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `1. Call \`audit_saas_trust_center\` in \`mode: "audit"\` for domains: ${JSON.stringify(domains)} with \`checkSubprocessors: true\` and \`checkDnsIam: true\`.`,
                '2. For any vendor with `missingSoc2Lead: true` or AI subprocessors requiring vendor review, call `enrich_b2b_company_leads` to obtain their official corporate contact emails and LinkedIn company URL.',
                '3. Output a TPRM executive table (Domain, Trust Platform, Compliance Score, Certifications, AI Subprocessors, Missing SOC 2 Flag, Recommended Contact Email).',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'monitor_competitor_shopify_changes': {
      const storeUrls = clean(args.storeUrls, 'https://www.allbirds.com')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
      const stateStoreName = clean(args.stateStoreName, 'shopify-delta-monitor-state');
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`monitor_shopify_competitor_deltas\` on \`storeUrls: ${JSON.stringify(storeUrls)}\` with \`stateStoreName: "${stateStoreName}"\`.`,
                'Group any detected changes into:',
                '- **CRITICAL** (MAP violations or major price drops)',
                '- **INVENTORY** (restocks and stockouts on hero SKUs)',
                '- **CATALOG** (new product launches or removals)',
                'If this is the first baseline snapshot (`baseline_initialized`), explain what was indexed and confirm $0 delta billing.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'build_creator_sponsorship_shortlist': {
      const urls = clean(args.urls, 'https://linktr.ee/heathertraska')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
      const minScore = Number.parseInt(clean(args.minReadinessScore, '40'), 10) || 0;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`enrich_creator_bio_leads\` on \`urls: ${JSON.stringify(urls)}\` with \`enableDeepContactFollow: true\` and \`minReadinessScore: ${minScore}\`.`,
                'Return a ranked creator sponsorship shortlist showing Creator Name, Bio Platform, Primary Agency/Business Email, Monetization Signals, Promo Codes, and Readiness Score, plus a concise outreach opener for the top 3 creators.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'audit_local_leads_and_draft_pitches': {
      const rawTargets = clean(args.targets, 'phoenix_az')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const preset = clean(args.agencyPreset, 'all');
      const catKw = clean(args.categoryKeyword);
      const single = rawTargets.length === 1 ? rawTargets[0] : '';
      const validChambers = new Set([
        'phoenix_az',
        'scottsdale_az',
        'chandler_az',
        'gilbert_az',
        'fort_worth_tx',
        'denton_tx',
        'lubbock_tx',
        'beverly_hills_ca',
        'anaheim_ca',
        'fresno_ca',
        'tacoma_wa',
        'salem_or',
        'anchorage_ak',
      ]);
      const isApifyRunUrl = Boolean(single && /apify\.com\/.*\/runs\/[A-Za-z0-9]+/i.test(single));
      const isApifyDatasetUrl = Boolean(single && /apify\.com\/.*\/datasets\/[A-Za-z0-9]+/i.test(single));
      const isAllChambers = rawTargets.length > 0 && rawTargets.every((t) => validChambers.has(t));
      const isSingleId = Boolean(single && !isAllChambers && !single.includes('.') && !single.includes('/'));
      const argHint = isApifyRunUrl
        ? `\`sourceRunId: "${single}"\``
        : isApifyDatasetUrl || isSingleId
          ? `\`datasetId: "${single}"\``
          : isAllChambers
            ? `\`presetChambers: ${JSON.stringify(rawTargets)}\`${catKw ? `, \`chamberCategoryKeyword: "${catKw}"\`` : ''}`
            : `\`websiteUrls: ${JSON.stringify(rawTargets)}\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`audit_local_b2b_websites\` with ${argHint}, \`agencyPreset: "${preset}"\`, and \`maxItems: 25\`.`,
                'Return a prioritized agency outreach table sorted by `pitchPriorityScore` (Company, Website, Site Status, Primary Email, Deliverability Grade, Detected Pain Points, Recommended Service, Cold Email Subject, Custom Icebreaker) and skip any `bot_protected`, `cs_ticket_queue`, `inboxType === "none"`, `zeroBounceUnsafe === true`, or `manual_review_required` rows from automated outreach.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'audit_meta_ads_leaks_and_draft_pitches': {
      const rawTargets = clean(args.targets, 'https://www.chomps.com/, https://www.brooklinen.com/products/discontinued-summer-promo-demo-404');
      const preset = clean(args.agencyPreset, 'auto_best_fit');
      const dedupStore = clean(args.dedupStoreName);
      const list = rawTargets.split(',').map((t) => t.trim()).filter(Boolean);
      const single = list.length === 1 ? list[0] : '';
      const isApifyRunUrl = Boolean(single && /apify\.com\/.*\/runs\/[A-Za-z0-9]+/i.test(single));
      const isApifyDatasetUrl = Boolean(single && /apify\.com\/.*\/datasets\/[A-Za-z0-9]+/i.test(single));
      const isSingleId = Boolean(single && !single.includes('.') && !single.includes('/'));
      const argHint = isApifyRunUrl
        ? `\`sourceRunId: "${single}"\``
        : isApifyDatasetUrl || isSingleId
          ? `\`sourceDatasetId: "${single}"\``
          : `\`landingPageUrls: ${JSON.stringify(list)}\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`audit_meta_ads_advertisers\` with ${argHint}, \`agencyPreset: "${preset}"\`, and \`maxBrands: 25\`${dedupStore ? `, \`dedupStoreName: "${dedupStore}"\`, \`dedupMode: "watch_diff"\`` : ''}.`,
                'Produce two sections:',
                '1. **Outreach-Ready DTC Prospects** (`outreachStatus === "ready"`, non-empty `primaryEmail`, `inboxType !== "cs_ticket_queue"`, `inboxType !== "none"`, and `zeroBounceUnsafe !== true`): sorted by `leadPriority` and `leakScore`/`expansionScore`, showing Brand, Buyer Fit, Leak/Expansion Score, Deliverability Grade, Primary Email, Verified Signal, Cold Email Subject, and Evidence Opener.',
                '2. **CS-Queue / No-Email / Manual-Review Pivot List** (`inboxType === "cs_ticket_queue"`, `inboxType === "none"`, `!primaryEmail`, `zeroBounceUnsafe === true`, or `outreachStatus !== "ready"`): do NOT recommend automated email blasts; output the `linkedinDecisionMakerSearchUrl` and `linkedInDm` instead.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'monitor_ats_hiring_signals_and_draft_outreach': {
      const rawVal = clean(args.keywordsOrTargets, 'Snowflake');
      const persona = clean(args.agencyPersona, 'recruiting_agency');
      const mode = clean(args.outputMode, 'jobs');
      const parts = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
      const looksLikeDomains = parts.length > 0 && parts.every((p) => p.includes('.') && !p.includes(' '));
      const argHint = looksLikeDomains
        ? `\`targets: ${JSON.stringify(parts)}\``
        : `\`targets: []\`, \`titleKeywords: ${JSON.stringify(parts)}\`, \`keywordScope: "title_and_description"\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`monitor_ats_hiring_intent\` with ${argHint}, \`agencyPersona: "${persona}"\`, \`outputMode: "${mode}"\`, and \`maxTotalJobs: 30\`.`,
                'Return a prioritized hiring-intent brief sorted by `intentScore` (Company, ATS Platform, Role Title, Days Open / Aging Tier, Verified Tech Stack, Disclosed Salary, LinkedIn Hiring Manager Search URL, and Outreach Opener). Highlight any `STUCK_SWEET_SPOT_45_120D` or `watchTriggers` alerts first.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'audit_app_store_churn_and_draft_outreach': {
      const rawVal = clean(args.keywordsOrAppIds, 'invoice maker');
      const countries = clean(args.countries, 'us')
        .split(',')
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);
      const persona = clean(args.outreachPersona, 'aso_growth_agency');
      const parts = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
      const iosIds = parts.filter((p) => /^\d{6,}$/.test(p) || /apps\.apple\.com/i.test(p));
      const androidPkgs = parts.filter((p) => /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){1,}$/i.test(p) || /play\.google\.com/i.test(p));
      const keywords = parts.filter((p) => !iosIds.includes(p) && !androidPkgs.includes(p));
      const argParts = [];
      if (iosIds.length) argParts.push(`\`iosAppIds: ${JSON.stringify(iosIds)}\``);
      if (androidPkgs.length) argParts.push(`\`androidPackageIds: ${JSON.stringify(androidPkgs)}\``);
      if (keywords.length) argParts.push(`\`searchTerms: ${JSON.stringify(keywords)}\``);
      const argHint = argParts.join(', ') || '`searchTerms: ["invoice maker"]`';
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`audit_app_store_churn_leads\` with ${argHint}, \`countries: ${JSON.stringify(countries.length ? countries : ['us'])}\`, \`outreachPersona: "${persona}"\`, and \`maxApps: 5\`.`,
                'Return a prioritized mobile churn & agency outreach table sorted by `opportunityScore` (App Name, Coverage, Lifetime vs Recent ★, Silent Churn Gap, ASO Score, Top Pain Bucket, Paid Ad / MMP Stack, Verified Developer Email, and Cold Outreach Opener), plus highlight any release regressions or emerging pain topics.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    default:
      return null;
  }
}

export const SERVER_INSTRUCTIONS = [
  'Apify External Business Intelligence MCP Server (v2.5.0 — 11 zero-proxy tools + 9 ready-to-run workflow prompts; $0 billed on empty, unchanged, or filtered misses).',
  'Tool Routing Guide:',
  '- iOS App Store & Google Play unified churn intel, 14-language review pain clusters, ASO audits, CNAME MMP & Wayback->Live gtm.js X-Ray, EU-DSA developer contacts & streaming reviews (up to 10K/app) -> audit_app_store_churn_leads.',
  '- Live ATS jobs, 45-120d hard-to-fill recruiting signals, 70+ tech-stack hiring intent, company hiring dossiers & weekly watch_diff across 13 ATS engines + 71,900+ board directory + 7 global feeds (works with domains OR zero-list keywords like "Snowflake"/"Rust") -> monitor_ats_hiring_intent.',
  '- Meta Ad Library datasets, Apify Run IDs, or DTC ad landing pages -> 4-layer 110+ tech stack, 404/OOS/DMARC leaks, buyer fit, CS-queue guard, Tier-2 expansion pitches & weekly watch_diff -> audit_meta_ads_advertisers.',
  '- Local business / Google Maps / US Chamber 8-point website weakness audit + owner emails + cold-email openers -> audit_local_b2b_websites.',
  '- Competitor wholesale retail stockists + buyer emails -> extract_brand_store_stockists.',
  '- External Shopify competitor price drops, restocks, stockouts, or MAP violations -> monitor_shopify_competitor_deltas.',
  '- External SaaS vendor Trust Centers, SOC 2/ISO certs, DNS IAM/SSO, or AI subprocessors -> audit_saas_trust_center.',
  '- Corporate B2B company domain, LinkedIn /company/ URL, corporate emails, WhatsApp, and phones -> enrich_b2b_company_leads.',
  '- Creator/influencer Link-in-Bio agency emails, monetization links, and Readiness Score -> enrich_creator_bio_leads.',
  '- South Korea MFDS cosmetic recall & safety notices (English or Korean queries) -> search_korea_mfds_recalls.',
  '- South Korea MFDS 219,000+ functional cosmetic filings & hidden Korean OEM/ODM factories -> search_korea_mfds_oem_filings.',
  'Built-in Prompts: audit_app_store_churn_and_draft_outreach, monitor_ats_hiring_signals_and_draft_outreach, audit_meta_ads_leaks_and_draft_pitches, audit_local_leads_and_draft_pitches, prospect_competitor_retail_stockists, kbeauty_supplier_due_diligence, audit_vendor_security_and_ai_risk, monitor_competitor_shopify_changes, build_creator_sponsorship_shortlist.',
  'Safety: All lookup/enrichment/audit tools are non-destructive and idempotent; monitor/watch_diff tools only persist non-destructive Apify Key-Value Store snapshots. Never auto-send cold emails unless outreachStatus === "ready", primaryEmail is non-empty (inboxType !== "cs_ticket_queue" and inboxType !== "none"), and zeroBounceUnsafe !== true.',
].join('\n');

export function listToolsResponse() {
  return {
    tools: TOOLS.map(({ name, description, inputSchema, outputSchema, annotations }) => ({
      name,
      description,
      inputSchema,
      outputSchema,
      annotations,
    })),
  };
}

export function listPromptsResponse() {
  return {
    prompts: PROMPTS,
  };
}

export async function executeApifyTool(name, args, token, timeoutMs = 180_000) {
  const tool = resolveTool(name);
  if (!tool) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    };
  }

  const trimmedToken = typeof token === 'string' ? token.trim() : '';
  if (!trimmedToken) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: 'APIFY_TOKEN is required to invoke Apify Actors. Get a free token at https://console.apify.com/settings/integrations and pass it via env APIFY_TOKEN (stdio) or header "Authorization: Bearer <APIFY_TOKEN>" (remote HTTP).',
        },
      ],
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = `https://api.apify.com/v2/acts/${tool.actorSlug}/run-sync-get-dataset-items?memory=256`;
    const payload = args ?? {};

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${trimmedToken}`,
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

    let items = [];
    try {
      const parsed = JSON.parse(text);
      items = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return {
        content: [{ type: 'text', text }],
      };
    }

    const structuredContent = {
      actor: tool.actorSlug,
      count: items.length,
      items,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(structuredContent),
        },
      ],
      structuredContent,
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Failed to execute ${tool.actorSlug}: ${err?.name === 'AbortError' ? `Request timed out after ${Math.round(timeoutMs / 1000)}s` : err.message}`,
        },
      ],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
