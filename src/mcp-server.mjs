#!/usr/bin/env node
/**
 * Apify B2B & E-Commerce Automation Kit MCP Server (stdio)
 * Exposes 5 lightweight, zero-proxy 128MB Apify Actors as standard MCP tools.
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
      'Monitor Shopify competitor stores for price drops, price hikes, restocks, out-of-stock alerts, new launches, and MAP violations using persistent Key-Value Store snapshots ($2/1K deltas; $0 on baseline or unchanged runs).',
    inputSchema: {
      type: 'object',
      properties: {
        storeUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of Shopify store or collection URLs to monitor (max 50), e.g. ["https://www.allbirds.com"].',
        },
        stateStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store to persist catalog snapshots across runs.',
          default: 'shopify-delta-monitor-state',
        },
        maxProductsPerStore: {
          type: 'integer',
          description: 'Max products to fetch per store URL (50-2500).',
          default: 500,
        },
        minPriceChangePercent: {
          type: 'number',
          description: 'Minimum percentage change required to emit price_drop or price_increase.',
          default: 1.0,
        },
        eventTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter delta event types (new_product, removed_product, price_drop, price_increase, discount_started, discount_ended, out_of_stock, restocked).',
        },
        mapThresholds: {
          type: 'object',
          description: 'Optional map of SKU or product handle to Minimum Advertised Price.',
        },
        emitBaselineSummary: {
          type: 'boolean',
          description: 'Emit 1 zero-cost baseline_initialized summary on a store first run.',
          default: true,
        },
        webhookUrl: {
          type: 'string',
          description: 'Optional Slack/Discord/n8n webhook URL notified when deltas are detected.',
        },
      },
      required: ['storeUrls'],
    },
  },
  {
    name: 'saas_trust_center_soc2_monitor',
    actorSlug: 'maitreya_buddha~saas-trust-center-soc2-monitor',
    description:
      'Audit or monitor B2B SaaS Trust Centers (Vanta, Drata, SafeBase, Conveyor, Whistic, Secureframe, OneTrust) for SOC 2, ISO 27001, HIPAA, DNS IAM/SSO, and 75+ subprocessors including AI vendors ($5/1K audits or changes; $0 unchanged).',
    inputSchema: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of SaaS vendor domains or URLs (e.g. ["apify.com", "linear.app", "canva.com"]).',
        },
        mode: {
          type: 'string',
          enum: ['audit', 'monitor'],
          description: '"audit" returns full security profiles; "monitor" emits only compliance/AI subprocessor changes.',
          default: 'audit',
        },
        stateStoreName: {
          type: 'string',
          description: 'Named Apify Key-Value Store for baseline snapshots in monitor mode.',
          default: 'saas-trust-monitor-state',
        },
        checkSubprocessors: {
          type: 'boolean',
          description: 'Extract third-party and AI subprocessors.',
          default: true,
        },
        checkDnsIam: {
          type: 'boolean',
          description: 'Inspect DNS CNAME/TXT/MX records for Trust Center and SSO/IAM providers.',
          default: true,
        },
        concurrency: {
          type: 'integer',
          description: 'Number of domains checked concurrently (1-15).',
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
      '3-in-1 B2B lead resolver: convert company names, domains, work emails, or an upstream Apify datasetId into verified official website, LinkedIn company URL, prioritized role emails, WhatsApp, phones, and 6 social links ($2.50/1K enriched; $0 misses).',
    inputSchema: {
      type: 'object',
      properties: {
        inputs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Company names, domains, URLs, or work emails (e.g. ["Stripe", "Linear", "canva.com"]). Optional if datasetId is set.',
        },
        datasetId: {
          type: 'string',
          description: 'Optional upstream Apify Dataset ID to chain from (auto-detects website/domain/companyName/email).',
        },
        datasetField: {
          type: 'string',
          description: 'Optional specific field name inside datasetId items.',
        },
        enrichContactPages: {
          type: 'boolean',
          description: 'Crawl up to 2 internal /contact or /about pages when homepage lacks emails/WhatsApp/LinkedIn.',
          default: true,
        },
        includeUnresolved: {
          type: 'boolean',
          description: 'Keep unresolved records in dataset output at $0 cost.',
          default: false,
        },
        minConfidence: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Minimum confidence level for company-name-to-domain matches.',
          default: 'medium',
        },
        concurrency: {
          type: 'integer',
          description: 'Concurrent lookups (1-15).',
          default: 6,
        },
      },
    },
  },
  {
    name: 'korea_mfds_cosmetic_recalls',
    actorSlug: 'maitreya_buddha~korea-mfds-cosmetic-recalls',
    description:
      'Retrieve official South Korea MFDS (식약처) cosmetic recall notices, administrative violations, product names, manufacturers, and recall reasons as clean JSON ($3/1K records).',
    inputSchema: {
      type: 'object',
      properties: {
        companyName: {
          type: 'string',
          description: 'Partial-match filter for company/manufacturer name.',
        },
        productName: {
          type: 'string',
          description: 'Partial-match filter for cosmetic product name.',
        },
        businessNumber: {
          type: 'string',
          description: 'Optional Korean business registration number filter.',
        },
        recallOrderDateFrom: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD).',
        },
        recallOrderDateTo: {
          type: 'string',
          description: 'End date (YYYY-MM-DD).',
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
      'Search 219,000+ official South Korea MFDS functional cosmetics (기능성화장품) reported & reviewed approvals: OEM/ODM manufacturers, SPF/PA specs, whitening/anti-wrinkle claims, and active ingredients ($2/1K records).',
    inputSchema: {
      type: 'object',
      properties: {
        datasetType: {
          type: 'string',
          enum: ['both', 'reported', 'reviewed'],
          description: 'Query reported products, reviewed base formulas, or both.',
          default: 'reported',
        },
        productName: {
          type: 'string',
          description: 'Partial-match product name (e.g. Korean keywords like "선크림", "세럼").',
        },
        brandOrDistributor: {
          type: 'string',
          description: 'Filter by brand or responsible seller company name.',
        },
        oemManufacturer: {
          type: 'string',
          description: 'Filter by OEM/ODM manufacturer (e.g. "코스맥스", "한국콜마").',
        },
        efficacyKeyword: {
          type: 'string',
          description: 'Filter by efficacy claim (e.g. "미백", "주름", "자외선", "whitening", "anti-wrinkle").',
        },
        itemCode: {
          type: 'string',
          description: 'Exact MFDS item or cosmetic report sequence code.',
        },
        resolveOemFromReviewed: {
          type: 'boolean',
          description: 'Auto-resolve hidden OEM/ODM manufacturers from linked base formulas.',
          default: true,
        },
        maxItems: {
          type: 'integer',
          description: 'Maximum records to return (1-1000).',
          default: 50,
        },
      },
    },
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]));

const server = new Server(
  {
    name: 'apify-b2b-ecom-mcp-server',
    version: '1.0.0',
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
