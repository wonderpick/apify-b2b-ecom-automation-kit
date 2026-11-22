"""
Minimal Python runner for the Apify B2B & E-Commerce Automation Kit.
Usage:
    pip install requests
    export APIFY_TOKEN="apify_api_xxx"
    python examples/python/run_actors.py
"""

import json
import os
import sys
import requests

APIFY_TOKEN = os.environ.get("APIFY_TOKEN")
if not APIFY_TOKEN:
    print("Missing APIFY_TOKEN environment variable.", file=sys.stderr)
    sys.exit(1)


def run_actor_sync(actor_slug: str, payload: dict, memory_mb: int = 256):
    url = f"https://api.apify.com/v2/acts/{actor_slug}/run-sync-get-dataset-items"
    resp = requests.post(
        url,
        params={"memory": memory_mb},
        headers={
            "Authorization": f"Bearer {APIFY_TOKEN}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=180,
    )
    resp.raise_for_status()
    return resp.json()


if __name__ == "__main__":
    # 1. B2B Company to Domain, LinkedIn, Email & WhatsApp Enricher ($2.50 / 1K)
    leads = run_actor_sync(
        "maitreya_buddha~b2b-company-domain-linkedin-enricher",
        {
            "inputs": ["Stripe", "Linear", "canva.com"],
            "enrichContactPages": True,
            "minConfidence": "medium",
        },
    )
    print("Enriched B2B Leads:")
    print(json.dumps(leads, indent=2))

    # 2. SaaS Trust Center, SOC 2 & AI Subprocessor Monitor ($5 / 1K)
    audits = run_actor_sync(
        "maitreya_buddha~saas-trust-center-soc2-monitor",
        {
            "domains": ["apify.com", "linear.app"],
            "mode": "audit",
            "checkSubprocessors": True,
            "checkDnsIam": True,
        },
    )
    print("\nSaaS Trust Center Audits:")
    print(json.dumps(audits, indent=2))

    # 3. Meta Ads Advertiser Leak Audit & Email Enricher ($4.50 / 1K unique brands)
    meta_ads = run_actor_sync(
        "maitreya_buddha~meta-ads-advertiser-leak-audit-email-enricher",
        {
            "landingPageUrls": [
                "https://www.chomps.com/",
                "https://www.brooklinen.com/products/discontinued-summer-promo-demo-404",
            ],
            "agencyPreset": "auto_best_fit",
            "crmExportPreset": "default",
            "maxBrands": 10,
        },
    )
    print("\nMeta Ads Advertiser Audits:")
    print(json.dumps(meta_ads, indent=2))
