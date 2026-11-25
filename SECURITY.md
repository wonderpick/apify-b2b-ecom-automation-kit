# Security Policy

## Scope

This repository hosts open-source MCP server definitions, zero-login Cloudflare Worker web tools, n8n/Make/Clay templates, and documentation for public-web data extraction pipelines.

## Security Guarantees in Our Free Web Tools & MCP Server

- **Strict SSRF Defense**: Private IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.169.254`, IPv6 ULA/link-local, `metadata.goog`, `.internal`, `.local`), embedded URL credentials, and non-HTTP(S) schemes are blocked on every hop.
- **Zero Untrusted HTML Injection**: All browser utilities render external strings strictly via `textContent` and validated `http:`/`https:` anchors.
- **CSV Formula Injection Neutralization**: Every exported CSV cell strips/escapes leading formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`, `\n`) per OWASP guidance.
- **Linear-Time Parsing**: No catastrophic backtracking regexes on untrusted HTML/RSS payloads.

## Reporting a Vulnerability

If you discover a security issue in any web tool, CLI, or MCP server in this repository:
1. Please open a GitHub Security Advisory via the **Security** tab of this repository (preferred for private disclosure), or
2. Open an issue with `[Security]` in the title if the impact is non-sensitive.

We acknowledge valid reports within 48 hours and ship verified patches promptly.
