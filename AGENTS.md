# WebMCP Documentation Agent Instructions

## Overview

This documentation covers WebMCP - a W3C standard for making websites AI-accessible via `navigator.modelContext`. It enables any website to register tools, prompts, and resources that work with Claude, ChatGPT, and custom AI agents.

## Documentation Structure

**`docs.json`** is the single source of truth for the full page hierarchy. Read it to understand every page, its path, and where it sits in the navigation. The site is organized into five Diataxis tabs:

| Tab | Path prefix | Content type |
|-----|------------|--------------|
| **Home** | `index`, `start-here/` | Landing page, chooser |
| **Tutorials** | `tutorials/` | Learning-oriented guided exercises |
| **How-To Guides** | `how-to/` | Goal-oriented guides (adoption, frameworks, connectivity) |
| **Reference** | `reference/` | Factual package/API docs (standard, runtime, tooling, project) |
| **Explanation** | `explanation/` | Conceptual background (architecture, design) |

### Supporting files

| File/Directory | Purpose |
|---|---|
| `docs.json` | Mintlify config — **navigation, groups, nested hierarchies** |
| `AGENTS.md` | This file — agent instructions, source material, writing style |
| `CLAUDE.md` | Slim pointer to this file |
| `llms.txt` | LLM-optimized site overview for AI indexing |
| `_design-system.mdx` | Internal design system reference (colors, components) |
| `_diataxis/` | Complete Diataxis framework reference (SKILL.md + 17 reference pages) |
| `_legacy/` | Old content (outdated, reference only during rewrite) |

The documentation is being rewritten from scratch. Each `.mdx` template file contains a Diataxis type annotation and source material pointers — read them before writing.

## Source Material in the NPM Packages Repo

This docs site lives as a submodule inside the npm-packages monorepo. The monorepo is the **source of truth** for WebMCP's architecture, API surface, and implementation details. When writing documentation, search these locations for accurate, up-to-date information:

### WebMCP Spec & Chromium Implementation
- `../CLAUDE.md` — Architecture overview, package layering diagram, initialization flow, method location matrix
- `../docs/plans/WEBMCP_SPEC.md` — Chrome's WebMCP spec document (declarative/imperative APIs, form annotations, CSS pseudo-classes)
- `../e2e/web-standards-showcase/CHROMIUM_FLAGS.md` — Chromium flags to enable native `navigator.modelContext`, with Blink source paths
- `../e2e/tests/CHROMIUM_TESTING.md` — Native API contract testing docs

**Chromium source code locations** (for reference, not for linking in docs):
- `third_party/blink/renderer/modules/model_context/` — Core WebMCP implementation
- `third_party/blink/web_tests/external/wpt/model-context/` — Web platform tests
- `chrome/browser/about_flags.cc` — Feature flags

**Official spec links**:
- W3C WebMCP Spec: https://webmachinelearning.github.io/webmcp/
- WebMCP Proposal: https://github.com/webmachinelearning/webmcp
- Proposal Document: https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md
- W3C Community Group: https://www.w3.org/community/webmachinelearning/
- Model Context Protocol: https://modelcontextprotocol.io/

### Package Documentation (source of truth for each package)
Each package README is the authoritative description of what it does:
- `../packages/global/README.md` — `@mcp-b/global`: Entry point, auto-initializes polyfill + BrowserMcpServer
- `../packages/webmcp-polyfill/README.md` — `@mcp-b/webmcp-polyfill`: Strict core API polyfill
- `../packages/webmcp-ts-sdk/README.md` — `@mcp-b/webmcp-ts-sdk`: Browser MCP SDK with dynamic tool registration
- `../packages/webmcp-types/README.md` — `@mcp-b/webmcp-types`: Zero-runtime TypeScript types
- `../packages/react-webmcp/README.md` — `@mcp-b/react-webmcp`: React hooks (`useWebMCP`)
- `../packages/transports/README.md` — `@mcp-b/transports`: Tab and iframe transports
- `../packages/mcp-iframe/README.md` — `@mcp-b/mcp-iframe`: Iframe MCP communication
- `../packages/chrome-devtools-mcp/README.md` — `@mcp-b/chrome-devtools-mcp`: DevTools Protocol bridge
- `../packages/extension-tools/README.md` — `@mcp-b/extension-tools`: Browser extension utilities
- `../packages/smart-dom-reader/README.md` — `@mcp-b/smart-dom-reader`: DOM content extraction
- `../packages/webmcp-local-relay/README.md` — `@mcp-b/webmcp-local-relay`: Local relay server
- `../packages/agent-skills/README.md` — `@mcp-b/agent-skills`: Skill parser/validator

### Type Definitions (API surface reference)
Type test files are the best examples of the actual API contracts:
- `../packages/webmcp-types/src/index.test-d.ts` — ModelContext, tool registration, consumer API
- `../packages/webmcp-types/src/tool.test-d.ts` — ToolDescriptor, StreamedToolDescriptor, execution context
- `../packages/webmcp-types/src/activation.test-d.ts` — Activation types
- `../packages/webmcp-types/src/json-schema.test-d.ts` — JSON Schema types
- `../packages/webmcp-types/src/global-register-tools.test-d.ts` — Global registration patterns
- `../packages/webmcp-types/src/typed-model-context.test-d.ts` — Typed model context

### Architecture & Philosophy
- `../docs/MCPB_PACKAGE_PHILOSOPHY.md` — Package boundaries, core vs extension layers
- `../docs/global-guide.md` — Advanced `@mcp-b/global` usage patterns
- `../docs/TESTING.md` — E2E testing strategy
- `../docs/TESTING_PHILOSOPHY.md` — Testing philosophy

### E2E Tests (real-world usage examples)
- `../e2e/tests/chromium-native-api.spec.ts` — Native API contract tests
- `../e2e/tests/chrome-beta-webmcp.spec.ts` — Chrome Beta testing

### How to Search the Monorepo

When you need specific implementation details:

```bash
# Find how a specific API is used
grep -r "registerTool" ../packages/*/src/ --include="*.ts" -l

# Find type definitions
grep -r "interface ModelContext" ../packages/webmcp-types/src/ --include="*.ts"

# Find test examples for an API
grep -r "registerTool\|registerPrompt\|registerResource" ../packages/*/src/ --include="*.test*" -l

# Find package entry points
ls ../packages/*/src/index.ts

# Find all README files for package descriptions
ls ../packages/*/README.md

# Search docs directory for spec information
grep -r "navigator.modelContext" ../docs/ --include="*.md" -l
```

## Diataxis Framework

This documentation follows the [Diataxis framework](https://diataxis.fr/) for technical documentation. The complete, unabridged Diataxis reference is available at `_diataxis/` in this repo — read `_diataxis/SKILL.md` for the overview and `_diataxis/references/` for all source content from diataxis.fr.

| Type | Purpose | Location | User need |
|------|---------|----------|-----------|
| **[Tutorials](https://diataxis.fr/tutorials/)** | Learning-oriented | `quickstart.mdx`, `examples.mdx` | "I want to learn" |
| **[How-to Guides](https://diataxis.fr/how-to-guides/)** | Task-oriented | `frameworks/`, `calling-tools/`, guides | "I want to do X" |
| **[Explanation](https://diataxis.fr/explanation/)** | Understanding-oriented | `concepts/` | "I want to understand" |
| **[Reference](https://diataxis.fr/reference/)** | Information-oriented | `packages/`, `tools/` | "I need to look up Y" |

Key principles from Diataxis:
- **Tutorials** should be reliable, repeatable, and focused on learning (not the product)
- **How-to guides** should solve specific problems and assume competence
- **Explanation** should clarify and illuminate, not instruct
- **Reference** should be austere and accurate, structured around the code

When writing new pages, identify which Diataxis quadrant it belongs to and follow the conventions for that type. Do not mix types — a how-to guide should not try to explain concepts inline.

## Writing Style

The `writing-clearly-and-concisely` skill is loaded for all docs-writer agents. It enforces Strunk's principles and AI pattern avoidance automatically. The rules below are WebMCP-specific additions on top of that skill.

### Voice

- Use active voice and present tense
- Second-person ("you") for instructions
- Keep sentences concise and scannable
- Provide code examples for all technical concepts
- Use callouts (Note, Warning, Tip, Check) to highlight important information
- Link to related content liberally
- Include descriptions in frontmatter for llms.txt indexing
- Prerequisites at start of procedural content

### WebMCP-specific tone rules

- **Don't say "simply"** before install commands or setup steps. If it were simple, they wouldn't need docs.
- **Don't say "just"** to minimize effort. ("Just add a script tag" — if they knew that, they wouldn't be here.)
- **Don't hedge with "might", "could potentially", "in certain scenarios"** — state what happens and when.
- **Don't use em dashes** — use commas, periods, or parentheses instead. Em dashes are an AI tell.
- **Don't use "leverage", "utilize", "facilitate"** — use "use", "run", "call", "send".
- **Don't use "robust", "seamless", "cutting-edge", "groundbreaking"** — describe what it actually does.
- **Don't use "Note that" or "It's important to note"** — use a `<Note>` callout or state the fact directly.
- **Don't use "ecosystem"** unless referring to the actual npm/browser ecosystem. Don't say "WebMCP ecosystem".
- **Prefer short sentences.** If a sentence has more than one comma, split it.
- **Lead with the verb** in how-to steps: "Install the package", "Register a tool", "Run the dev server".
- **Use the product name correctly**: "WebMCP" for the standard, `@mcp-b/*` for packages, "MCP-B" only in package scope contexts.

## Code Examples

- Always specify language for syntax highlighting
- Use realistic, working examples — test before publishing
- Use `twoslash` for TypeScript/TSX examples to enable hover type information
- Add titles to major code examples: `"filename.ext"` or `"Description"`
- Make long examples expandable (50+ lines): add `expandable` option
- Use `CodeGroup` for multi-language or multi-framework examples
- Use diff syntax for good vs. bad comparisons: `// [!code ++]` and `// [!code --]`
- Highlight key lines in teaching examples: `highlight={5-12}`

Example:
````markdown
```tsx "MyComponent.tsx" twoslash lines icon="react" highlight={5-7}
import { useWebMCP } from '@mcp-b/react-webmcp';

function MyComponent() {
  useWebMCP({
    name: 'my_tool',
    handler: async (args) => { ... }
  });
}
```
````

## MDX Components to Use

### Layout & Navigation
- `<Steps>` for sequential procedures
- `<Tabs>` for multi-language/framework code examples
- `<Columns>` with `<Card>` for feature highlights
- `<Accordion>` for expandable content
- `<CardGroup>` for card grids

### Callouts
- `<Note>` for general information
- `<Warning>` for important cautions
- `<Tip>` for helpful suggestions
- `<Check>` for success states
- `<Info>` for additional context

### Code
- `<CodeGroup>` for tabbed code blocks
- `<ResponseField>` for API response documentation
- `<ParamField>` for parameter documentation
- `<Expandable>` for collapsible sections

### Interactive
- `<Frame>` for images with captions
- `<Video>` for embedded videos
- `<Snippet file="name.mdx" />` for reusable content

## Reusable Snippets

Create snippets in `/snippets/` for content that appears in multiple places. Import with:

```mdx
<Snippet file="snippets/example.mdx" />
```

Previous JSX snippets for live examples are in `_legacy/snippets-jsx/` for reference.

## Frontmatter Template

Every page must have frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description for SEO and llms.txt"
---
```

Optional fields:
```yaml
---
title: "Advanced Page"
description: "Page with all options"
icon: gear
sidebarTitle: "Short Title"
mode: wide
---
```

## Brand Guidelines

- **Primary color**: #1F5EFF (blue)
- **Light variant**: #4B7BFF
- **Dark variant**: #1449CC
- **Product name**: "WebMCP" (not "MCP-B" in user-facing docs)
- **Package scope**: `@mcp-b/*`
- **Organization**: WebMCP-org
- **Docs URL**: docs.mcp-b.ai
- **Live demo**: webmcp.sh
- **Icon library**: Font Awesome (see docs.json)

## Project Context

- **Format**: MDX files with YAML frontmatter
- **Config**: docs.json for navigation, theme, settings
- **Components**: Mintlify built-in components
- **Organization**: WebMCP-org GitHub organization
- **Main repo**: https://github.com/WebMCP-org/docs
- **NPM packages repo**: https://github.com/WebMCP-org/npm-packages
- **Examples repo**: https://github.com/WebMCP-org/examples

## AI Features

### Contextual Menu
Users can access the contextual menu to:
- Copy page as Markdown
- View raw Markdown
- Open in ChatGPT, Claude, or Perplexity
- Copy MCP server URL
- Connect to Cursor or VS Code

### llms.txt
The `llms.txt` file at the root provides an LLM-optimized overview for AI indexing and discovery.

## Local Development

```bash
cd website-docs
npx mintlify dev
```

Preview at http://localhost:3000

## Deployment

Docs are automatically deployed when changes are pushed to the main branch via Mintlify's GitHub integration.

## Do Not

- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions — always ask for clarification
- Reference outdated MiguelsPizza organization links
- Commit node_modules or build artifacts
- Mix Diataxis content types within a single page

## Git Workflow

- NEVER use --no-verify when committing
- NEVER skip or disable pre-commit hooks
- Ask how to handle uncommitted changes before starting
- Use descriptive commit messages following conventional commits
- Commit format: `<type>(<scope>): <subject>` (e.g., `docs(concepts): add transports explanation`)

## Mintlify Documentation Reference

Use these official Mintlify resources when working on documentation:

### Essential References
- **[Global settings](https://mintlify.com/docs/organize/settings)**: Complete docs.json configuration options
- **[Navigation](https://mintlify.com/docs/organize/navigation)**: Structure and customize navigation hierarchy
- **[Pages](https://mintlify.com/docs/organize/pages)**: Page creation and frontmatter requirements
- **[Format text](https://mintlify.com/docs/create/text)**: Text formatting, headers, and styling
- **[Format code](https://mintlify.com/docs/create/code)**: Inline code and code blocks with syntax highlighting

### Components
- **[Callouts](https://mintlify.com/docs/components/callouts)**: Info, warning, success, and error callouts
- **[Cards](https://mintlify.com/docs/components/cards)**: Highlight main points with customizable layouts
- **[Tabs](https://mintlify.com/docs/components/tabs)**: Toggle between different content views
- **[Code groups](https://mintlify.com/docs/components/code-groups)**: Display multiple code examples
- **[Accordions](https://mintlify.com/docs/components/accordions)**: Collapsible content sections
- **[Steps](https://mintlify.com/docs/components/steps)**: Sequential procedural content

### Content Creation
- **[Reusable snippets](https://mintlify.com/docs/create/reusable-snippets)**: Keep content in sync across pages
- **[Images and embeds](https://mintlify.com/docs/create/image-embeds)**: Add images, videos, and iframes
- **[Lists and tables](https://mintlify.com/docs/create/list-table)**: Display structured information
- **[Redirects and broken links](https://mintlify.com/docs/create/broken-links)**: Prevent invalid links

### Best Practices
- **[Style and tone](https://mintlify.com/docs/guides/style-and-tone)**: Writing effective technical documentation
- **[Content types](https://mintlify.com/docs/guides/content-types)**: Create the right content for your users
- **[Organize navigation](https://mintlify.com/docs/guides/navigation)**: Information architecture guidelines
- **[SEO](https://mintlify.com/docs/guides/seo)**: Improve documentation discoverability

### Deployment
- **[GitHub integration](https://mintlify.com/docs/deploy/github)**: Sync docs with GitHub repo
- **[Preview deployments](https://mintlify.com/docs/deploy/preview-deployments)**: Preview changes before merging
- **[CLI installation](https://mintlify.com/docs/installation)**: Preview and maintain docs locally
