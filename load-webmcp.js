// load-webmcp.js
// Loads the WebMCP polyfill from CDN to enable live tool examples
// This file is automatically included on all pages by Mintlify

(function() {
  'use strict';

  // Check if already loaded (e.g., by the MCP-B browser extension)
  if (window.navigator?.modelContext) {
    console.log('WebMCP already loaded (likely via browser extension)');
    return;
  }

  // Load the polyfill from CDN
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js';
  script.async = false; // Load synchronously to ensure it's ready for tools
  script.onload = () => {
    console.log('WebMCP polyfill loaded successfully');
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('webmcp-loaded'));
  };
  script.onerror = () => {
    console.error('Failed to load WebMCP polyfill from CDN');
  };

  document.head.appendChild(script);
})();
