---
title: "WebMCP standard API"
description: "Reference for navigator.modelContext and navigator.modelContextTesting, the browser-native WebMCP surfaces."
keywords: ["modelContext", "modelContextTesting", "registerTool", "unregisterTool", "listTools", "executeTool", "web standard"]
---

<Note>
This page is a quick lookup. For the authoritative API shape, read the [W3C WebMCP spec](https://webmachinelearning.github.io/webmcp/) and the [WebMCP proposal](https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md).
</Note>

## `navigator.modelContext`

The strict imperative WebMCP surface. Owned by the WebMCP specification, not by `@mcp-b/*` packages.

### Methods

| Method | Purpose |
| --- | --- |
| `registerTool(tool)` | Adds one tool to the registry. Requires `name`, `description`, and `execute`. Throws on duplicate names. Defaults `inputSchema` to `{ type: 'object', properties: {} }` when omitted. |
| `unregisterTool(name)` | Removes the named tool. No-op if the name is not registered. |

The formal spec centers on `registerTool()` and `unregisterTool()`. See the [W3C spec](https://webmachinelearning.github.io/webmcp/) for the full `ToolDescriptor` shape, `ContentBlock` types, `InputSchema` constraints, and execution semantics.

### Example

From the `@mcp-b/webmcp-polyfill` README, using only the strict core API:

```ts "polyfill-example.ts"
import { initializeWebMCPPolyfill } from '@mcp-b/webmcp-polyfill';

initializeWebMCPPolyfill();

navigator.modelContext.registerTool({
  name: 'get-page-title',
  description: 'Get the current page title',
  inputSchema: { type: 'object', properties: {} },
  async execute() {
    return {
      content: [{ type: 'text', text: document.title }],
    };
  },
});
```

## `navigator.modelContextTesting`

The testing and inspection companion to `navigator.modelContext`. Chromium exposes it in the native preview. The MCP-B polyfill can install a compatible shim.

<Warning>
This surface is not the stable consumer API. Chromium preview behavior may change while the standard discussion continues. See [Spec Status and Limitations](/explanation/design/spec-status-and-limitations) for current design status.
</Warning>

### Methods

| Method | Purpose |
| --- | --- |
| `listTools()` | Returns registered tool metadata as `ModelContextTestingToolInfo[]`. Does not return execute functions. |
| `executeTool(name, argsJson, options?)` | Executes a tool. `argsJson` is a JSON string. Returns a serialized result string, or `null` when navigation interrupts the flow. |
| `executeTool(name, source, options?)` | Executes a streamed tool. `source` contains a `ReadableStream` of chunks and a `Promise` of args. |
| `registerToolsChangedCallback(callback)` | Registers a callback invoked when the tool list changes. |
| `getCrossDocumentScriptToolResult()` | Returns cross-document declarative tool results as a serialized string. |

Key behaviors:

- `listTools()` returns metadata only, not execute functions.
- `inputSchema` on returned tool info is a serialized JSON string, not a parsed object.
- `executeTool()` takes a JSON string for ordinary (non-streamed) calls.

### Example

```ts "testing-api.ts"
const tools = navigator.modelContextTesting?.listTools();

const result = await navigator.modelContextTesting?.executeTool(
  'search',
  JSON.stringify({ query: 'webmcp' })
);
```

### Native preview vs polyfill shim

| Behavior | Native Chromium preview | `@mcp-b/webmcp-polyfill` shim |
| --- | --- | --- |
| Available with native `navigator.modelContext` | Yes | Optional (`installTestingShim`) |
| Declarative tool visibility | Yes | No |
| `listTools().inputSchema` format | JSON string | JSON string |
| `executeTool(...)` | Yes | Yes |
| `getCrossDocumentScriptToolResult()` | Returns native results | Returns `"[]"` |

For shim configuration, see [@mcp-b/webmcp-polyfill](/packages/webmcp-polyfill/reference). For end-to-end testing patterns, see [Test native and polyfill](/how-to/test-native-and-polyfill).

## Feature detection

Check for both APIs before use:

```ts "feature-detection.ts"
if ('modelContext' in navigator) {
  // Standard WebMCP API available (native or polyfill)
  navigator.modelContext.registerTool({ /* ... */ });
}

if ('modelContextTesting' in navigator) {
  // Testing/inspection API available
  const tools = navigator.modelContextTesting.listTools();
}
```

For native preview availability, flags, and current browser support, see [Browser support and flags](/explanation/webmcp/browser-support-and-flags).

## Where MCP-B begins

The browser standard owns the surface above. MCP-B adds a separate layer on top.

| If you need... | Page |
| --- | --- |
| Strict core runtime behavior in all browsers | [@mcp-b/webmcp-polyfill](/packages/webmcp-polyfill/reference) |
| Full runtime with prompts, resources, and transport | [@mcp-b/global](/packages/global/reference) |
| MCP-B extension methods (`callTool`, `registerPrompt`, `registerResource`, `createMessage`, `elicitInput`) | [`@mcp-b/webmcp-ts-sdk` reference](/packages/webmcp-ts-sdk/reference) |
| TypeScript contracts for the standard surface | [@mcp-b/webmcp-types](/packages/webmcp-types/reference) |

For why the core surface is kept separate from MCP-B additions, see [Strict core vs MCP-B extensions](/explanation/strict-core-vs-mcp-b-extensions).
