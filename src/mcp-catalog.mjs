/**
 * Shared MCP Catalog (v2.8.0) — 14 verb_noun External-Intelligence Tools + 12 One-Click Prompts
 * Used by the stdio/Docker MCP server (`src/mcp-server.mjs`) and Cloudflare Remote `/mcp`.
 */

export const SERVER_NAME = 'apify-b2b-ecom-mcp-server';
export const SERVER_VERSION = '2.8.0';

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
      'Monitor up to 50 external Shopify competitor stores (up to 2,500 products each) for price, stock, catalog, and MAP changes against persisted Key-Value Store snapshots.\n\nParameters: Requires storeUrls (omitting it returns 0 items at $0). minPriceChangePercent and mapThresholds trigger CRITICAL alerts, emitBaselineSummary controls first-run output, and stateStoreName isolates snapshots per workflow (avoid concurrent runs on the same stateStoreName). Requires APIFY_TOKEN.\n\nBehavior & Billing: Writes persistent KV snapshots and optional webhookUrl alerts, isolates per-store or webhook errors in OUTPUT_SUMMARY without aborting, and bills $2/1K real deltas ($0 on baseline or unchanged runs).\n\nUse for recurring Shopify SKU monitoring; do not use for editing your Shopify admin, Meta ad audits (use audit_meta_ads_advertisers), or retail stockists (use extract_brand_store_stockists).',
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
      'Audit or monitor external SaaS vendor Trust Centers (up to 500 domains) for security certifications, DNS IAM/SSO, and third-party or AI subprocessors.\n\nParameters: Requires domains (empty input returns 0 items at $0). mode="audit" runs statelessly, while mode="monitor" diffs against stateStoreName snapshots and uses emitBaselineSummary to control first-run rows; checkSubprocessors and checkDnsIam toggle deep checks, and concurrency bounds parallelism. Requires APIFY_TOKEN.\n\nBehavior & Billing: Persists monitor snapshots and optional webhookUrl alerts, isolates per-domain 403/timeout failures in OUTPUT_SUMMARY, and bills $5/1K audited domains or real changes ($0 when unchanged or WAF-blocked).\n\nUse for TPRM vendor risk or SOC 2 gap prospecting; do not use for editing internal GRC workspaces or local SMB website audits (use audit_local_b2b_websites instead).',
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
      'Enrich creator Link-in-Bio pages across 15+ bio platforms with verified agency or business emails, DNS deliverability checks, and sponsorship readiness scores.\n\nParameters: Supply at least one source (urls, rawCsvOrUrls, datasetId, or sourceRunId; omitting all returns 0 items at $0). enableDeepContactFollow toggles 1-hop personal-site crawling, enableDnsEmailCheck runs DNS MX/SPF/DMARC checks, and onlyWithEmail or minReadinessScore filter before billing. Requires APIFY_TOKEN.\n\nBehavior & Billing: Email validity filters trap/placeholder domains and verifies DNS MX records; readiness scores (0-100) weight verified agency/direct emails, active brand-deal/monetization links, promo codes, and DNS grade. Streams up to 50,000 profiles at $2.50/1K enriched ($0 on 404, WAF, or filtered skips), isolating per-profile failures in OUTPUT_SUMMARY with optional webhookUrl delivery.\n\nUse for influencer and UGC sponsorship outreach; do not use for corporate B2B companies (use enrich_b2b_company_leads instead).',
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
      'Search 219,000+ official South Korea MFDS functional cosmetic filings in English or Korean to uncover Korean OEM/ODM factories and functional claims.\n\nParameters: Filter inputs accept English or Korean (common terms like "sunscreen", "Cosmax", "Kolmar" auto-bridge; unmapped English falls back to raw substring match). datasetType selects reported, reviewed, or both registries, resolveOemFromReviewed joins reviewed base formulas to expose hidden factories, and maxItems caps scan volume. Requires APIFY_TOKEN.\n\nBehavior & Billing: Queries the live MFDS API (~5-20s; slower when resolveOemFromReviewed joins formulas) with transient retries and bills $2/1K records ($0 if empty).\n\nUse for K-Beauty OEM sourcing and R&D; do not use for recall checks (use search_korea_mfds_recalls instead).',
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
      'Audit local SMB websites for technical, SEO, pixel, and DNS deliverability weaknesses, then extract owner emails and factual cold-pitch copy.\n\nParameters: Supply at least one source (websiteUrls, rawCsvOrUrls, datasetId + datasetField, sourceRunId, or presetChambers; omitting all returns 0 items at $0). agencyPreset tailors scoring and copy, dedupStoreName + dedupMode persist 16-shard KV snapshots for skip_seen or watch_diff modes, and onlyWithEmail, onlyWithWeakness, or minPitchScore filter before billing. Requires APIFY_TOKEN.\n\nBehavior & Billing: Writes KV dedup shards and optional webhookUrl payloads, isolates per-site WAF/timeout errors in OUTPUT_SUMMARY, and bills $4.50/1K leads ($0 on WAF, filtered misses, or skip_seen repeats).\n\nUse for local agency prospecting; do not use for SaaS SOC 2 audits (use audit_saas_trust_center) or Meta/DTC ad audits (use audit_meta_ads_advertisers).',
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
      'Deduplicate Meta Ad Library datasets or DTC landing URLs into audited advertiser brands with tech-stack X-Ray, DNS deliverability checks, verified emails, and outreach copy.\n\nParameters: Supply at least one source (landingPageUrls, rawCsvOrUrls, sourceDatasetId, or sourceRunId; omitting all returns 0 items at $0). dedupStoreName paired with dedupMode persists 16-shard KV snapshots for skip_seen ($0 repeats) or weekly watch_diff triggers; onlyWithEmail, onlyWithActiveLeaks, and minLeakScore filter before billing, while maxBrands caps volume. Requires APIFY_TOKEN.\n\nBehavior & Billing: Writes KV dedup snapshots and optional webhookUrl batches, runs ~15-60s per 20 brands isolating WAF/403/timeout failures in OUTPUT_SUMMARY, and bills $4.50/1K unique brands ($0 on marketplaces, WAF skips, repeats, or filtered misses).\n\nUse for Meta Ad Library and DTC advertiser audits; do not use for local SMB audits (use audit_local_b2b_websites) or Shopify SKU price tracking (use monitor_shopify_competitor_deltas).',
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
      'Monitor live ATS job openings, hard-to-fill role aging, and tech-stack hiring intent across 13 ATS engines and 7 global job feeds.\n\nParameters: Supply targets, presetPacks, rawCsvOrUrls, datasetId, or sourceRunId—or leave targets empty with titleKeywords or techStackFilter to trigger global discovery (omitting both targets and filters returns 0 items at $0). outputMode selects jobs, companies, or both; onlyHardToFillSweetSpot and onlyNewSinceLastRun filter before billing, while dedupStoreName + dedupMode track weekly changes. Requires APIFY_TOKEN.\n\nBehavior & Billing: Writes optional KV snapshots and webhookUrl alerts, runs ~5-30s isolating per-board errors in OUTPUT_SUMMARY, and bills $0.99/1K saved rows ($0 on filtered or unchanged skips).\n\nUse for recruiting signals and tech-stack buying intent; do not use for editing your own ATS or company email enrichment without job signals (use enrich_b2b_company_leads instead).',
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
      'Analyze iOS App Store and Google Play apps for silent churn divergence, 14-language pain clusters, ASO gaps, ad/MMP stacks, and EU-DSA developer contacts.\n\nParameters: Supply searchTerms, iosAppIds, androidPackageIds, upstreamItems, or topChartFeed (omitting all runs a 3-app demo). Mode params: app_intelligence uses sampleReviewsPerStore/includeWebsiteGtmXray/includeDeveloperEmailEnrich/outreachPersona; review_stream uses maxReviewsPerApp/starFilter. Pre-charge filters (minOpportunityScore, painBucketFilter, switchIntentOnly, onlyWithEmail) and watchDiff + dedupStoreName gate billing. Requires APIFY_TOKEN.\n\nBilling: $5/1K unified apps or $0.50/1K streamed reviews ($0 on filtered or unchanged skips); isolates per-app errors in OUTPUT_SUMMARY and supports webhookUrl. Use for mobile churn/ASO audits; do not use for Shopify apps (audit_shopify_app_churn_leads).',
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
        painBucketFilter: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['CRASH_BUG', 'PAYWALL_PRICING', 'SUBSCRIPTION_CANCEL', 'LOGIN_AUTH', 'PERFORMANCE_BATTERY', 'UX_UPDATE_REGRESSION', 'SUPPORT_GHOSTED', 'COMPETITOR_SWITCH_INTENT'],
          },
          description: 'Optional pre-charge filter restricting emitted apps or reviews to specific pain themes ($0 when skipped).',
          default: [],
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
  {
    name: 'audit_shopify_app_churn_leads',
    actorSlug: 'maitreya_buddha~shopify-app-store-churn-intel-merchant-leads',
    annotations: {
      title: 'Audit Shopify App Store Pricing, Churn & Unhappy Merchant Leads',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Audit Shopify App Store listings for USD pricing tiers, Built for Shopify badges, 5-star histograms, 14-language churn NLP, micro-PE scores, developer contacts, and 1-2 star unhappy merchant leads.\n\nParameters: Supply searchQueries, appHandlesOrUrls, categoryUrls, partnerUrlsOrSlugs, or upstreamItems (empty returns 0 items at $0). Mode params: app_intelligence uses sampleReviewsPerApp/includeDevWebsiteEnrich/minChurnRiskScore; merchant_churn_leads uses maxReviewsPerApp/starFilter (default critical_1_2); partner_portfolio uses partnerUrlsOrSlugs. Supports watchDiff + dedupStoreName and pre-charge filters. Requires APIFY_TOKEN.\n\nBilling: $5/1K apps or $0.30/1K reviews ($0 on misses/unchanged); optional webhookUrl. Use for Shopify App Store intel and unhappy merchant leads; do not use for storefront SKU deltas (monitor_shopify_competitor_deltas).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        mode: {
          type: 'string',
          enum: ['app_intelligence', 'merchant_churn_leads', 'partner_portfolio'],
          description: 'Execution mode: "app_intelligence" ($5/1K apps), "merchant_churn_leads" ($0.30/1K reviews), or "partner_portfolio" ($5/1K apps).',
          default: 'app_intelligence',
        },
        searchQueries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Shopify App Store search keywords (e.g. ["product reviews", "email marketing", "subscriptions"]).',
          default: [],
        },
        appHandlesOrUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific Shopify app handles or URLs (e.g. ["klaviyo-email-marketing", "judgeme", "https://apps.shopify.com/loox"]).',
          default: [],
        },
        categoryUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional Shopify App Store category URLs or slugs (e.g. ["https://apps.shopify.com/categories/marketing-and-conversion-email-marketing"]).',
          default: [],
        },
        partnerUrlsOrSlugs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional Shopify developer partner slugs or URLs for partner_portfolio mode (e.g. ["klaviyo"]).',
          default: [],
        },
        upstreamItems: {
          type: 'array',
          items: { type: 'object' },
          description: 'Optional upstream pipeline items containing appHandle, appUrl, partnerSlug, or query fields.',
          default: [],
        },
        maxApps: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
          description: 'Maximum Shopify apps to analyze per run (1-500).',
          default: 15,
        },
        sampleReviewsPerApp: {
          type: 'integer',
          minimum: 10,
          maximum: 200,
          description: 'Recent reviews sampled per app in app_intelligence mode to compute churn divergence and pain buckets (10-200).',
          default: 30,
        },
        maxReviewsPerApp: {
          type: 'integer',
          minimum: 10,
          maximum: 2000,
          description: 'Maximum merchant review leads extracted per app in merchant_churn_leads mode (10-2,000).',
          default: 100,
        },
        starFilter: {
          type: 'string',
          enum: ['all', 'critical_1_2', '1', '2', '3', '4', '5'],
          description: 'Review star filter (defaults to "critical_1_2" in merchant_churn_leads mode and "all" in app_intelligence mode).',
        },
        includeDevWebsiteEnrich: {
          type: 'boolean',
          description: 'Enrich developer support email, official website URL, and DNS MX/SPF/DMARC deliverability.',
          default: true,
        },
        generateDashboardHtml: {
          type: 'boolean',
          description: 'Save a self-contained interactive executive HTML dashboard to OUTPUT_DASHBOARD.html in the Key-Value Store.',
          default: true,
        },
        watchDiff: {
          type: 'boolean',
          description: 'Compare against prior KV snapshots to flag pricing, Built for Shopify, rating, and new critical review changes ($0 when unchanged).',
          default: false,
        },
        dedupStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store used to persist snapshots when watchDiff is enabled.',
          default: 'shopify-app-churn-watch',
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps where a developer email is verified ($0 otherwise).',
          default: false,
        },
        onlyBuiltForShopify: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps carrying the Built for Shopify badge ($0 otherwise).',
          default: false,
        },
        onlyVeteranChurn: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps or merchant leads showing veteran-store churn (>=180 days usage, $0 otherwise).',
          default: false,
        },
        switchIntentOnly: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only apps or merchant leads mentioning switching to a named competitor ($0 otherwise).',
          default: false,
        },
        minChurnRiskScore: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          description: 'Pre-charge filter: emit only apps with churnRiskScore >= threshold ($0 below).',
          default: 0,
        },
        crmPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat OWASP CSV-safe CRM export preset.',
          default: 'default',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL to receive high-churn or watchDiff alerts.',
        },
      },
    },
    outputSchema: makeOutputSchema('Shopify App Store intelligence dossiers or unhappy merchant review leads.', {
      recordType: { type: 'string', description: 'Record type: shopify_app_intelligence or merchant_churn_lead.' },
      appHandle: { type: 'string', description: 'Shopify App Store URL slug.' },
      appName: { type: 'string', description: 'Shopify app title.' },
      isBuiltForShopify: { type: 'boolean', description: 'Whether the app currently holds the Built for Shopify badge.' },
      overallRating: { type: 'number', description: 'Lifetime Shopify App Store star rating.' },
      recentReviewsAvg: { type: 'number', description: 'Recent sampled review rating average.' },
      silentChurnDivergence: { type: 'number', description: 'Recent minus lifetime rating delta (negative indicates silent churn).' },
      minPaidPriceUsd: { type: 'number', description: 'Lowest paid monthly plan price normalized to USD.' },
      churnRiskScore: { type: 'integer', description: '0-100 churn severity score.' },
      microPeAcquisitionScore: { type: 'integer', description: '0-100 micro-PE acquisition fit score.' },
      topPainBucket: { type: 'string', description: 'Primary merchant complaint category.' },
      developerSupportEmail: { type: 'string', description: 'Verified developer support email (or null).' },
      merchantStoreName: { type: 'string', description: 'Merchant store name (in merchant_churn_leads mode).' },
      switcherPriorityScore: { type: 'integer', description: '0-100 unhappy merchant switching score (in merchant_churn_leads mode).' },
    }),
  },
  {
    name: 'audit_substack_newsletters_leads',
    actorSlug: 'maitreya_buddha~substack-scraper-sponsor-revenue-leads',
    annotations: {
      title: 'Audit Substack Newsletters, Paid ARR, Sponsors, RAG Posts & Notes',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Audit Substack newsletters across 35 categories, search queries, or handles/URLs for Stripe USD paid ARR floors, sponsor brands, MX/DMARC author emails, RAG post archives, and Notes/comments.\n\nParameters: Supply categories, searchQueries, publicationUrlsOrHandles, or upstreamItems (empty returns 0 items at $0). Mode params: newsletter_intelligence uses discoveryBoard/includeAboutAndDomainEnrich/outreachPersona/watchDiff/pre-charge filters; post_sponsor_stream uses maxPostsPerPublication/includeCleanPostText; notes_and_comments uses maxNotesPerAuthor/maxCommentsPerPost. Requires APIFY_TOKEN.\n\nBilling: 128 MB pure HTTP ($0 proxy); $4/1K newsletters, $0.40/1K posts, or $0.25/1K notes/comments ($0 on empty/unchanged/filtered misses); optional webhookUrl. Use for Substack sponsor leads, revenue intel & RAG; do not use for news monitoring (monitor_google_news_rag_triggers).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        mode: {
          type: 'string',
          enum: ['newsletter_intelligence', 'post_sponsor_stream', 'notes_and_comments'],
          description: 'Execution mode: newsletter_intelligence ($4/1K dossiers), post_sponsor_stream ($0.40/1K RAG posts + sponsors), or notes_and_comments ($0.25/1K public Notes + nested comments).',
          default: 'newsletter_intelligence',
        },
        categories: {
          type: 'array',
          maxItems: 10,
          items: { type: 'string' },
          description: 'Optional Substack category slugs or names (e.g. ["technology", "finance", "business", "culture"]). Optional when searchQueries or publicationUrlsOrHandles is provided.',
        },
        discoveryBoard: {
          type: 'string',
          enum: ['paid', 'trending', 'public_all', 'both_leaderboards'],
          description: 'Substack category board to pull: paid (bestsellers), trending (rising), public_all (free + paid), or both_leaderboards.',
          default: 'paid',
        },
        searchQueries: {
          type: 'array',
          maxItems: 10,
          items: { type: 'string' },
          description: 'Optional Substack search keywords to discover niche newsletters (e.g. ["semiconductors", "ai engineering"]).',
        },
        publicationUrlsOrHandles: {
          type: 'array',
          maxItems: 200,
          items: { type: 'string' },
          description: 'Optional direct Substack URLs, custom newsletter domains, subdomains, or @author handles (e.g. ["https://newsletter.pragmaticengineer.com", "bytebytego", "@semianalysis"]).',
        },
        upstreamItems: {
          type: 'array',
          maxItems: 500,
          items: { type: 'object', additionalProperties: true },
          description: 'Optional upstream JSON rows from Clay, Make, n8n, or another Apify Actor for cross-run chaining under LIMITED_PERMISSIONS.',
        },
        maxPublications: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
          description: 'Maximum Substack publications to analyze (1-500).',
          default: 15,
        },
        maxPostsPerPublication: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
          description: 'Maximum recent posts per publication via streaming RSS or /api/v1/archive cursor pagination (1-500).',
          default: 10,
        },
        includeCleanPostText: {
          type: 'boolean',
          description: 'In post_sponsor_stream mode, fetch full public post bodies and output paragraph-preserving cleanPlainText + ragTokenEstimate.',
          default: true,
        },
        maxNotesPerAuthor: {
          type: 'integer',
          minimum: 0,
          maximum: 200,
          description: 'In notes_and_comments mode, maximum public Substack Notes per author (0-200).',
          default: 20,
        },
        maxCommentsPerPost: {
          type: 'integer',
          minimum: 0,
          maximum: 200,
          description: 'In notes_and_comments mode, maximum flattened nested reader comments per post (0-200).',
          default: 50,
        },
        includeAboutAndDomainEnrich: {
          type: 'boolean',
          description: 'Fetch /about, author public_profile, and 1-hop custom domain /sponsor or /contact pages for emails, media kits, and DNS MX/SPF/DMARC checks.',
          default: true,
        },
        outreachPersona: {
          type: 'string',
          enum: ['sponsor_brand', 'b2b_agency', 'pr_media', 'micro_pe_analyst'],
          description: 'Outreach persona used to tailor outreachSubject and outreachBody.',
          default: 'sponsor_brand',
        },
        onlyWithEmail: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only newsletters with at least one verified email ($0 otherwise).',
          default: false,
        },
        onlyWithSponsorSignal: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only newsletters with detected sponsor blocks, banners, or media-kit links ($0 otherwise).',
          default: false,
        },
        excludeDormant: {
          type: 'boolean',
          description: 'Pre-charge filter: skip dormant newsletters with no post in 45+ days at $0.',
          default: false,
        },
        minBestsellerTier: {
          type: 'integer',
          minimum: 0,
          maximum: 100000,
          description: 'Pre-charge filter: minimum Substack bestseller paid-subscriber badge tier (0, 100, 1000, 10000; $0 below).',
          default: 0,
        },
        watchDiff: {
          type: 'boolean',
          description: 'Enable weekly stateful watch_diff in newsletter_intelligence mode to skip unchanged publications at $0 and emit 8 change triggers.',
          default: false,
        },
        dedupStoreName: {
          type: 'string',
          description: 'Optional Apify Named Key-Value Store name for watchDiff snapshots (default: substack-intel-watch).',
        },
        crmPreset: {
          type: 'string',
          enum: ['default', 'instantly', 'smartlead', 'hubspot', 'lemlist'],
          description: 'Optional flat OWASP CSV-safe CRM export preset.',
          default: 'default',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL to receive run results.',
        },
      },
    },
    outputSchema: makeOutputSchema('Substack newsletter intelligence dossiers, RAG post archive rows, or public Notes & nested comment records.', {
      recordType: { type: 'string', description: 'Record type: substack_newsletter_intelligence, substack_post, substack_note, or post_comment.' },
      publicationName: { type: 'string', description: 'Substack publication display name.' },
      subdomain: { type: 'string', description: 'Canonical Substack subdomain.' },
      publicationUrl: { type: 'string', description: 'Canonical newsletter URL (custom domain or substack.com).' },
      authorName: { type: 'string', description: 'Primary newsletter author name.' },
      totalSubscribersApprox: { type: 'integer', description: 'Approximate total subscriber count parsed from Substack metadata.' },
      bestsellerTier: { type: 'integer', description: 'Verified Substack paid bestseller tier (100, 1000, 10000, etc.).' },
      verifiedPaidArrFloorUsd: { type: 'number', description: 'Conservative USD annual paid revenue floor derived from bestsellerTier and Stripe plans.' },
      hasSponsorSignal: { type: 'boolean', description: 'Whether sponsor blocks, banner ads, or media-kit links were detected.' },
      primaryEmail: { type: 'string', description: 'Prioritized author or sponsor contact email (or null).' },
      deliverabilityGrade: { type: 'string', description: 'DNS MX/SPF/DMARC deliverability grade (A-F).' },
      opportunityScore: { type: 'integer', description: '0-100 sponsorship/outreach opportunity score.' },
      cleanPlainText: { type: 'string', description: 'Paragraph-preserving plain text for AI/RAG pipelines (in post_sponsor_stream mode).' },
      bodyText: { type: 'string', description: 'Plain text content of a Substack Note or nested reader comment (in notes_and_comments mode).' },
    }),
  },
  {
    name: 'monitor_google_news_rag_triggers',
    actorSlug: 'maitreya_buddha~google-news-intel-rag-trigger-monitor',
    annotations: {
      title: 'Monitor Google News Full Text, RAG Chunks & B2B Triggers',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    description:
      'Scrape Google News across EN/KO/JA/DE/ES with 5-in-1 publisher URL decoding (Bing News fallback), streaming HTML full-text & 512-token RAG chunks, 3-layer paywall sibling rescue, 10 B2B/PR event triggers, cross-lingual clustering, and $0-skip watchDiff monitoring.\n\nParameters: Supply queries, topics, or topicOrClusterUrls (defaults to NVIDIA AI). Mode params: news_headlines_intel uses decodeUrls/onlyWithTriggers; full_article_rag adds streaming full text, paywall rescue, onlyFullText, and ragChunkMaxTokens. Supports locales, timeframe, dedupeSimilarStories, watchDiff + dedupStoreName, and webhookUrl. Requires APIFY_TOKEN.\n\nBilling: 128 MB pure HTTP ($0 proxy); $0.80/1K headlines or $1.50/1K full-text RAG articles (up to 50% off; $0 on watchDiff skips/filtered misses). Use for live news RAG, PR crisis & B2B trigger tracking; do not use for Substack newsletters (audit_substack_newsletters_leads).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        mode: {
          type: 'string',
          enum: ['news_headlines_intel', 'full_article_rag'],
          description: 'news_headlines_intel ($0.80/1K: decoded URLs + 10 B2B/PR triggers + clusters) or full_article_rag ($1.50/1K: adds streaming full text, 3-layer paywall sibling rescue & 512-token RAG chunks).',
          default: 'news_headlines_intel',
        },
        queries: {
          type: 'array',
          maxItems: 20,
          items: { type: 'string' },
          description: 'Search keywords or boolean queries (e.g. ["OpenAI", "NVIDIA AI", "cyberattack healthcare"]).',
          default: ['NVIDIA AI'],
        },
        topics: {
          type: 'array',
          maxItems: 10,
          items: {
            type: 'string',
            enum: ['TOP', 'WORLD', 'NATION', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'SPORTS', 'SCIENCE', 'HEALTH'],
          },
          description: 'Optional Google News topic feeds (e.g. ["TECHNOLOGY", "BUSINESS"]).',
          default: [],
        },
        topicOrClusterUrls: {
          type: 'array',
          maxItems: 10,
          items: { type: 'string' },
          description: 'Optional direct Google News topic, search, or RSS feed URLs.',
          default: [],
        },
        locales: {
          type: 'array',
          maxItems: 10,
          items: { type: 'string' },
          description: 'COUNTRY:lang locales for cross-lingual monitoring and clustering (e.g. ["US:en", "KR:ko", "JP:ja", "DE:de", "ES:es"]).',
          default: ['US:en'],
        },
        timeframe: {
          type: 'string',
          enum: ['1h', '6h', '12h', '24h', '7d', '30d', 'any'],
          description: 'Recency window applied to search queries (e.g. "24h" for daily cron, "7d" for weekly briefs).',
          default: '7d',
        },
        maxArticles: {
          type: 'integer',
          minimum: 1,
          maximum: 2000,
          description: 'Maximum deduplicated stories to process per run (1-2,000).',
          default: 20,
        },
        decodeUrls: {
          type: 'boolean',
          description: 'Decode obfuscated news.google.com redirect links into real publisher URLs in 5-in-1 pure HTTP batches.',
          default: true,
        },
        dedupeSimilarStories: {
          type: 'boolean',
          description: 'Emit 1 canonical representative per cross-lingual story cluster with coverageCount and relatedSources.',
          default: false,
        },
        onlyFullText: {
          type: 'boolean',
          description: 'In full_article_rag mode, skip blocked/paywalled rows without full text or sibling rescue at $0.',
          default: false,
        },
        onlyWithTriggers: {
          type: 'boolean',
          description: 'Pre-charge filter: emit only stories matching at least one of the 10 B2B/PR event triggers ($0 otherwise).',
          default: false,
        },
        ragChunkMaxTokens: {
          type: 'integer',
          minimum: 128,
          maximum: 2048,
          description: 'In full_article_rag mode, target token size for overlap-preserving ragChunks (128-2,048).',
          default: 512,
        },
        watchDiff: {
          type: 'boolean',
          description: 'Skip previously seen articles BEFORE URL decoding at $0 using immutable run-delta KV snapshots.',
          default: false,
        },
        dedupStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store for watchDiff 90-day rolling LRU snapshots.',
          default: 'gnews-intel-watch',
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional SSRF-protected HTTPS webhook URL to receive run summary and breaking triggers.',
        },
      },
    },
    outputSchema: makeOutputSchema('Decoded Google News intelligence records with B2B/PR triggers, cross-lingual clusters, and optional full-text RAG chunks.', {
      recordType: { type: 'string', description: 'Record type: news_headline_intel or news_article_rag.' },
      title: { type: 'string', description: 'Clean article headline.' },
      publisherName: { type: 'string', description: 'Source publisher display name.' },
      publisherUrl: { type: 'string', description: 'Decoded canonical publisher URL (or null if decodeUrls is false).' },
      publishedAt: { type: 'string', description: 'ISO-8601 publication timestamp.' },
      locale: { type: 'string', description: 'Source locale (e.g. US:en, KR:ko, JP:ja).' },
      extractionStatus: { type: 'string', description: 'RSS_ONLY, FULL, RESCUED_FROM_SIBLING, PAYWALL_TRUNCATED, or BLOCKED.' },
      rescuedFromPublisher: { type: 'string', description: 'Free cluster-sibling publisher name when Layer-3 paywall rescue succeeded.' },
      wordCount: { type: 'integer', description: 'Effective word count (CJK-normalized) in full_article_rag mode.' },
      ragChunksCount: { type: 'integer', description: 'Number of 512-token RAG chunks built.' },
      cleanPlainText: { type: 'string', description: 'Clean full-text article body for AI/RAG pipelines (full_article_rag mode).' },
      eventTriggers: { type: 'array', items: { type: 'string' }, description: 'Detected B2B/PR event triggers (FUNDING, MA, LAYOFF, BREACH, RECALL, etc.).' },
      sentiment: { type: 'string', description: 'Negation-aware sentiment label (positive, neutral, negative).' },
      urgencyScore: { type: 'integer', description: '0-100 breaking urgency score.' },
      crisisAlert: { type: 'boolean', description: 'True when active crisis trigger is not negated.' },
      clusterId: { type: 'string', description: 'Cross-lingual story cluster ID.' },
      coverageCount: { type: 'integer', description: 'Number of publishers covering this story cluster.' },
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
  shopify_app_store_churn_intel_merchant_leads: 'audit_shopify_app_churn_leads',
  substack_scraper_sponsor_revenue_leads: 'audit_substack_newsletters_leads',
  google_news_intel_rag_trigger_monitor: 'monitor_google_news_rag_triggers',
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
  {
    name: 'audit_shopify_app_churn_and_draft_outreach',
    title: 'Audit Shopify App Store Pricing, Churn & Unhappy Merchant Leads',
    description:
      'Audit Shopify App Store competitors for USD pricing tiers, Built for Shopify badges, 1-2 star silent churn spikes, and unhappy merchant leads, then produce a competitive positioning and outreach brief.',
    arguments: [
      {
        name: 'queriesOrAppHandles',
        description: 'Search keywords (e.g. "product reviews, subscriptions") OR comma-separated Shopify app handles/URLs (e.g. "klaviyo-email-marketing, judgeme, loox").',
        required: true,
      },
      {
        name: 'mode',
        description: 'Execution mode: app_intelligence (competitor & micro-PE dossier) or merchant_churn_leads (1-2 star unhappy merchant leads, default: app_intelligence).',
        required: false,
      },
    ],
  },
  {
    name: 'audit_substack_sponsors_and_rag_archive',
    title: 'Audit Substack Paid ARR, Sponsors, Author Emails, RAG Posts & Notes',
    description:
      'Discover Substack newsletters across 35 categories or direct handles/URLs to compute Stripe USD paid ARR floors, active sponsor brands, MX-verified emails, full-text RAG post archives, and public Notes & nested comments.',
    arguments: [
      {
        name: 'targetsOrCategories',
        description: 'Substack category slugs (e.g. "technology, finance") OR comma-separated publication URLs/handles (e.g. "https://newsletter.pragmaticengineer.com, bytebytego, @semianalysis").',
        required: true,
      },
      {
        name: 'mode',
        description: 'Execution mode: newsletter_intelligence (paid ARR, sponsors & verified emails), post_sponsor_stream (RAG cleanPlainText + per-post sponsors), or notes_and_comments (public Notes + nested comments, default: newsletter_intelligence).',
        required: false,
      },
    ],
  },
  {
    name: 'monitor_google_news_rag_and_triggers',
    title: 'Monitor Google News Full Text, RAG Chunks & B2B/PR Crisis Triggers',
    description:
      'Decode Google News redirect URLs across EN/KO/JA/DE/ES, extract full-text articles + 512-token RAG chunks with 3-layer paywall sibling rescue, detect 10 B2B/PR crisis triggers, and cluster global coverage.',
    arguments: [
      {
        name: 'queriesOrTopics',
        description: 'Comma-separated search keywords (e.g. "OpenAI, NVIDIA AI") OR Google News topics ("TECHNOLOGY, BUSINESS").',
        required: true,
      },
      {
        name: 'mode',
        description: 'Execution mode: news_headlines_intel ($0.80/1K headlines + triggers) or full_article_rag ($1.50/1K full text + 512-token RAG chunks, default: full_article_rag).',
        required: false,
      },
      {
        name: 'locales',
        description: 'Optional comma-separated locales (e.g. "US:en, KR:ko, JP:ja", default: "US:en").',
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
    case 'audit_shopify_app_churn_and_draft_outreach': {
      const rawVal = clean(args.queriesOrAppHandles, 'product reviews');
      const mode = clean(args.mode, 'app_intelligence') === 'merchant_churn_leads' ? 'merchant_churn_leads' : 'app_intelligence';
      const parts = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
      const looksLikeHandles = parts.length > 0 && parts.every((p) => /apps\.shopify\.com\//i.test(p) || /^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(p) || /^[a-z0-9]{4,}$/i.test(p) && !p.includes(' '));
      const argHint = looksLikeHandles
        ? `\`appHandlesOrUrls: ${JSON.stringify(parts)}\``
        : `\`searchQueries: ${JSON.stringify(parts)}\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`audit_shopify_app_churn_leads\` with \`mode: "${mode}"\`, ${argHint}, and \`maxApps: ${mode === 'merchant_churn_leads' ? 3 : 10}\`.`,
                mode === 'merchant_churn_leads'
                  ? 'Return a prioritized unhappy Shopify merchant table sorted by `switcherPriorityScore` (Merchant Store, Country, Competitor App, Star Rating, Usage Duration, Pain Buckets, Switch-To Mention, Review Date, and Merchant Lookup Query) plus a tailored competitor-switch pitch angle.'
                  : 'Return a prioritized Shopify App Store intelligence table sorted by `churnRiskScore` (App Name, Built for Shopify, Min Paid USD, Trial/Usage Charges, Lifetime vs Recent ★, 1-2★ Critical Share %, Top Pain Bucket, Micro-PE Score, and Verified Developer Email), plus highlight key pricing and churn opportunities.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'audit_substack_sponsors_and_rag_archive': {
      const rawVal = clean(args.targetsOrCategories, 'technology');
      const validModes = new Set(['newsletter_intelligence', 'post_sponsor_stream', 'notes_and_comments']);
      const mode = validModes.has(clean(args.mode, 'newsletter_intelligence'))
        ? clean(args.mode, 'newsletter_intelligence')
        : 'newsletter_intelligence';
      const parts = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
      const looksLikeUrlsOrHandles =
        parts.length > 0 && parts.some((p) => p.includes('.') || p.startsWith('@') || p.includes('/'));
      const argHint = looksLikeUrlsOrHandles
        ? `\`publicationUrlsOrHandles: ${JSON.stringify(parts)}\``
        : `\`categories: ${JSON.stringify(parts)}\`, \`discoveryBoard: "paid"\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`audit_substack_newsletters_leads\` with \`mode: "${mode}"\`, ${argHint}, and \`maxPublications: ${mode === 'newsletter_intelligence' ? 10 : 3}\`.`,
                mode === 'post_sponsor_stream'
                  ? 'Summarize extracted Substack posts with RAG token estimates, highlight `hasSponsorBlock === true` advertiser mentions, and prepare clean plain-text chunks for downstream vector ingestion.'
                  : mode === 'notes_and_comments'
                    ? 'Highlight high-signal author Notes (`recordType === "substack_note"`) and nested reader comments (`isAuthorReply === true` or top likes) grouped by publication.'
                    : 'Return a prioritized Substack sponsorship & revenue table sorted by `opportunityScore` (Publication, Author, Total Subscribers, Bestseller Tier, Verified Paid ARR Floor USD, Sponsor Brands & Media Kit, Verified Primary Email & DNS Grade, and Outreach Subject/Body), skipping any `support_or_billing` inboxes.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'monitor_google_news_rag_and_triggers': {
      const rawVal = clean(args.queriesOrTopics, 'NVIDIA AI');
      const mode = clean(args.mode, 'full_article_rag') === 'news_headlines_intel' ? 'news_headlines_intel' : 'full_article_rag';
      const locales = clean(args.locales, 'US:en')
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);
      const parts = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
      const validTopics = new Set(['TOP', 'WORLD', 'NATION', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'SPORTS', 'SCIENCE', 'HEALTH']);
      const isTopics = parts.length > 0 && parts.every((p) => validTopics.has(p.toUpperCase()));
      const argHint = isTopics
        ? `\`topics: ${JSON.stringify(parts.map((p) => p.toUpperCase()))}\`, \`queries: []\``
        : `\`queries: ${JSON.stringify(parts)}\``;
      return {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Call \`monitor_google_news_rag_triggers\` with \`mode: "${mode}"\`, ${argHint}, \`locales: ${JSON.stringify(locales.length ? locales : ['US:en'])}\`, \`decodeUrls: true\`, and \`maxArticles: ${mode === 'full_article_rag' ? 10 : 20}\`.`,
                mode === 'full_article_rag'
                  ? 'Synthesize a citation-backed executive RAG brief from `cleanPlainText` and `ragChunks`, flagging any `RESCUED_FROM_SIBLING` paywall rescues, `crisisAlert === true` stories, B2B/PR `eventTriggers`, and multi-lingual `clusterId` coverage.'
                  : 'Return a prioritized breaking-news trigger table sorted by `urgencyScore` (Headline, Publisher, Decoded URL, Event Triggers, Sentiment, Crisis Alert, Cross-Lingual Coverage Count) and recommend follow-up actions.',
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
  'Apify External Business Intelligence MCP Server (v2.8.0 — 14 zero-proxy tools + 12 ready-to-run workflow prompts; $0 billed on empty, unchanged, or filtered misses).',
  'Tool Routing Guide:',
  '- Google News 5-in-1 URL decoding (Bing News fallback), streaming HTML full-text & 512-token RAG chunks, 3-layer paywall sibling rescue, 10 B2B/PR crisis triggers, EN/KO/JA/DE/ES cross-lingual clustering & $0-skip watchDiff -> monitor_google_news_rag_triggers.',
  '- Substack newsletter paid ARR floor, sponsor brands & media kits, MX/DMARC verified author emails, /api/v1/archive RAG post text, public Substack Notes & nested reader comments -> audit_substack_newsletters_leads.',
  '- Shopify App Store pricing tiers (USD), Built for Shopify status, 5-star histograms, 14-language churn NLP, micro-PE scores, developer DNS/email contacts & 1-2 star unhappy merchant review leads -> audit_shopify_app_churn_leads.',
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
  'Built-in Prompts: monitor_google_news_rag_and_triggers, audit_substack_sponsors_and_rag_archive, audit_shopify_app_churn_and_draft_outreach, audit_app_store_churn_and_draft_outreach, monitor_ats_hiring_signals_and_draft_outreach, audit_meta_ads_leaks_and_draft_pitches, audit_local_leads_and_draft_pitches, prospect_competitor_retail_stockists, kbeauty_supplier_due_diligence, audit_vendor_security_and_ai_risk, monitor_competitor_shopify_changes, build_creator_sponsorship_shortlist.',
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
