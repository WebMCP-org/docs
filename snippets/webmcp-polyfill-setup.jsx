// WebMCP Polyfill Setup Component
// Demonstrates how to integrate the @mcp-b/global polyfill
export const PolyfillSetup = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    // Check if polyfill is loaded
    const checkPolyfill = () => {
      if (window.navigator?.modelContext) {
        setIsLoaded(true);

        // Check if extension is installed
        if (window.navigator.modelContext.isExtensionInstalled) {
          setHasExtension(true);
        }
      }
    };

    // Check immediately and on load
    checkPolyfill();
    window.addEventListener('load', checkPolyfill);

    return () => {
      window.removeEventListener('load', checkPolyfill);
    };
  }, []);

  const copyScript = () => {
    const scriptTag = '<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>';
    navigator.clipboard.writeText(scriptTag);
  };

  return (
    <div className="not-prose border dark:border-white/10 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-4">
        WebMCP Polyfill Status
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isLoaded ? 'bg-green-500' : 'bg-zinc-400'}`} />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                navigator.modelContext API
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {isLoaded ? 'Loaded and ready' : 'Not detected'}
              </p>
            </div>
          </div>
          {isLoaded && (
            <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${hasExtension ? 'bg-green-500' : 'bg-zinc-400'}`} />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                MCP-B Extension
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {hasExtension ? 'Installed' : 'Not installed'}
              </p>
            </div>
          </div>
          {!hasExtension && (
            <a
              href="https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Install
            </a>
          )}
        </div>
      </div>

      {!isLoaded && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
            Polyfill Not Detected
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
            Add the WebMCP polyfill to enable the API. Add this script tag to your HTML:
          </p>
          <div className="relative">
            <pre className="text-xs bg-white dark:bg-zinc-950 p-3 rounded border border-amber-300 dark:border-amber-700 overflow-x-auto">
              <code className="text-amber-900 dark:text-amber-100">
                {`<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>`}
              </code>
            </pre>
            <button
              onClick={copyScript}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 rounded transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Installation Options
        </p>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <strong>Via CDN (Easiest):</strong>
            <pre className="text-xs mt-1 bg-white dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-700 overflow-x-auto">
              <code>{`<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>`}</code>
            </pre>
          </div>
          <div>
            <strong>Via NPM:</strong>
            <pre className="text-xs mt-1 bg-white dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-700 overflow-x-auto">
              <code>{`npm install @mcp-b/global
import '@mcp-b/global';`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
