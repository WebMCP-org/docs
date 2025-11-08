# Adding WebMCP Polyfill to Mintlify Docs

This guide shows how to add the `@mcp-b/global` polyfill to your Mintlify documentation site.

## Method 1: Via CDN (Recommended for Mintlify)

Add a JavaScript file to your docs root that loads the polyfill:

**Create `load-webmcp.js` in your docs root:**

```javascript
// load-webmcp.js
// Loads the WebMCP polyfill from CDN
(function() {
  'use strict';

  // Check if already loaded
  if (window.navigator?.modelContext) {
    console.log('WebMCP already loaded');
    return;
  }

  // Load the polyfill
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@mcp-b/global@1.1.2/dist/index.iife.js';
  script.async = false; // Load synchronously to ensure it's ready
  script.onload = () => {
    console.log('WebMCP polyfill loaded successfully');
  };
  script.onerror = () => {
    console.error('Failed to load WebMCP polyfill');
  };

  document.head.appendChild(script);
})();
```

Mintlify automatically includes all `.js` files in your docs root, so this will load on every page.

## Method 2: Direct Script Tag

If Mintlify supports custom head injection, add this to your configuration:

```html
<script src="https://unpkg.com/@mcp-b/global@1.1.2/dist/index.iife.js"></script>
```

## Method 3: NPM Package (For Custom Builds)

If you have a custom build process:

```bash
npm install @mcp-b/global
```

Then import it in your app entry point:

```javascript
import '@mcp-b/global';
```

## Verification

After adding the polyfill, you can verify it's loaded:

```javascript
if (window.navigator?.modelContext) {
  console.log('✅ WebMCP is ready!');

  // Check for extension
  if (window.navigator.modelContext.isExtensionInstalled) {
    console.log('✅ MCP-B Extension detected');
  }
}
```

## Using the Polyfill in React Components

Once loaded, use `registerTool()` in your React components:

```jsx
import { useEffect, useState } from 'react';

export const MyTool = () => {
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (!window.navigator?.modelContext) return;

    const reg = window.navigator.modelContext.registerTool({
      name: 'my_tool',
      description: 'My tool description',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      async execute(args) {
        return {
          content: [{ type: 'text', text: 'Result' }]
        };
      }
    });

    setRegistration(reg);

    return () => {
      reg?.unregister();
    };
  }, []);

  return <div>My Tool Component</div>;
};
```

## Troubleshooting

**Polyfill not loading:**
- Check browser console for errors
- Verify the CDN is accessible
- Ensure JavaScript is enabled

**Tools not registering:**
- Verify polyfill is loaded before trying to register tools
- Check that `window.navigator.modelContext` exists
- Use browser DevTools to inspect the object

**Extension not detected:**
- Install the [MCP-B Extension](https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa)
- Reload the page after installation
- Check `window.navigator.modelContext.isExtensionInstalled`

## Resources

- [@mcp-b/global package](https://www.npmjs.com/package/@mcp-b/global)
- [WebMCP Documentation](/packages/global)
- [Live Tool Examples](/live-tool-examples)
