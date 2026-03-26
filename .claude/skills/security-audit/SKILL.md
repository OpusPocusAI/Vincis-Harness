---
name: security-audit
description: Comprehensive security scan — npm audit, secrets, dangerous patterns, Supabase advisories, API auth
user_invocable: true
---

# /security-audit — Security Scan

Run a comprehensive security audit of the codebase.

## Steps

### 1. Dependency Vulnerabilities
Run `npm audit` in FE/, BE/, Origin/NewBE/. Count critical/high/medium/low. List criticals by name.

### 2. Exposed Secrets Scan
Grep .ts/.tsx/.js/.json files (NOT .env, node_modules, .git) for hardcoded API keys, secrets, passwords, tokens, Supabase keys outside .env, Bearer tokens in source.

### 3. Dangerous Code Patterns
Grep for: eval(), unescaped innerHTML, document.write, string-interpolated shell commands, unparameterized SQL, open CORS origins, non-httpOnly cookies.

### 4. Supabase Security
If Supabase MCP available: check advisories, RLS policies, exposed tables, auth configuration.

### 5. Environment File Audit
Verify .env in .gitignore. Check .env.example exists per service. Check git history for accidentally committed secrets.

### 6. API Authentication Audit
Scan for routes without auth middleware, missing rate limiting, unprotected admin/delete/update endpoints.

### 7. Output
Structured report with severity levels (CRITICAL/HIGH/MEDIUM/LOW). Save to memory/research/security-audit-{date}.md. Flag CRITICAL findings immediately.
