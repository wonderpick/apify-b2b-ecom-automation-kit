# Contributing

Contributions, bug reports, new ATS board slugs, and free-tool feature requests are welcome!

## Ways to Contribute
1. **Report broken targets or edge cases**: Open an issue with the target URL/slug and expected output.
2. **Request a new zero-login free tool or Actor**: Use the **Request a Free Tool or Data Source** issue template.
3. **Improve templates or docs**: Fork this repo, create a branch, and open a Pull Request.

## Guidelines
- Keep code dependencies minimal (prefer native `fetch` / Web Standards / Node 18+).
- Only access publicly available endpoints (no login bypass, no CAPTCHA bypass, no private PII scraping).
- Include deterministic unit tests for any parsing or URL-handling change.
