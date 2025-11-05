# WebMCP Documentation Snippets

Reusable code snippets for consistent documentation across the WebMCP docs.

## Purpose

This directory contains reusable code snippets that appear frequently throughout the documentation. Using snippets:
- **Reduces duplication** - Update once, reflect everywhere
- **Improves consistency** - Single source of truth for common patterns
- **Simplifies maintenance** - Easier to update and maintain code examples
- **Speeds up authoring** - Ready-to-use components for documentation

## Directory Structure

```
snippets/
├── core/           # Essential patterns (tool registration, hooks, responses)
├── imports/        # Common import statements
├── validation/     # Schema patterns (Zod, JSON Schema)
├── clients/        # Transport/client setup
├── patterns/       # Advanced patterns (error handling, lifecycle)
├── templates/      # Complete example templates
└── examples/       # Full working examples (React components)
```

## Available Snippets

### Core Patterns (`snippets/core/`)

**Tool Registration:**
- `register-tool-basic.mdx` - Basic tool registration
- `register-tool-with-cleanup.mdx` - Tool registration with cleanup tracking

**React Hooks:**
- `use-webmcp-basic.mdx` - Basic useWebMCP hook
- `use-webmcp-with-state.mdx` - useWebMCP with execution state tracking

**Response Formats:**
- `response-success.mdx` - Standard success response
- `response-error.mdx` - Error response with isError flag
- `response-markdown.mdx` - Markdown-formatted response

### Import Statements (`snippets/imports/`)

- `react-imports.mdx` - React WebMCP imports
- `vanilla-imports.mdx` - Vanilla JS imports
- `client-imports.mdx` - MCP client imports

### Validation (`snippets/validation/`)

**Basic Validation:**
- `zod-basic.mdx` - Basic Zod schema
- `json-schema-basic.mdx` - Basic JSON Schema

**Advanced Validation (Phase 2):**
- `zod-complex.mdx` - Advanced Zod schema with complex validation
- `zod-nested.mdx` - Nested object Zod schema
- `zod-discriminated-union.mdx` - Discriminated union pattern
- `json-schema-complex.mdx` - Complex JSON Schema with nested objects

### Clients (`snippets/clients/`)

**React Client:**
- `mcp-client-provider.mdx` - MCP client provider setup (React)

**Tab Transports (Phase 2):**
- `tab-server-setup.mdx` - Tab server transport setup
- `tab-client-setup.mdx` - Tab client transport setup

**Iframe Transports (Phase 2):**
- `iframe-parent-setup.mdx` - Iframe parent transport setup
- `iframe-child-setup.mdx` - Iframe child transport setup

**Extension Transports (Phase 2):**
- `extension-client-setup.mdx` - Extension client transport setup
- `extension-server-setup.mdx` - Extension server transport setup

### Patterns (`snippets/patterns/`)

**Error & API Handling:**
- `error-handling.mdx` - Standard error handling pattern
- `fetch-api.mdx` - Fetch API pattern for backend calls

**Lifecycle & Performance (Phase 2):**
- `lifecycle-cleanup.mdx` - Lifecycle cleanup pattern
- `optimistic-update.mdx` - Optimistic update pattern for instant UX

### Examples (`snippets/examples/`)

Full working React components:
- `webmcp-tool-storage.jsx` - Storage management tool
- `webmcp-tool-calculator.jsx` - Calculator tool
- `webmcp-tool-color-converter.jsx` - Color converter
- `webmcp-tool-dom-query.jsx` - DOM query tool

## Usage in Documentation

Each snippet file is a standalone MDX file containing a code block. Import and use them in your documentation:

```mdx
import RegisterTool from '/snippets/core/register-tool-basic.mdx';

<RegisterTool />
```

Or reference the code directly:
```mdx
See [basic tool registration](/snippets/core/register-tool-basic.mdx) for the pattern.
```

## Creating New Snippets

### When to Create a Snippet

Create a snippet if:
- ✅ Pattern appears **3+ times** across different files
- ✅ Pattern is **foundational** (imports, basic setup)
- ✅ Pattern needs to **stay consistent** (security, best practices)
- ✅ Pattern is **likely to change** (API updates, deprecations)

**Don't create a snippet if:**
- ❌ Pattern appears only 1-2 times
- ❌ Pattern is page-specific context
- ❌ Pattern benefits from inline explanation

### Snippet File Structure

```mdx
{/*
# Snippet Title

Brief description of the snippet and when to use it.

## When to use:
- Use case 1
- Use case 2

## Example usage in docs:
```mdx
import CodeBlock from '/snippets/category/snippet-name.mdx';

<CodeBlock />
```
*/}

```language "filename" attributes
// Your code here
```
```

### Naming Conventions

**Files:**
- Use kebab-case: `register-tool-basic.mdx`
- Be descriptive: `use-webmcp-with-state.mdx` not `hook2.mdx`
- Include variation: `-basic`, `-advanced`, `-with-state`

**Categories:**
- `core/` - Essential, frequently-used patterns
- `imports/` - Import statements
- `validation/` - Schema patterns
- `clients/` - Client setup and transports
- `patterns/` - Advanced patterns
- `templates/` - Complete starting templates
- `examples/` - Full working React components

## Maintenance

### Updating Snippets

When updating a snippet:
1. **Review all usages** - Search for imports of this snippet
2. **Test changes** - Preview affected pages with `mintlify dev`
3. **Document changes** - Update comments in snippet file
4. **Communicate impact** - Note in commit message

### Version Control

Track snippet changes in commit messages:
```
feat(snippets): add basic tool registration snippet
fix(snippets): update error response format
docs(snippets): improve zod schema example
```

## Phase 1 Implementation (Completed)

**Created snippets:**
- ✅ Core tool registration (2 snippets)
- ✅ React hooks (2 snippets)
- ✅ Response formats (3 snippets)
- ✅ Import statements (3 snippets)
- ✅ Validation patterns (2 snippets)
- ✅ Client setup (1 snippet)
- ✅ Error handling (1 snippet)

**Total:** 14 foundational snippets

## Phase 2 Implementation (Completed)

**Created snippets:**
- ✅ Advanced Zod schemas (3 snippets: complex, nested, discriminated union)
- ✅ Complex JSON Schema (1 snippet)
- ✅ Tab transports (2 snippets: server, client)
- ✅ Iframe transports (2 snippets: parent, child)
- ✅ Extension transports (2 snippets: client, server)
- ✅ Advanced patterns (3 snippets: fetch API, lifecycle, optimistic updates)

**Total:** 13 additional snippets

**Grand Total:** 27 reusable snippets

## Next Steps

### Phase 3: Templates & Examples (Planned)
- Complete tool templates
- React component templates
- Ready-to-use starting points

### Phase 4: Documentation Migration (Planned)
- Update high-traffic pages to use snippets
- Replace duplicated code across docs
- Achieve 90%+ adoption target

## Contributing

When adding new snippets:
1. Follow the file structure template above
2. Add entry to this README
3. Update CLAUDE.md if introducing new patterns
4. Test snippet in at least one doc page
5. Commit with descriptive message

## Questions?

See the full [Reusable Snippets Implementation Plan](../IMPLEMENTATION_PLAN.md) for detailed strategy and migration approach.
