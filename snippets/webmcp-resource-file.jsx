// Live File Resource Template Example
// Demonstrates: Resource with URI template parameters
export const FileResource = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [resourceReads, setResourceReads] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null);
  const [lastContent, setLastContent] = useState(null);
  const [filePath, setFilePath] = useState('readme.txt');
  const containerRef = useRef(null);

  // Virtual filesystem for demo
  const virtualFiles = {
    'readme.txt': 'Welcome to WebMCP!\n\nThis is a virtual file system demo.',
    'config.json': '{\n  "version": "1.0.0",\n  "name": "webmcp-demo"\n}',
    'notes.md': '# Notes\n\n- Learn WebMCP\n- Build awesome tools\n- Ship it!',
    'data.csv': 'name,value\nalpha,100\nbeta,200\ngamma,300',
  };

  const showPageEffect = (color = '#10B981') => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-file-effect';
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
    const overlay = document.getElementById('webmcp-file-effect');
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
          uri: 'file://{path}',
          name: 'Virtual File',
          description: 'Read files from the virtual filesystem. Available files: readme.txt, config.json, notes.md, data.csv',
          mimeType: 'text/plain',
          async read(uri, params) {
            const path = params?.path || 'unknown';
            const fileContent = virtualFiles[path] || `File not found: ${path}`;

            const content = {
              uri: uri.href,
              text: fileContent,
              mimeType: path.endsWith('.json') ? 'application/json' : 'text/plain',
            };

            setLastContent(content);
            setResourceReads(prev => [...prev, {
              time: new Date().toISOString(),
              uri: `file://${path}`,
              status: virtualFiles[path] ? 'success' : 'not_found',
              content,
            }]);

            return { contents: [content] };
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register file resource:', error);
      }
    };

    registerResource();
    window.addEventListener('webmcp-loaded', registerResource);

    return () => {
      window.removeEventListener('webmcp-loaded', registerResource);
      if (window.navigator?.modelContext?.unregisterResource) {
        window.navigator.modelContext.unregisterResource('file://{path}');
      }
    };
  }, []);

  const handleRead = async () => {
    if (typeof window !== 'undefined' && window.__mcpBridge?.modelContext?.readResource) {
      try {
        setExecutionPhase('executing');
        showPageEffect('#10B981');
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = await window.__mcpBridge.modelContext.readResource(`file://${filePath}`);
        if (result.contents?.[0]) {
          setLastContent(result.contents[0]);
          setResourceReads(prev => [...prev, {
            time: new Date().toISOString(),
            uri: `file://${filePath}`,
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
            File Reader Resource
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-[#34D399]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reading file...
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
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">URI Template</span>
        <span>Resource with parameterized URI <code className="text-emerald-600 dark:text-emerald-400">file://{'{'}<span className="text-amber-600 dark:text-amber-400">path</span>{'}'}</code></span>
      </div>

      {!isRegistered && !isActive && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            WebMCP not detected. Install the MCP-B extension to enable AI agent integration.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Select File
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(virtualFiles).map((file) => (
              <button
                key={file}
                onClick={() => setFilePath(file)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  filePath === file
                    ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] dark:text-[#34D399]'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">URI:</span>
          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">file://{filePath}</code>
        </div>

        <button
          onClick={handleRead}
          disabled={!isRegistered || isActive}
          className="w-full px-4 py-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Read File
        </button>

        {lastContent && (executionPhase === 'complete' || !isActive) && (
          <div className="p-4 rounded-lg bg-[#10B981]/5 dark:bg-[#10B981]/10 border border-[#10B981]/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-[#10B981] dark:text-[#34D399] uppercase tracking-wide">
                File Content
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {lastContent.mimeType}
              </span>
            </div>
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
                className={`p-3 rounded-lg text-sm border ${
                  read.status === 'success'
                    ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                    : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">readResource("{read.uri}")</code>
                  {read.status === 'success' ? (
                    <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
