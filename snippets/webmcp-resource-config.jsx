// Live Config Resource Example
// Demonstrates: Static resource registration
export const ConfigResource = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [resourceReads, setResourceReads] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null);
  const [lastContent, setLastContent] = useState(null);
  const [config, setConfig] = useState({
    theme: 'dark',
    language: 'en',
    notifications: true,
    apiVersion: 'v2',
  });
  const containerRef = useRef(null);

  const showPageEffect = (color = '#10B981') => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-resource-effect';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: ${color};
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.08';
    });
    return overlay;
  };

  const hidePageEffect = () => {
    const overlay = document.getElementById('webmcp-resource-effect');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  };

  useEffect(() => {
    const registerResource = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        await window.navigator.modelContext.registerResource({
          uri: 'config://app-settings',
          name: 'App Settings',
          description: 'Current application configuration settings',
          mimeType: 'application/json',
          async read() {
            const content = {
              uri: 'config://app-settings',
              text: JSON.stringify(config, null, 2),
              mimeType: 'application/json',
            };

            setLastContent(content);
            setResourceReads(prev => [...prev, {
              time: new Date().toISOString(),
              uri: 'config://app-settings',
              status: 'success',
              content,
            }]);

            return { contents: [content] };
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register config resource:', error);
      }
    };

    registerResource();
    window.addEventListener('webmcp-loaded', registerResource);

    return () => {
      window.removeEventListener('webmcp-loaded', registerResource);
      if (window.navigator?.modelContext?.unregisterResource) {
        window.navigator.modelContext.unregisterResource('config://app-settings');
      }
    };
  }, [config]);

  const handleRead = async () => {
    if (typeof window !== 'undefined' && window.__mcpBridge?.modelContext?.readResource) {
      try {
        setExecutionPhase('executing');
        showPageEffect('#10B981');
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = await window.__mcpBridge.modelContext.readResource('config://app-settings');
        if (result.contents?.[0]) {
          setLastContent(result.contents[0]);
          setResourceReads(prev => [...prev, {
            time: new Date().toISOString(),
            uri: 'config://app-settings',
            status: 'success',
            content: result.contents[0],
          }]);
        }

        setExecutionPhase('complete');
        hidePageEffect();
        await new Promise(resolve => setTimeout(resolve, 2000));
        setExecutionPhase(null);
      } catch (error) {
        console.error('Failed to read resource:', error);
        setExecutionPhase(null);
        hidePageEffect();
      }
    }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const isActive = executionPhase !== null;

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-300 relative ${
        isActive
          ? 'border-[#10B981] shadow-lg shadow-[#10B981]/10 ring-2 ring-[#10B981]/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden">
          <div
            className={`h-full bg-[#10B981] transition-all duration-500 ${
              executionPhase === 'executing' ? 'w-2/3 animate-pulse' : 'w-full'
            }`}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            App Settings Resource
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-[#34D399]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reading resource...
                </>
              )}
              {executionPhase === 'complete' && (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete
                </>
              )}
            </span>
          )}
        </div>
        {isRegistered && !isActive && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Ready
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">registerResource()</span>
        <span>Static resource with URI <code className="text-emerald-600 dark:text-emerald-400">config://app-settings</code></span>
      </div>

      {!isRegistered && !isActive && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            WebMCP not detected. Install the MCP-B extension to enable AI agent integration.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Theme</label>
            <select
              value={config.theme}
              onChange={(e) => updateConfig('theme', e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Language</label>
            <select
              value={config.language}
              onChange={(e) => updateConfig('language', e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={config.notifications}
              onChange={(e) => updateConfig('notifications', e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700"
            />
            Notifications
          </label>
        </div>

        <button
          onClick={handleRead}
          disabled={!isRegistered || isActive}
          className="w-full px-4 py-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Read Resource
        </button>

        {lastContent && (executionPhase === 'complete' || !isActive) && (
          <div className="p-4 rounded-lg bg-[#10B981]/5 dark:bg-[#10B981]/10 border border-[#10B981]/20">
            <p className="text-xs font-medium text-[#10B981] dark:text-[#34D399] mb-2 uppercase tracking-wide">
              Resource Content
            </p>
            <pre className="text-xs text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg overflow-x-auto font-mono">
              {lastContent.text}
            </pre>
          </div>
        )}
      </div>

      {resourceReads.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            Recent Reads
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {resourceReads.slice(-3).reverse().map((read, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">readResource("{read.uri}")</code>
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
