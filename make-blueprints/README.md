# Free Make.com Blueprints (1-Click Import `.json`)

Import any blueprint below directly into **Make.com** (`Scenarios → Create a new scenario → More (⋯) → Import Blueprint`) and replace `REPLACE_WITH_APIFY_TOKEN` with your free Apify token (`$5` free monthly credit at https://console.apify.com/settings/integrations).

| Blueprint | What It Automates | Live Sample Output | Backing Apify Actor |
| :--- | :--- | :--- | :--- |
| [`01-app-store-churn-intel-make-blueprint.json`](./01-app-store-churn-intel-make-blueprint.json) | Daily iOS + Google Play Silent Churn Monitor (`watchDiff`, `$0` unchanged) → Filter Score `>= 50` → Slack/CRM | [`sample-11-app-store-churn-leads.csv`](../samples/sample-11-app-store-churn-leads.csv) | [App Store & Google Play Churn Intel](https://apify.com/maitreya_buddha/app-store-google-play-churn-intel-lead-enricher) |
| [`02-ats-hiring-intent-make-blueprint.json`](./02-ats-hiring-intent-make-blueprint.json) | Weekly ATS Hiring-Intent & 70+ Tech-Stack Monitor (71K Boards, `$0.99/1K`) → Filter Score `>= 60` → Slack/CRM | [`sample-10-ats-hiring-intent-signals.csv`](../samples/sample-10-ats-hiring-intent-signals.csv) | [ATS Jobs & Tech-Stack Monitor](https://apify.com/maitreya_buddha/ats-jobs-hiring-intent-tech-stack-monitor) |
| [`03-meta-ads-leak-audit-make-blueprint.json`](./03-meta-ads-leak-audit-make-blueprint.json) | Weekly Meta Ads 404/OOS/DMARC Leak Audit (`watch_diff`, `$0` repeats) → `outreachStatus == ready` → Slack/CRM | [`sample-09-meta-ads-leak-audit.csv`](../samples/sample-09-meta-ads-leak-audit.csv) | [Meta Ads Advertiser Leak Audit](https://apify.com/maitreya_buddha/meta-ads-advertiser-leak-audit-email-enricher) |
