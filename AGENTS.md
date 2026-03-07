# WebMCP Documentation Agent Instructions

## Overview

Documentation for WebMCP, a W3C standard for making websites AI-accessible via `navigator.modelContext`. Built with [Mintlify](https://mintlify.com). Live at [docs.mcp-b.ai](https://docs.mcp-b.ai).

## Structure

**`docs.json`** is the source of truth for the full page hierarchy, navigation, groups, and nested hierarchies. The site uses five Diataxis tabs:

| Tab | Path prefix | Content type |
|-----|------------|--------------|
| **Home** | `index`, `start-here/` | Landing page, chooser |
| **Tutorials** | `tutorials/` | Learning-oriented guided exercises |
| **How-To Guides** | `how-to/` | Goal-oriented guides (adoption, frameworks, connectivity) |
| **Reference** | `reference/` | Factual package/API docs (standard, runtime, tooling, project) |
| **Explanation** | `explanation/` | Conceptual background (architecture, design) |

### Key files

| File/Directory | Purpose |
|---|---|
| `docs.json` | Navigation, theme, config |
| `_diataxis/SKILL.md` | Diataxis framework overview and compass |
| `_diataxis/references/` | 17 unabridged Diataxis reference pages from diataxis.fr |
| `_design-system.mdx` | Brand colors, typography, component examples |
| `_legacy/` | Old content (outdated, reference only during rewrite) |
| `.claude/agents/docs-writer.md` | Full docs-writer agent with source material map |
| `.claude/agents/docs-auditor.md` | PR-based docs staleness checker |

Each `.mdx` template contains a Diataxis type annotation and `Source from` line listing exact files to read. Read templates before writing.

## Source Material

The docs-writer agent at `.claude/agents/docs-writer.md` has the **complete source material map** with every local path organized by topic area. For quick reference:

| Source | Path (relative to `website-docs/`) |
|---|---|
| Monorepo architecture | `../CLAUDE.md` |
| WebMCP spec | `../docs/plans/WEBMCP_SPEC.md` |
| Package philosophy | `../docs/MCPB_PACKAGE_PHILOSOPHY.md` |
| W3C official spec (local) | `../../official-spec/webmcp/docs/` |
| Chrome team refs | `../webmcp-tools/` |
| Package READMEs | `../packages/*/README.md` |
| Type contracts | `../packages/webmcp-types/src/*.test-d.ts` |
| Sibling repos | `../../WebMCP/`, `../../mcp-ui-webmcp/`, `../../webmcp-sh/`, `../../chrome-devtools-quickstart/` |

## Diataxis

Read `_diataxis/SKILL.md` for the compass and full framework overview. Do not mix types on a single page. The four types:

- **Tutorials**: learning-oriented, teacher-led, no branching
- **How-to guides**: goal-oriented, assume competence, real-world conditions
- **Reference**: austere, factual, structured like the code
- **Explanation**: discursive, conceptual, admits opinion and context

## Writing Style

The `writing-clearly-and-concisely` skill (loaded by docs-writer agents) enforces Strunk's principles and AI pattern avoidance. These are the WebMCP-specific rules on top:

- Active voice, present tense, second-person ("you") for instructions
- Don't say "simply", "just", "leverage", "utilize", "robust", "seamless", "cutting-edge"
- Don't hedge: no "might", "could potentially", "in certain scenarios"
- Don't use em dashes. Use commas, periods, or parentheses.
- Don't write "Note that" or "It's important to note". Use a `<Note>` callout or state it directly.
- Lead with the verb in how-to steps: "Install the package", "Register a tool"
- Prefer short sentences. If a sentence has more than one comma, split it.
- Product names: "WebMCP" for the standard, `@mcp-b/*` for packages, "MCP-B" only in package scope contexts

## Code Examples

- Specify language for syntax highlighting
- Every example must be real, taken from source code or tests
- Use `twoslash` for TypeScript/TSX hover type info
- Use `CodeGroup` for multi-framework examples
- Add titles to code blocks: `"filename.ext"`
- Make long examples (50+ lines) expandable

## Mintlify Format

For components, frontmatter, and formatting, read `_design-system.mdx` and the [Mintlify docs](https://mintlify.com/docs). Frontmatter minimum:

```yaml
---
title: "Page Title"
description: "Brief description for SEO and llms.txt"
---
```

## Brand

| Key | Value |
|-----|-------|
| Primary color | #1F5EFF |
| Product name | "WebMCP" (not "MCP-B" in user-facing docs) |
| Package scope | `@mcp-b/*` |
| Organization | WebMCP-org |
| Docs URL | docs.mcp-b.ai |
| Live demo | webmcp.sh |
| Icons | Font Awesome (see docs.json) |

## Do Not

- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Reference outdated MiguelsPizza organization links
- Mix Diataxis content types within a single page
- Use `--no-verify` when committing

## Development

```bash
npx mintlify dev    # Preview at http://localhost:3000
```

Deployed automatically on push to main via Mintlify's GitHub integration.
