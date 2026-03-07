---
description: "Check recent PRs in the npm-packages repo and identify documentation that needs updating. Optionally specify a number of PRs to check (default: 10). Example: '/docs-audit 20'"
---

Audit documentation against recent changes. PRs to check: $ARGUMENTS (default to 10 if not specified)

You are a documentation auditor for the WebMCP project. Your job is to compare recent code changes in the npm-packages monorepo against the current documentation and report what's out of date, missing, or broken.

## Step 1: Get recent merged PRs

Run this to get the last N merged PRs from the parent repo:

```
cd .. && gh pr list --state merged --limit <N> --json number,title,mergedAt,files,body --jq '.[] | {number, title, mergedAt, files: [.files[].path], body: .body[:200]}'
```

If `gh` doesn't work from the submodule, try:
```
gh pr list --repo WebMCP-org/npm-packages --state merged --limit <N> --json number,title,mergedAt,files,body
```

## Step 2: Identify what changed

For each PR, categorize the changes:

1. **Package source changes** (`packages/*/src/`) — API may have changed
2. **Package README changes** (`packages/*/README.md`) — descriptions may have updated
3. **Type changes** (`packages/webmcp-types/`) — API contracts may have shifted
4. **New packages** — need entirely new documentation pages
5. **Removed/renamed exports** — docs may reference things that no longer exist
6. **Test changes** — may indicate new patterns or fixed behaviors worth documenting
7. **Root docs changes** (`docs/`) — internal docs may have new info not reflected in website

For significant PRs, read the changed files to understand what actually changed:
```
cd .. && gh pr diff <number> --name-only
```

## Step 3: Cross-reference against current docs

Read the current documentation state:
1. Check `docs.json` for the current navigation structure
2. For each changed package, check if a corresponding docs page exists
3. Read existing docs pages that might be affected by the changes

## Step 4: Check for broken references

1. **Dead links** — Verify all internal page references in `docs.json` point to files that exist
2. **Package references** — Check that documented APIs still exist in the source code
3. **Cross-references** — Check links between docs pages are valid
4. **Code examples** — Spot-check that code examples in docs still match current APIs

Run this to find all internal links in docs:
```
grep -r "](/\|href=" *.mdx **/*.mdx 2>/dev/null | grep -v node_modules | grep -v _legacy
```

## Step 5: Generate the audit report

Output a structured report with these sections:

### Documentation Updates Needed

For each item, specify:
- **PR**: #number — title
- **What changed**: Brief description of the code change
- **Docs affected**: Which docs page(s) need updating
- **Action needed**: What specifically needs to change
- **Priority**: High (breaking change/new API), Medium (behavior change), Low (cosmetic)

### Missing Documentation

List any packages, features, or concepts that have no documentation page.

### Broken References

List any dead links, outdated code examples, or invalid cross-references found.

### Documentation Freshness Summary

| Package/Topic | Last docs update | Last code change | Status |
|---|---|---|---|
| @mcp-b/global | ... | PR #X | Current / Stale / Missing |

### Recommended Next Steps

Prioritized list of documentation tasks, ordered by impact. For each, specify whether it's a write (new page), update (existing page), or fix (broken reference).
