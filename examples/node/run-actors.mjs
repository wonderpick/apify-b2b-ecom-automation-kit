/**
 * Minimal Node.js (v20+, zero dependencies) runner for the Apify B2B & E-Commerce Automation Kit.
 * Usage:
 *   APIFY_TOKEN=apify_api_xxx node examples/node/run-actors.mjs
 */

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error('Missing APIFY_TOKEN environment variable.');
  process.exit(1);
}

async function runActorSync(actorSlug, input, memoryMb = 256) {
  const url = `https://api.apify.com/v2/acts/${actorSlug}/run-sync-get-dataset-items?memory=${memoryMb}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${APIFY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Apify API error (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

// 1. B2B Company to Domain, LinkedIn, Email & WhatsApp Enricher ($2.50 / 1K, 128MB RAM)
const enrichedLeads = await runActorSync('maitreya_buddha~b2b-company-domain-linkedin-enricher', {
  inputs: ['Stripe', 'Linear', 'canva.com'],
  enrichContactPages: true,
  minConfidence: 'medium',
});
console.log('Enriched B2B Leads:', JSON.stringify(enrichedLeads, null, 2));

// 2. SaaS Trust Center, SOC 2 & AI Subprocessor Audit ($5 / 1K, 128MB RAM)
const trustAudits = await runActorSync('maitreya_buddha~saas-trust-center-soc2-monitor', {
  domains: ['apify.com', 'linear.app'],
  mode: 'audit',
  checkSubprocessors: true,
  checkDnsIam: true,
});
console.log('SaaS Trust Center Audits:', JSON.stringify(trustAudits, null, 2));

// 3. Shopify Competitor Price & Stock Delta Monitor ($2 / 1K real changes, $0 baseline)
const shopifyDeltas = await runActorSync('maitreya_buddha~shopify-competitor-delta-monitor', {
  storeUrls: ['https://www.allbirds.com'],
  maxProductsPerStore: 100,
  emitBaselineSummary: true,
});
console.log('Shopify Delta Monitor:', JSON.stringify(shopifyDeltas, null, 2));

// 4. Meta Ads Advertiser Leak Audit & Email Enricher ($4.50 / 1K unique brands, 128MB RAM)
const metaAdsAudits = await runActorSync('maitreya_buddha~meta-ads-advertiser-leak-audit-email-enricher', {
  landingPageUrls: [
    'https://www.chomps.com/',
    'https://www.brooklinen.com/products/discontinued-summer-promo-demo-404',
  ],
  agencyPreset: 'auto_best_fit',
  crmExportPreset: 'default',
  maxBrands: 10,
});
console.log('Meta Ads Advertiser Audits:', JSON.stringify(metaAdsAudits, null, 2));
