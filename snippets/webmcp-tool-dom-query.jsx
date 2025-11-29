// Live DOM Query Tool Example
// Demonstrates: Page introspection and structured data responses
export const DOMQueryTool = () => {
  const [selector, setSelector] = useState('h1');
  const [queryResult, setQueryResult] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedElements, setHighlightedElements] = useState([]);
  const containerRef = useRef(null);
  const highlightOverlaysRef = useRef([]);

  // Highlight elements on the page
  const highlightPageElements = (selector) => {
    // Remove existing highlights
    clearHighlights();

    try {
      const elements = document.querySelectorAll(selector);
      const overlays = [];

      elements.forEach((el, idx) => {
        if (idx >= 5) return; // Limit to 5 highlights

        const rect = el.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = 'webmcp-highlight-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: ${rect.top}px;
          left: ${rect.left}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          border: 3px solid #8b5cf6;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
          pointer-events: none;
          z-index: 10000;
          animation: pulseHighlight 1.5s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        `;

        // Add a label
        const label = document.createElement('div');
        label.style.cssText = `
          position: absolute;
          top: -24px;
          left: 0;
          background: #8b5cf6;
          color: white;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          font-family: monospace;
        `;
        label.textContent = `${el.tagName.toLowerCase()}${idx > 0 ? ` [${idx + 1}]` : ''}`;
        overlay.appendChild(label);

        document.body.appendChild(overlay);
        overlays.push(overlay);
      });

      highlightOverlaysRef.current = overlays;

      // Add animation keyframes if not present
      if (!document.querySelector('#webmcp-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'webmcp-highlight-styles';
        style.textContent = `
          @keyframes pulseHighlight {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.02); }
          }
          @keyframes scanLine {
            0% { top: 0; }
            100% { top: 100%; }
          }
        `;
        document.head.appendChild(style);
      }

      return elements.length;
    } catch (e) {
      console.error('Error highlighting elements:', e);
      return 0;
    }
  };

  const clearHighlights = () => {
    highlightOverlaysRef.current.forEach(overlay => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
    highlightOverlaysRef.current = [];
  };

  // Cleanup highlights on unmount
  useEffect(() => {
    return () => clearHighlights();
  }, []);

  useEffect(() => {
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        await window.navigator.modelContext.registerTool({
          name: 'dom_query',
          description: 'Queries the page DOM using CSS selectors and returns element information',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector to query (e.g., "h1", ".nav-logo", "#content")',
              },
              action: {
                type: 'string',
                enum: ['count', 'text', 'attributes', 'all'],
                description: 'What information to return about matched elements',
                default: 'all',
              },
            },
            required: ['selector'],
          },
          async execute({ selector, action = 'all' }) {
            try {
              // Dramatic scanning effect
              setIsExecuting(true);
              setIsScanning(true);
              clearHighlights();

              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

              setToolCalls(prev => [...prev, {
                time: new Date().toISOString(),
                selector,
                action,
                status: 'processing'
              }]);

              // Simulate scanning delay for effect
              await new Promise(resolve => setTimeout(resolve, 500));
              setIsScanning(false);

              const elements = document.querySelectorAll(selector);

              // Highlight elements on the page
              highlightPageElements(selector);

              if (elements.length === 0) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, count: 0, status: 'success' } : call
                ));

                setTimeout(() => {
                  setIsExecuting(false);
                  clearHighlights();
                }, 2500);

                return {
                  content: [{
                    type: 'text',
                    text: `No elements found matching selector "${selector}"`,
                  }],
                };
              }

              let result = '';
              const elementData = Array.from(elements).slice(0, 5).map(el => ({
                tag: el.tagName.toLowerCase(),
                text: el.textContent?.substring(0, 100) || '',
                classes: Array.from(el.classList),
                id: el.id || null,
              }));

              if (action === 'count' || action === 'all') {
                result += `Found ${elements.length} element(s)\n\n`;
              }

              if (action === 'text' || action === 'all') {
                result += 'Text content:\n';
                elementData.forEach((el, idx) => {
                  result += `  ${idx + 1}. ${el.text.substring(0, 80)}${el.text.length > 80 ? '...' : ''}\n`;
                });
                result += '\n';
              }

              if (action === 'attributes' || action === 'all') {
                result += 'Elements:\n';
                elementData.forEach((el, idx) => {
                  result += `  ${idx + 1}. <${el.tag}${el.id ? ` id="${el.id}"` : ''}${el.classes.length ? ` class="${el.classes.join(' ')}"` : ''}>\n`;
                });
              }

              setHighlightedElements(elementData);

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, count: elements.length, elements: elementData, status: 'success' } : call
              ));

              setTimeout(() => {
                setIsExecuting(false);
                clearHighlights();
              }, 4000);

              return {
                content: [{
                  type: 'text',
                  text: result.trim(),
                }],
              };
            } catch (error) {
              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
              ));

              setTimeout(() => {
                setIsExecuting(false);
                setIsScanning(false);
                clearHighlights();
              }, 2000);

              return {
                content: [{
                  type: 'text',
                  text: `Error querying DOM: ${error.message}`,
                }],
                isError: true,
              };
            }
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register DOM query tool:', error);
      }
    };

    // Try to register immediately if polyfill is already loaded
    registerTool();

    // Listen for polyfill load event
    window.addEventListener('webmcp-loaded', registerTool);

    return () => {
      window.removeEventListener('webmcp-loaded', registerTool);
      clearHighlights();
      if (window.navigator?.modelContext?.unregisterTool) {
        window.navigator.modelContext.unregisterTool('dom_query');
      }
    };
  }, []);

  const handleQuery = () => {
    try {
      const elements = document.querySelectorAll(selector);
      const elementData = Array.from(elements).slice(0, 10).map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.substring(0, 100) || '',
        classes: Array.from(el.classList),
        id: el.id || null,
      }));

      setQueryResult({
        count: elements.length,
        elements: elementData,
      });
    } catch (error) {
      setQueryResult({
        error: error.message,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-500 relative overflow-hidden ${
        isExecuting
          ? 'border-purple-500 dark:border-purple-400 shadow-2xl shadow-purple-500/30 ring-4 ring-purple-500/30 scale-[1.02]'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Scanning effect */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            style={{
              animation: 'scanLine 1s linear infinite',
              boxShadow: '0 0 20px 5px rgba(139, 92, 246, 0.5)',
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              animation: 'pulse 2s infinite',
            }}
          />
        </div>
      )}

      {/* Found elements indicator */}
      {isExecuting && !isScanning && highlightedElements.length > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-semibold">{highlightedElements.length} Found!</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: calc(100% - 4px); }
        }
      `}</style>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            DOM Query Tool
          </h3>
          {isExecuting && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-purple-500 text-white animate-pulse shadow-lg shadow-purple-500/50">
              {isScanning ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning Page...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Elements Highlighted!
                </>
              )}
            </span>
          )}
        </div>
        {isRegistered && !isExecuting && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Tool Registered
          </span>
        )}
      </div>

      {/* WebMCP capability badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4 relative z-10">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">querySelectorAll</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">structured data</span>
        <span>Page introspection + Rich responses</span>
      </div>

      <div className="space-y-3 relative z-10">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            CSS Selector
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="h1, .nav-logo, #content"
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleQuery}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Query
            </button>
          </div>
        </div>

        {/* AI Result with visual element cards */}
        {isExecuting && !isScanning && highlightedElements.length > 0 && (
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              AI Found Elements (highlighted on page):
            </p>
            <div className="space-y-2">
              {highlightedElements.map((el, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-700"
                >
                  <div className="w-8 h-8 rounded bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs text-purple-600 dark:text-purple-400">
                      &lt;{el.tag}{el.id && ` #${el.id}`}{el.classes.length > 0 && ` .${el.classes.slice(0, 2).join('.')}`}&gt;
                    </code>
                    {el.text && (
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {el.text.substring(0, 50)}{el.text.length > 50 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {queryResult && !isExecuting && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            {queryResult.error ? (
              <p className="text-sm text-red-600 dark:text-red-400">Error: {queryResult.error}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Found {queryResult.count} element(s)
                </p>
                {queryResult.elements.length > 0 && (
                  <div className="space-y-2">
                    {queryResult.elements.map((el, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <code className="text-xs text-purple-600 dark:text-purple-400">
                            &lt;{el.tag}
                            {el.id && <span className="text-blue-600 dark:text-blue-400"> id="{el.id}"</span>}
                            {el.classes.length > 0 && (
                              <span className="text-green-600 dark:text-green-400">
                                {' '}class="{el.classes.join(' ')}"
                              </span>
                            )}
                            &gt;
                          </code>
                        </div>
                        {el.text && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                            {el.text}
                          </p>
                        )}
                      </div>
                    ))}
                    {queryResult.count > 10 && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                        Showing first 10 of {queryResult.count} elements
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {toolCalls.length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 relative z-10">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            AI Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                  call.status === 'processing'
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 animate-pulse'
                    : call.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : call.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <code className="text-purple-600 dark:text-purple-400 flex-1">{call.selector}</code>
                  <div className="flex items-center gap-2">
                    {call.count !== undefined && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                        {call.count} found
                      </span>
                    )}
                    {call.status === 'processing' && (
                      <svg className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {call.status === 'success' && (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {call.status === 'error' && (
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
                {call.elements && call.elements.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {call.elements.slice(0, 2).map((el, elIdx) => (
                      <div key={elIdx} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">
                        &lt;{el.tag}{el.id && ` #${el.id}`}{el.classes.length > 0 && ` .${el.classes.join('.')}`}&gt;
                      </div>
                    ))}
                    {call.elements.length > 2 && (
                      <p className="text-xs text-zinc-500">+{call.elements.length - 2} more</p>
                    )}
                  </div>
                )}
                {call.error && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                    Error: {call.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
