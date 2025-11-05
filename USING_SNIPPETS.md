# Using Snippets in WebMCP Documentation

A practical guide for documentation authors on how to use reusable snippets to maintain consistency and reduce duplication.

## Quick Start

### What Are Snippets?

Snippets are reusable MDX files containing common code patterns used throughout the WebMCP documentation. Instead of copying and pasting the same code examples across multiple pages, we import them from a central location.

### Why Use Snippets?

- **Single source of truth** - Update code once, changes reflect everywhere
- **Consistency** - All examples follow the same patterns
- **Maintainability** - Fix bugs or update APIs in one place
- **Speed** - Faster to write documentation

### When to Use Snippets

✅ **Use snippets for:**
- Code that appears 3+ times across docs
- Standard patterns (tool registration, validation, transports)
- Import statements
- Response formats
- Client setup examples

❌ **Don't use snippets for:**
- Page-specific examples with unique context
- One-off code that appears only 1-2 times
- Tutorial walkthroughs where step-by-step explanation is key

---

## Available Snippets

### Core Patterns (`snippets/core/`)

**Tool Registration:**
- `register-tool-basic.mdx` - Basic tool registration pattern
- `register-tool-with-cleanup.mdx` - Tool with cleanup tracking

**React Hooks:**
- `use-webmcp-basic.mdx` - Basic useWebMCP hook usage
- `use-webmcp-with-state.mdx` - Hook with execution state

**Response Formats:**
- `response-success.mdx` - Standard success response
- `response-error.mdx` - Error response format
- `response-markdown.mdx` - Markdown-formatted response

### Import Statements (`snippets/imports/`)

- `react-imports.mdx` - React WebMCP setup imports
- `vanilla-imports.mdx` - Vanilla JavaScript imports
- `client-imports.mdx` - MCP client imports

### Validation (`snippets/validation/`)

**Basic:**
- `zod-basic.mdx` - Simple Zod schema
- `json-schema-basic.mdx` - Simple JSON Schema

**Advanced:**
- `zod-complex.mdx` - Complex Zod with multiple constraints
- `zod-nested.mdx` - Nested object schema
- `zod-discriminated-union.mdx` - Union types for actions
- `json-schema-complex.mdx` - Complex JSON Schema

### Client Setup (`snippets/clients/`)

**Tab Transports:**
- `tab-server-setup.mdx` - TabServerTransport configuration
- `tab-client-setup.mdx` - TabClientTransport configuration

**Iframe Transports:**
- `iframe-parent-setup.mdx` - Parent page setup
- `iframe-child-setup.mdx` - Iframe child setup

**Extension Transports:**
- `extension-client-setup.mdx` - Extension UI client
- `extension-server-setup.mdx` - Extension background server

**React Client:**
- `mcp-client-provider.mdx` - McpClientProvider setup

### Patterns (`snippets/patterns/`)

- `error-handling.mdx` - Standard error handling
- `fetch-api.mdx` - API calls with credentials
- `lifecycle-cleanup.mdx` - Cleanup with useEffect
- `optimistic-update.mdx` - Instant UI updates

### Templates (`snippets/templates/`)

Complete, production-ready code:
- `basic-tool-template.mdx` - Ready-to-use basic tool (~100 lines)
- `crud-tool-template.mdx` - Full CRUD operations (~200 lines)
- `search-tool-template.mdx` - Search with filters (~150 lines)
- `vanilla-tool-template.mdx` - Vanilla JS tool (~250 lines)
- `multi-tool-component.mdx` - Multiple tools component (~180 lines)
- `provider-with-tools.mdx` - Context provider pattern (~200 lines)

See `/snippets/README.md` for complete details on each snippet.

---

## How to Use Snippets

### Method 1: Direct Display (Recommended)

Display the snippet code block directly in your documentation:

```mdx
import RegisterTool from '/snippets/core/register-tool-basic.mdx';

## Tool Registration

Here's how to register a basic tool:

<RegisterTool />
```

**Result:** The code block from the snippet appears inline.

### Method 2: Reference in Text

Reference the snippet without displaying it:

```mdx
For basic tool registration, see the [standard pattern](/snippets/core/register-tool-basic.mdx).
```

### Method 3: Multiple Snippets

Show multiple related snippets:

```mdx
import ReactImports from '/snippets/imports/react-imports.mdx';
import UseWebMCPBasic from '/snippets/core/use-webmcp-basic.mdx';

## React Setup

First, import the necessary packages:

<ReactImports />

Then use the `useWebMCP` hook:

<UseWebMCPBasic />
```

---

## Real-World Examples

### Example 1: Replace Validation Code

**Before (duplicated code):**

```mdx
---
title: "Tool Schemas"
---

Use Zod for validation:

```typescript
inputSchema: {
  query: z.string().min(1).describe("Search query"),
  limit: z.number().optional().describe("Result limit")
}
```
```

**After (using snippet):**

```mdx
---
title: "Tool Schemas"
---

Use Zod for validation:

import ZodBasic from '/snippets/validation/zod-basic.mdx';

<ZodBasic />
```

### Example 2: Replace Transport Setup

**Before (duplicated code):**

```mdx
---
title: "Tab Transport"
---

Setup the server:

```typescript
import { TabServerTransport } from "@mcp-b/transports";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "MyApp",
  version: "1.0.0",
});

const transport = new TabServerTransport({
  allowedOrigins: ["*"],
});

await server.connect(transport);
```
```

**After (using snippet):**

```mdx
---
title: "Tab Transport"
---

Setup the server:

import TabServerSetup from '/snippets/clients/tab-server-setup.mdx';

<TabServerSetup />
```

### Example 3: Complete Template

**Before (writing from scratch):**

```mdx
---
title: "Building a CRUD Tool"
---

Here's how to build a CRUD tool...

[200+ lines of example code]
```

**After (using template):**

```mdx
---
title: "Building a CRUD Tool"
---

Here's a complete CRUD tool template you can customize:

import CrudTemplate from '/snippets/templates/crud-tool-template.mdx';

<CrudTemplate />

**Customization steps:**
1. Change the tool name from `data_manager` to your tool name
2. Modify the schema for your data structure
3. Connect to your backend API
4. Test all CRUD operations
```

---

## Migration Checklist

Use this checklist when updating a documentation page:

### 1. Identify Duplicated Patterns

- [ ] Search for `registerTool` blocks
- [ ] Search for `useWebMCP` blocks
- [ ] Search for validation schemas
- [ ] Search for transport setup code
- [ ] Search for response formats

### 2. Find Matching Snippets

Check `/snippets/README.md` for available snippets that match your code.

### 3. Replace with Imports

For each duplicated pattern:

- [ ] Add import statement at top of file
- [ ] Replace code block with snippet component
- [ ] Remove original code block

### 4. Test Locally

```bash
mintlify dev
```

- [ ] Verify snippet renders correctly
- [ ] Check formatting (icons, line numbers, highlighting)
- [ ] Ensure code block attributes are preserved
- [ ] Test on different pages if snippet is used multiple times

### 5. Update Related Pages

If the same pattern appears on other pages:

- [ ] Find all occurrences: `grep -r "pattern" docs/`
- [ ] Update each occurrence
- [ ] Test each page

### 6. Commit Changes

```bash
git add docs/path/to/file.mdx
git commit -m "docs: use snippet for [pattern name]"
```

---

## Best Practices

### Do's ✅

**✅ Import at the top of the file:**

```mdx
---
title: "My Page"
---

import RegisterTool from '/snippets/core/register-tool-basic.mdx';
import ZodBasic from '/snippets/validation/zod-basic.mdx';

## Content starts here...
```

**✅ Use descriptive import names:**

```mdx
import BasicToolRegistration from '/snippets/core/register-tool-basic.mdx';
import AdvancedZodSchema from '/snippets/validation/zod-complex.mdx';
```

**✅ Add context around snippets:**

```mdx
Here's the basic pattern for tool registration:

<RegisterTool />

This pattern handles automatic cleanup when the component unmounts.
```

**✅ Group related imports:**

```mdx
// Import statements
import ReactImports from '/snippets/imports/react-imports.mdx';
import ZodBasic from '/snippets/validation/zod-basic.mdx';
import UseWebMCP from '/snippets/core/use-webmcp-basic.mdx';
```

### Don'ts ❌

**❌ Don't modify snippet content in the importing file:**

```mdx
// ❌ BAD - modifying snippet
<RegisterTool>
  // Adding custom code here
</RegisterTool>
```

**❌ Don't use snippets for page-specific examples:**

```mdx
// ❌ BAD - this is page-specific context
<RegisterTool />

This specific example shows how our e-commerce site uses
product categories with special validation...
```

Instead, write the code inline with explanation.

**❌ Don't duplicate import statements:**

```mdx
// ❌ BAD
import RegisterTool from '/snippets/core/register-tool-basic.mdx';
import RegisterTool from '/snippets/core/register-tool-basic.mdx';
```

**❌ Don't mix snippet and inline code for the same pattern:**

```mdx
// ❌ BAD - inconsistent
Section 1: <RegisterTool />

Section 2:
```typescript
// Inline code doing the same thing
navigator.modelContext.registerTool({...})
```
```

Choose one approach and be consistent.

---

## Maintenance

### Updating a Snippet

When you need to update a snippet:

1. **Find all usages:**
   ```bash
   grep -r "snippets/core/register-tool-basic" docs/
   ```

2. **Update the snippet file:**
   ```bash
   vim snippets/core/register-tool-basic.mdx
   ```

3. **Test affected pages:**
   ```bash
   mintlify dev
   # Check each page that imports the snippet
   ```

4. **Commit with clear message:**
   ```bash
   git commit -m "feat(snippets): update register-tool-basic with new API"
   ```

### Creating a New Snippet

When you identify a pattern that should become a snippet:

1. **Verify it appears 3+ times:**
   ```bash
   grep -r "pattern" docs/ | wc -l
   ```

2. **Choose the right category:**
   - `core/` - Essential patterns
   - `validation/` - Schema patterns
   - `clients/` - Transport setup
   - `patterns/` - Advanced patterns
   - `templates/` - Complete examples

3. **Create the snippet file:**
   ```mdx
   {/*
   # Snippet Name

   Description and when to use.

   ## Example usage in docs:
   ```mdx
   import MySnippet from '/snippets/category/my-snippet.mdx';
   <MySnippet />
   ```
   */}

   ```language "filename" attributes
   // Your code here
   ```
   ```

4. **Update `/snippets/README.md`:**
   - Add to appropriate section
   - Document when to use it

5. **Use it in docs:**
   - Replace existing occurrences
   - Test thoroughly

---

## Common Patterns

### Pattern: Import Multiple Related Snippets

```mdx
import ReactImports from '/snippets/imports/react-imports.mdx';
import ZodComplex from '/snippets/validation/zod-complex.mdx';
import UseWebMCP from '/snippets/core/use-webmcp-basic.mdx';

## Setting Up a React Tool

Import the required packages:

<ReactImports />

Define your input schema with Zod:

<ZodComplex />

Register the tool with `useWebMCP`:

<UseWebMCP />
```

### Pattern: Showing Variations

```mdx
import BasicTool from '/snippets/core/register-tool-basic.mdx';
import ToolWithCleanup from '/snippets/core/register-tool-with-cleanup.mdx';

## Basic Registration

<BasicTool />

## With Cleanup

If you need to unregister the tool later:

<ToolWithCleanup />
```

### Pattern: Template + Customization Guide

```mdx
import CrudTemplate from '/snippets/templates/crud-tool-template.mdx';

## Building Your CRUD Tool

Start with this template:

<CrudTemplate />

### Customization Steps

1. **Rename the tool:** Change `data_manager` to your tool name
2. **Update the schema:** Modify action types for your use case
3. **Connect your API:** Replace `syncToBackend()` with your API calls
4. **Test each action:** Verify create, read, update, delete all work
```

---

## Troubleshooting

### Snippet Not Rendering

**Problem:** Import doesn't show code block

**Solutions:**
1. Check import path is absolute: `/snippets/...` not `./snippets/...`
2. Verify snippet file exists: `ls snippets/category/snippet-name.mdx`
3. Check for syntax errors in snippet file
4. Restart dev server: `mintlify dev`

### Code Block Formatting Lost

**Problem:** Snippet shows but loses formatting (icons, line numbers)

**Solution:** Check snippet file has correct code block attributes:

```mdx
```language "filename" twoslash lines icon="icon-name"
// code
```
```

### Import Error in MDX

**Problem:** Build fails with import error

**Solutions:**
1. Ensure import is before any content
2. Check for duplicate imports
3. Verify snippet path is correct
4. Check snippet file is valid MDX

### Snippet Shows Wrong Code

**Problem:** Code doesn't match expectations

**Solutions:**
1. Verify you're importing the right snippet
2. Check snippet file was updated
3. Clear build cache: `rm -rf .mintlify`
4. Restart dev server

---

## Getting Help

### Resources

- **Snippet Catalog:** `/snippets/README.md` - Complete list of all snippets
- **CLAUDE.md:** Guidelines for when to use snippets
- **Examples:** See `quickstart.mdx` and `best-practices.mdx` for usage

### Questions?

1. Check if snippet exists: `ls snippets/**/*.mdx`
2. Review `/snippets/README.md` for usage guidelines
3. Look at existing pages for examples
4. Ask the team in documentation channel

---

## Quick Reference

### Most Common Imports

```mdx
// Tool registration
import RegisterTool from '/snippets/core/register-tool-basic.mdx';

// React hook
import UseWebMCP from '/snippets/core/use-webmcp-basic.mdx';

// Validation
import ZodBasic from '/snippets/validation/zod-basic.mdx';

// Transports
import TabServer from '/snippets/clients/tab-server-setup.mdx';

// Responses
import SuccessResponse from '/snippets/core/response-success.mdx';
import ErrorResponse from '/snippets/core/response-error.mdx';

// Imports
import ReactImports from '/snippets/imports/react-imports.mdx';
```

### File Locations

```
docs/
├── snippets/
│   ├── core/           # Tool registration, hooks, responses
│   ├── imports/        # Import statements
│   ├── validation/     # Zod and JSON Schema
│   ├── clients/        # Transport setup
│   ├── patterns/       # Advanced patterns
│   └── templates/      # Complete examples
└── [your-page].mdx     # Import snippets here
```

---

## Summary

**Using snippets:**
1. Find pattern in `/snippets/README.md`
2. Import at top of MDX file
3. Use snippet component in content
4. Test with `mintlify dev`

**Benefits:**
- ✅ Single source of truth
- ✅ Consistency across docs
- ✅ Easy updates
- ✅ Faster authoring

**Remember:**
- Use for patterns that appear 3+ times
- Keep page-specific context inline
- Test after changes
- Update `/snippets/README.md` if creating new snippets
