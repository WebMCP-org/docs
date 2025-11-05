# Code Block Style Guide

> Guidelines for formatting code blocks in WebMCP documentation using Mintlify features

## Table of Contents

- [Overview](#overview)
- [Quick Reference](#quick-reference)
- [Core Principles](#core-principles)
- [Formatting Options](#formatting-options)
- [Icon Reference](#icon-reference)
- [Examples by Use Case](#examples-by-use-case)
- [Migration Guide](#migration-guide)
- [Mintlify Documentation](#mintlify-documentation)

## Overview

This guide documents the code formatting standards for WebMCP documentation. We use Mintlify's advanced code block features to improve readability, navigation, and learning experience.

**Mintlify Docs**: [Format code](https://mintlify.com/docs/content/components/code)

## Quick Reference

### Basic Syntax

````markdown
```language "Title" option1 option2={value} icon="icon-name"
code here
```
````

### Common Patterns

| Use Case | Pattern | Example |
|----------|---------|---------|
| React example | `tsx "Component.tsx" twoslash lines icon="react"` | Component code with types |
| Install command | `bash icon="npm"` | npm/pnpm commands |
| Good/bad comparison | `javascript lines` with `// [!code ++]` and `// [!code --]` | Visual diffs |
| Long example | `typescript "example.ts" expandable lines` | Collapsible code |
| API reference | `typescript "api.ts" lines icon="code"` | Reference documentation |

## Core Principles

### 1. **Always Specify Language**

Every code block must have a language identifier for syntax highlighting.

```markdown
✅ Good:
```typescript
const foo = "bar";
```

❌ Bad:
```
const foo = "bar";
```
````

### 2. **Use Titles for Context**

Add descriptive titles to major code examples (3+ uses or complex examples).

**Format**: `"filename.ext"` or `"Description"`

```markdown
✅ Good:
```typescript "server.ts - MCP server setup"
import { McpServer } from '@modelcontextprotocol/sdk';
```

✅ Good:
```tsx "ProductCard.tsx"
function ProductCard() { ... }
```

❌ Avoid for trivial examples:
```bash "Install command"
npm install foo
```
````

**Mintlify Docs**: [Code block titles](https://mintlify.com/docs/content/components/code#title)

### 3. **Add Icons for Visual Clarity**

Use icons to help users quickly identify the technology or context.

```markdown
```bash icon="react"
pnpm add @mcp-b/react-webmcp
```

```typescript icon="server"
const server = new McpServer();
```
````

**Mintlify Docs**: [Code block icons](https://mintlify.com/docs/content/components/code#icon)

### 4. **Highlight Key Lines**

Draw attention to the most important parts of examples.

```markdown
```tsx highlight={5-12}
import { useWebMCP } from '@mcp-b/react-webmcp';

function MyComponent() {
  // Lines 5-12 are highlighted
  useWebMCP({
    name: 'my_tool',
    description: 'Tool description',
    handler: async (args) => {
      return { success: true };
    }
  });
}
```
````

**Mintlify Docs**: [Line highlighting](https://mintlify.com/docs/content/components/code#line-highlighting)

### 5. **Use `twoslash` for TypeScript**

Enable hover type information for TypeScript and TSX examples.

```markdown
```tsx twoslash
import { useWebMCP } from '@mcp-b/react-webmcp';
// Users can hover to see types
```
````

**Mintlify Docs**: [Twoslash](https://mintlify.com/docs/content/components/code#twoslash)

## Formatting Options

### Lines

Shows line numbers on the left side of code blocks.

**When to use**:
- Reference documentation
- Examples that will be discussed or referenced
- Complex code that benefits from line numbers
- Tutorial content

**Syntax**: `lines`

````markdown
```typescript "api.ts" lines
1 | export function registerTool() {
2 |   // Implementation
3 | }
```
````

**Mintlify Docs**: [Show line numbers](https://mintlify.com/docs/content/components/code#show-line-numbers)

### Highlight

Highlights specific lines or ranges to draw attention.

**When to use**:
- Drawing attention to new or changed code
- Focusing on the most important parts
- Teaching specific concepts

**Syntax**: `highlight={1,3-5,8}`

````markdown
```javascript highlight={2-4}
function example() {
  const important = "These lines";
  const are = "highlighted";
  const visually = true;
  const other = "not highlighted";
}
```
````

### Focus

Dims everything except specified lines (opposite of highlight).

**When to use**:
- When you want to hide boilerplate
- Focusing on a specific section of a larger example
- Progressive disclosure in tutorials

**Syntax**: `focus={2,4-5}`

````markdown
```javascript focus={2-3}
function example() {
  const focused = "visible";
  const lines = "here";
  const dimmed = "less visible";
}
```
````

**Mintlify Docs**: [Line focusing](https://mintlify.com/docs/content/components/code#line-focusing)

### Expandable

Makes long code blocks collapsible.

**When to use**:
- Code examples over 50 lines
- Complete implementations that might overwhelm the page
- Reference code that users may want to skip

**Syntax**: `expandable`

````markdown
```typescript "complete-implementation.ts" expandable lines
// Long code here
// Users can expand/collapse
```
````

**Mintlify Docs**: [Expandable](https://mintlify.com/docs/content/components/code#expandable)

### Diff (Visual Red/Green)

Shows additions and deletions with colored highlighting.

**When to use**:
- Good vs. bad pattern comparisons
- Before/after examples
- Migration guides
- Deprecation warnings

**Syntax**: Use special comments at the end of lines:
- `// [!code ++]` - Mark line as added (green)
- `// [!code --]` - Mark line as removed (red)
- `// [!code ++:3]` - Mark current line + next 2 as added

````markdown
```javascript "Pattern comparison" lines
navigator.modelContext.registerTool({ // [!code --]
  name: 'search',  // Too generic // [!code --]
}); // [!code --]

navigator.modelContext.registerTool({ // [!code ++]
  name: 'products_search',  // Clear and specific // [!code ++]
}); // [!code ++]
```
````

**Mintlify Docs**: [Diff](https://mintlify.com/docs/content/components/code#diff)

### Wrap

Enables text wrapping for long lines.

**When to use**:
- Long URLs or strings
- Examples where horizontal scrolling would be annoying
- Mobile-friendly code blocks

**Syntax**: `wrap`

````markdown
```javascript wrap
const longUrl = "https://example.com/very/long/path/that/would/normally/require/horizontal/scrolling";
```
````

**Mintlify Docs**: [Wrap](https://mintlify.com/docs/content/components/code#wrap)

### Twoslash

Enables TypeScript hover type information (TypeScript/TSX only).

**When to use**:
- All TypeScript examples where type information adds value
- Complex TypeScript patterns
- Teaching TypeScript concepts
- API documentation with types

**Syntax**: `twoslash`

````markdown
```tsx twoslash
import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function MyComponent() {
  useWebMCP({
    name: 'my_tool',
    // Hover over any variable to see types
  });
}
```
````

**Mintlify Docs**: [Twoslash](https://mintlify.com/docs/content/components/code#twoslash)

## Icon Reference

### Technology Icons

Use these icons to indicate the technology stack:

| Icon | Use For | Example |
|------|---------|---------|
| `icon="react"` | React code, React packages | `tsx` files, `@mcp-b/react-webmcp` |
| `icon="node"` | Node.js code, npm packages | Server-side JS, npm install |
| `icon="npm"` | Package installation | `npm install`, `pnpm add` |
| `icon="square-js"` | Vanilla JavaScript | Plain JS, no framework |
| `icon="code"` | Generic code/HTML | HTML examples, mixed code |
| `icon="terminal"` | Terminal commands | CLI commands, shell scripts |

### Pattern Icons

Use these icons to indicate the pattern or purpose:

| Icon | Use For | Example |
|------|---------|---------|
| `icon="server"` | Server setup, backend | MCP server initialization |
| `icon="plug"` | Client connection, API | MCP client setup |
| `icon="window"` | Iframe child/content | Code inside iframe |
| `icon="window-maximize"` | Parent page/container | Parent page code |
| `icon="layer-group"` | Hub/aggregator | Extension background script |
| `icon="bridge"` | Bridge/proxy pattern | Content script bridge |
| `icon="sidebar"` | UI components | Extension sidepanel |
| `icon="bolt"` | Performance optimization | Optimistic updates |
| `icon="shield"` | Security patterns | Auth, validation |
| `icon="check"` | Good patterns | Best practice examples |
| `icon="x"` | Anti-patterns | What to avoid |

**Full Icon List**: [Mintlify Icons](https://mintlify.com/docs/content/components/icons)

## Examples by Use Case

### 1. React Component Example

````markdown
```tsx "MyComponent.tsx" twoslash lines icon="react" highlight={5-12}
import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function MyComponent() {
  useWebMCP({
    name: 'my_tool',
    description: 'Tool description',
    inputSchema: {
      query: z.string()
    },
    handler: async ({ query }) => {
      return { success: true };
    }
  });

  return <div>Component UI</div>;
}
```
````

**Why this works**:
- ✅ `twoslash` enables hover types
- ✅ Title shows filename
- ✅ `lines` for reference
- ✅ `icon="react"` immediately identifies React
- ✅ `highlight` draws attention to the hook usage

### 2. Installation Command

````markdown
```bash icon="npm"
npm install @mcp-b/transports @modelcontextprotocol/sdk
```
````

**Why this works**:
- ✅ Simple, no unnecessary options
- ✅ Icon indicates package manager context

### 3. Good vs. Bad Pattern Comparison

````markdown
```javascript "Naming patterns" lines icon="square-js"
navigator.modelContext.registerTool({ // [!code --]
  name: 'search',  // Too generic // [!code --]
}); // [!code --]

navigator.modelContext.registerTool({ // [!code ++]
  name: 'products_search',  // Clear and specific // [!code ++]
}); // [!code ++]
```
````

**Why this works**:
- ✅ Visual red/green immediately shows good vs. bad
- ✅ Comments explain why
- ✅ `lines` helps discuss specific patterns

### 4. Long Reference Implementation

````markdown
```typescript "complete-server.ts" twoslash expandable lines icon="server"
import { TabServerTransport } from "@mcp-b/transports";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// 50+ lines of implementation
// ...
```
````

**Why this works**:
- ✅ `expandable` prevents overwhelming the page
- ✅ `twoslash` provides types for reference
- ✅ `lines` for citation
- ✅ Icon shows it's server code

### 5. Server/Client Paired Examples

Use consistent titles and icons to show relationships:

````markdown
```typescript "server.ts - Tab server setup" lines icon="server"
const server = new McpServer({ name: "MyApp" });
const transport = new TabServerTransport();
await server.connect(transport);
```

```typescript "client.ts - Tab client setup" lines icon="plug"
const client = new Client({ name: "MyClient" });
const transport = new TabClientTransport();
await client.connect(transport);
```
````

**Why this works**:
- ✅ Matching title format shows they're related
- ✅ Different icons (`server` vs `plug`) show roles
- ✅ Consistent formatting aids understanding

### 6. Security or Performance Pattern

````markdown
```javascript "Optimistic update pattern" lines icon="bolt" highlight={9-11}
navigator.modelContext.registerTool({
  name: 'cart_add_item',
  async execute({ productId, quantity }) {
    // Update in-app state immediately
    const cartState = getCartState();
    cartState.addItem({ productId, quantity });

    // Sync to backend in background (don't await)
    syncCartToBackend(cartState).catch(err => {
      console.error('Background sync failed:', err);
    });

    return { success: true };
  }
});
```
````

**Why this works**:
- ✅ `icon="bolt"` indicates performance focus
- ✅ `highlight` shows the key optimization
- ✅ Comments explain the pattern

## Migration Guide

### Converting Existing Code Blocks

#### Step 1: Identify the Purpose

Ask yourself:
- Is this TypeScript/TSX? → Add `twoslash`
- Is this a reference example? → Add `lines` and a title
- Is this showing good vs. bad? → Use diff syntax
- Is this over 50 lines? → Add `expandable`
- Does this need visual identification? → Add an icon

#### Step 2: Choose Appropriate Options

Don't overdo it. Start minimal and add options that provide value:

**Minimal** (install command):
````markdown
```bash icon="npm"
npm install package
```
````

**Standard** (component example):
````markdown
```tsx "Component.tsx" twoslash lines icon="react"
function Component() { ... }
```
````

**Complex** (long reference):
````markdown
```typescript "implementation.ts" twoslash expandable lines icon="server"
// Complex implementation
```
````

#### Step 3: Update Icons and Titles

Replace generic patterns with specific ones:

**Before**:
````markdown
```typescript
const server = new McpServer();
```
````

**After**:
````markdown
```typescript "server.ts - MCP server setup" lines icon="server"
const server = new McpServer();
```
````

### Converting Good/Bad Patterns

**Before** (using comments):
````markdown
```javascript
// ✅ Good: Clear names
navigator.modelContext.registerTool({
  name: 'products_search'
});

// ❌ Bad: Vague names
navigator.modelContext.registerTool({
  name: 'search'
});
```
````

**After** (using diff):
````markdown
```javascript "Naming patterns" lines
navigator.modelContext.registerTool({ // [!code --]
  name: 'search',  // Too generic // [!code --]
}); // [!code --]

navigator.modelContext.registerTool({ // [!code ++]
  name: 'products_search',  // Clear and specific // [!code ++]
}); // [!code ++]
```
````

## Mintlify Documentation

### Official References

- **Main Guide**: [Format code](https://mintlify.com/docs/content/components/code)
- **Syntax Highlighting**: [Languages](https://shiki.style/languages) (Shiki)
- **Themes**: [Shiki Themes](https://shiki.style/themes)
- **Icons**: [Available icons](https://mintlify.com/docs/content/components/icons)

### Key Mintlify Pages

| Topic | Link |
|-------|------|
| Code blocks overview | https://mintlify.com/docs/content/components/code |
| Syntax highlighting | https://mintlify.com/docs/content/components/code#syntax-highlighting |
| Twoslash | https://mintlify.com/docs/content/components/code#twoslash |
| Title | https://mintlify.com/docs/content/components/code#title |
| Icon | https://mintlify.com/docs/content/components/code#icon |
| Line highlighting | https://mintlify.com/docs/content/components/code#line-highlighting |
| Line focusing | https://mintlify.com/docs/content/components/code#line-focusing |
| Line numbers | https://mintlify.com/docs/content/components/code#show-line-numbers |
| Expandable | https://mintlify.com/docs/content/components/code#expandable |
| Wrap | https://mintlify.com/docs/content/components/code#wrap |
| Diff | https://mintlify.com/docs/content/components/code#diff |
| Settings | https://mintlify.com/docs/settings/global#param-styling |

## Best Practices Summary

### Do

- ✅ Always specify a language for syntax highlighting
- ✅ Use `twoslash` for TypeScript examples
- ✅ Add titles to major code examples (not trivial ones)
- ✅ Use icons to provide visual context
- ✅ Use `lines` for reference documentation
- ✅ Make long examples (50+ lines) expandable
- ✅ Use diff syntax for good vs. bad comparisons
- ✅ Highlight key lines in teaching examples
- ✅ Keep titles concise (filename or brief description)

### Don't

- ❌ Add titles to trivial one-liners
- ❌ Use `twoslash` on non-TypeScript code
- ❌ Over-highlight (highlight sparingly for impact)
- ❌ Use diff syntax for everything (only comparisons)
- ❌ Forget to test code examples
- ❌ Use outdated or incorrect code in examples
- ❌ Mix different formatting styles on the same page

## Questions?

If you're unsure about formatting:
1. Check this guide first
2. Look at similar examples in existing docs (quickstart.mdx, best-practices.mdx, transports.mdx)
3. Start minimal and add features that provide clear value
4. Refer to the [Mintlify docs](https://mintlify.com/docs/content/components/code)

---

**Last Updated**: 2025-11-05
**Pilot Implementation**: quickstart.mdx, best-practices.mdx, packages/transports.mdx
