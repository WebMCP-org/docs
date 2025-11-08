# WebMCP Documentation Snippets

Reusable code snippets for consistent documentation across the WebMCP docs.

## Purpose

- **Reduces duplication** - Update once, reflect everywhere
- **Improves consistency** - Single source of truth for common patterns
- **Simplifies maintenance** - Easier to update and maintain code examples
- **Speeds up authoring** - Ready-to-use components for documentation

## Documentation

📖 **[USING_SNIPPETS.md](../USING_SNIPPETS.md)** - Complete guide for documentation authors

This guide covers:
- When to use snippets vs. inline code
- How to import and display snippets
- Real-world migration examples
- Best practices and troubleshooting
- Common patterns and quick reference

## Directory Structure

```
snippets/
├── core/                         # Tool registration, hooks, responses (7 snippets)
├── imports/                      # Import statements (3 snippets)
├── validation/                   # Zod and JSON Schema (6 snippets)
├── clients/                      # Transport setup (7 snippets)
├── patterns/                     # Advanced patterns (4 snippets)
├── templates/                    # Complete examples (6 templates)
├── webmcp-polyfill-setup.jsx     # Polyfill setup component
└── webmcp-tool-*.jsx             # Full working tool examples (5 files)
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

**Advanced Validation:**
- `zod-complex.mdx` - Advanced Zod schema with complex validation
- `zod-nested.mdx` - Nested object Zod schema
- `zod-discriminated-union.mdx` - Discriminated union pattern
- `json-schema-complex.mdx` - Complex JSON Schema with nested objects

### Clients (`snippets/clients/`)

**React Client:**
- `mcp-client-provider.mdx` - MCP client provider setup (React)

**Tab Transports:**
- `tab-server-setup.mdx` - Tab server transport setup
- `tab-client-setup.mdx` - Tab client transport setup

**Iframe Transports:**
- `iframe-parent-setup.mdx` - Iframe parent transport setup
- `iframe-child-setup.mdx` - Iframe child transport setup

**Extension Transports:**
- `extension-client-setup.mdx` - Extension client transport setup
- `extension-server-setup.mdx` - Extension server transport setup

### Patterns (`snippets/patterns/`)

**Error & API Handling:**
- `error-handling.mdx` - Standard error handling pattern
- `fetch-api.mdx` - Fetch API pattern for backend calls

**Lifecycle & Performance:**
- `lifecycle-cleanup.mdx` - Lifecycle cleanup pattern
- `optimistic-update.mdx` - Optimistic update pattern for instant UX

### Templates (`snippets/templates/`)

**Complete Tool Templates:**
- `basic-tool-template.mdx` - Ready-to-use basic tool with all best practices (~100 lines)
- `crud-tool-template.mdx` - Full CRUD operations with action-based pattern (~200 lines)
- `search-tool-template.mdx` - Search with filters, pagination, and sorting (~150 lines)
- `vanilla-tool-template.mdx` - Complete vanilla JS tool (no React) (~250 lines)

**Component Templates:**
- `multi-tool-component.mdx` - Component registering multiple related tools (~180 lines)
- `provider-with-tools.mdx` - Context provider with application-level tools (~200 lines)

### Full Working Examples (root `.jsx` files)

Complete, production-ready React components in the snippets root directory:
- `webmcp-tool-storage.jsx` - Storage management tool with CRUD operations
- `webmcp-tool-calculator.jsx` - Calculator tool with validation
- `webmcp-tool-color-converter.jsx` - Color format converter
- `webmcp-tool-dom-query.jsx` - DOM query and manipulation tool
- `webmcp-polyfill-setup.jsx` - Polyfill setup for non-WebMCP browsers

## Quick Start

### Using a Snippet

```mdx
import RegisterTool from '/snippets/core/register-tool-basic.mdx';

## Tool Registration

Here's the basic pattern:

<RegisterTool />
```

### Using a Template

```mdx
import CrudTemplate from '/snippets/templates/crud-tool-template.mdx';

## Building a CRUD Tool

Start with this complete template:

<CrudTemplate />

**Customize:**
1. Change tool name
2. Update schema
3. Connect to your API
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
- Root `.jsx` files - Full working React components

## Maintenance

### Updating Snippets

When updating a snippet:
1. Find all usages: `grep -r "snippet-name" docs/`
2. Update the snippet file
3. Test all affected pages: `mintlify dev`
4. Document changes in commit message

### Version Control

```bash
# Good commit messages
feat(snippets): add basic tool registration snippet
fix(snippets): update error response format
docs(snippets): improve zod schema example
```

## Summary

**Total:** 33 reusable snippets and templates

**Categories:**
- 7 core patterns
- 3 import statements
- 6 validation patterns
- 7 client/transport setups
- 4 advanced patterns
- 6 complete templates

**Impact:**
- ~2,000 lines of reusable code
- Reduces duplication by 60-87% when adopted
- Single source of truth for common patterns
- Faster documentation authoring

## Contributing

When adding new snippets:
1. Follow the file structure template above
2. Add entry to this README
3. Update USING_SNIPPETS.md if introducing new patterns
4. Test snippet in at least one doc page
5. Commit with descriptive message
