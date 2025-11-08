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

  // CDN sources to try (in order)
  const cdnSources = [
    'https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js',
    'https://cdn.jsdelivr.net/npm/@mcp-b/global@latest/dist/index.iife.js'
  ];

  let currentIndex = 0;

  function loadFromCDN(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = false; // Load synchronously to ensure it's ready for tools

    script.onload = () => {
      console.log(`WebMCP polyfill loaded successfully from ${url.includes('unpkg') ? 'unpkg' : 'jsdelivr'}`);
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('webmcp-loaded'));
    };

    script.onerror = () => {
      console.warn(`Failed to load WebMCP polyfill from ${url}`);

      // Try next CDN source
      currentIndex++;
      if (currentIndex < cdnSources.length) {
        console.log(`Trying alternate CDN (${currentIndex + 1}/${cdnSources.length})...`);
        script.remove();
        loadFromCDN(cdnSources[currentIndex]);
      } else {
        console.error('Failed to load WebMCP polyfill from all CDN sources. Live tools will not work.');
        console.error('You can manually install the MCP-B browser extension as an alternative.');
      }
    };

    document.head.appendChild(script);
  }

  // Start loading from first CDN
  loadFromCDN(cdnSources[currentIndex]);
})();
