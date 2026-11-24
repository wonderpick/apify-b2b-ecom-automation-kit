# Free Clay.com HTTP & Native Apify Recipes (60-Second Setup)

All 3 recipes below run on **Apify Pay-Per-Event (`$0` monthly subscription, `LIMITED_PERMISSIONS` = zero 403 errors)** and work out of the box with Apify's **`$5` free monthly credit**.

## Included Recipes + Real Live Sample CSVs

| Signal / Use Case | Clay JSON Recipe | Live Verified Sample CSV | Pricing (`$5` Free Credit Covers) | Backing Apify Actor |
| :--- | :--- | :--- | :--- | :--- |
| **1. iOS & Google Play Silent Churn + EU-DSA Leads** | [`app-store-churn-intel-clay-recipe.json`](./app-store-churn-intel-clay-recipe.json) | [`sample-11-app-store-churn-leads.csv`](../samples/sample-11-app-store-churn-leads.csv) | `$5 / 1,000` apps (**~1,000 unified app audits**) | [App Store & Google Play Churn Intel](https://apify.com/maitreya_buddha/app-store-google-play-churn-intel-lead-enricher) |
| **2. Live ATS Hiring Intent & 70+ Tech Stack (71K Boards)** | [`02-ats-jobs-hiring-intent-clay-recipe.json`](./02-ats-jobs-hiring-intent-clay-recipe.json) | [`sample-10-ats-hiring-intent-signals.csv`](../samples/sample-10-ats-hiring-intent-signals.csv) | `$0.99 / 1,000` rows (**~5,000 live ATS jobs**) | [ATS Jobs & Tech-Stack Monitor](https://apify.com/maitreya_buddha/ats-jobs-hiring-intent-tech-stack-monitor) |
| **3. Meta Ads 404/OOS/DMARC Leak Audit & 110+ Stack** | [`03-meta-ads-leak-audit-clay-recipe.json`](./03-meta-ads-leak-audit-clay-recipe.json) | [`sample-09-meta-ads-leak-audit.csv`](../samples/sample-09-meta-ads-leak-audit.csv) | `$4.50 / 1,000` unique brands (**~1,100 DTC audits**) | [Meta Ads Advertiser Leak Audit](https://apify.com/maitreya_buddha/meta-ads-advertiser-leak-audit-email-enricher) |

---

## 60-Second Clay Setup (Two Options)

### Option A: Clay Native "Run Apify Actor" Block (Fastest)
1. In your Clay table, click **Add enrichment** → search **Apify** → select **Run Apify Actor**.
2. Connect your free Apify API token (`https://console.apify.com/settings/integrations`).
3. Pick the Actor slug from the table above (e.g. `maitreya_buddha/app-store-google-play-churn-intel-lead-enricher`), map your Clay column (`{{company_domain}}` or `{{app_url}}`), and click **Save & run**.

### Option B: Clay Custom HTTP API Enrichment (Full Sync JSON Control)
1. Click **Add enrichment** → **HTTP API**.
2. Set Method to **`POST`** and paste the `endpoint` URL from the JSON recipe file above (`?timeout=60&memory=128`).
3. Add Headers: `Authorization: Bearer YOUR_APIFY_TOKEN` and `Content-Type: application/json`.
4. Paste `bodyTemplate`, map Clay tokens (`{{company_domain}}`), and map the output fields listed under `recommendedClayColumns`.
