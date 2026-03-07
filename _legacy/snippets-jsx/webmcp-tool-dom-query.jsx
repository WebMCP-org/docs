// Live DOM Query Tool Example
// Demonstrates: Page introspection and structured data responses
export const DOMQueryTool = () => {
  const [selector, setSelector] = useState('h1');
  const [queryResult, setQueryResult] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null); // 'scrolling' | 'executing' | 'complete' | null
  const [lastQuery, setLastQuery] = useState(null);
  const containerRef = useRef(null);
  const highlightOverlaysRef = useRef([]);

  // Page-level scanning effect
  const showPageEffect = () => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-page-effect';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: linear-gradient(180deg,
        rgba(139, 92, 246, 0.1) 0%,
        rgba(139, 92, 246, 0.02) 50%,
        rgba(139, 92, 246, 0.1) 100%);
      opacity: 0;
      pointer-events: none;
      z-index: 9998;
      transition: opacity 0.3s ease;
    `;

    // Add scan line effect
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
      box-shadow: 0 0 20px #8b5cf6;
      animation: scanDown 1.5s ease-in-out infinite;
    `;
    overlay.appendChild(scanLine);

    // Add scan animation
    const style = document.createElement('style');
    style.id = 'webmcp-scan-style';
    style.textContent = `
      @keyframes scanDown {
        0% { top: 0; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    return overlay;
  };

  const hidePageEffect = () => {
    const overlay = document.getElementById('webmcp-page-effect');
    const style = document.getElementById('webmcp-scan-style');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
    if (style) {
      setTimeout(() => style.remove(), 300);
    }
  };

  // Execution sequence: indicate → scroll → wait → execute
  const startExecution = async (onExecute) => {
    // Phase 1: Show indicator and page effect FIRST
    setExecutionPhase('executing');
    showPageEffect();

    // Phase 2: Scroll to tool
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Phase 3: Wait for scroll and visual effect
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Phase 4: Execute the actual function
    const result = await onExecute();

    // Phase 5: Show completion
    setExecutionPhase('complete');
    hidePageEffect();
    await new Promise(resolve => setTimeout(resolve, 2500));
    setExecutionPhase(null);

    return result;
  };

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
          async execute(args) {
            // Validate args outside startExecution to ensure isError is always returned
            try {
              const { selector, action = 'all' } = args || {};

              // Validate required parameter
              if (selector === undefined || selector === null) {
                return {
                  content: [{
                    type: 'text',
                    text: 'Missing required parameter: selector',
                  }],
                  isError: true,
                };
              }

              if (typeof selector !== 'string') {
                return {
                  content: [{
                    type: 'text',
                    text: `Invalid parameter type: selector must be a string, got ${typeof selector}`,
                  }],
                  isError: true,
                };
              }

              // Validate action enum if provided
              if (action && !['count', 'text', 'attributes', 'all'].includes(action)) {
                return {
                  content: [{
                    type: 'text',
                    text: `Invalid parameter value: action must be one of 'count', 'text', 'attributes', 'all', got '${action}'`,
                  }],
                  isError: true,
                };
              }

              return startExecution(async () => {
                try {
                  clearHighlights();

                  setToolCalls(prev => [...prev, {
                    time: new Date().toISOString(),
                    selector,
                    action,
                    status: 'processing'
                  }]);

                  const elements = document.querySelectorAll(selector);

                  // Highlight elements on the page
                  highlightPageElements(selector);

                  const elementData = Array.from(elements).slice(0, 5).map(el => ({
                    tag: el.tagName.toLowerCase(),
                    text: el.textContent?.substring(0, 100) || '',
                    classes: Array.from(el.classList),
                    id: el.id || null,
                  }));

                  setLastQuery({ selector, count: elements.length, elements: elementData });

                  if (elements.length === 0) {
                    setToolCalls(prev => prev.map((call, idx) =>
                      idx === prev.length - 1 ? { ...call, count: 0, status: 'success' } : call
                    ));

                    setTimeout(() => clearHighlights(), 2000);

                    return {
                      content: [{
                        type: 'text',
                        text: `No elements found matching selector "${selector}"`,
                      }],
                    };
                  }

                  let result = '';

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

                  setToolCalls(prev => prev.map((call, idx) =>
                    idx === prev.length - 1 ? { ...call, count: elements.length, elements: elementData, status: 'success' } : call
                  ));

                  setTimeout(() => clearHighlights(), 2000);

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

                  clearHighlights();

                  return {
                    content: [{
                      type: 'text',
                      text: `Error querying DOM: ${error.message}`,
                    }],
                    isError: true,
                  };
                }
              });
            } catch (error) {
              return {
                content: [{
                  type: 'text',
                  text: `Error: ${error.message}`,
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

  const isActive = executionPhase !== null;

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-300 relative ${
        isActive
          ? 'border-[#1F5EFF] shadow-lg shadow-[#1F5EFF]/10 ring-2 ring-[#1F5EFF]/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Execution status bar */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden">
          <div
            className={`h-full bg-[#1F5EFF] transition-all duration-500 ${
              executionPhase === 'executing' ? 'w-2/3 animate-pulse' :
              'w-full'
            }`}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            DOM Query Tool
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#1F5EFF]/10 text-[#1F5EFF] dark:bg-[#1F5EFF]/20 dark:text-[#4B7BFF]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
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

      {/* WebMCP capability badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">querySelectorAll</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">structured data</span>
        <span>Page introspection + Rich responses</span>
      </div>

      <div className="space-y-3">
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
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-shadow"
            />
            <button
              onClick={handleQuery}
              className="px-6 py-2 bg-[#1F5EFF] hover:bg-[#1449CC] text-white font-medium rounded-lg transition-colors text-sm"
            >
              Query
            </button>
          </div>
        </div>

        {/* AI Query Result */}
        {(executionPhase === 'executing' || executionPhase === 'complete') && lastQuery && (
          <div className="p-4 rounded-lg bg-[#1F5EFF]/5 dark:bg-[#1F5EFF]/10 border border-[#1F5EFF]/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#1F5EFF] dark:text-[#4B7BFF] uppercase tracking-wide">AI Result</p>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {lastQuery.count} element{lastQuery.count !== 1 ? 's' : ''} found
              </span>
            </div>
            {lastQuery.elements.length > 0 && (
              <div className="space-y-1.5">
                {lastQuery.elements.slice(0, 3).map((el, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded bg-white/50 dark:bg-zinc-800/50"
                  >
                    <span className="w-5 h-5 rounded bg-[#1F5EFF]/20 text-[#1F5EFF] flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <code className="text-xs text-zinc-700 dark:text-zinc-300 truncate">
                      &lt;{el.tag}{el.id && ` #${el.id}`}{el.classes.length > 0 && ` .${el.classes.slice(0, 2).join('.')}`}&gt;
                    </code>
                  </div>
                ))}
                {lastQuery.elements.length > 3 && (
                  <p className="text-xs text-zinc-500 text-center pt-1">
                    +{lastQuery.elements.length - 3} more elements
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {queryResult && !isActive && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            {queryResult.error ? (
              <p className="text-sm text-red-600 dark:text-red-400">Error: {queryResult.error}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Found {queryResult.count} element(s)
                </p>
                {queryResult.elements.length > 0 && (
                  <div className="space-y-1.5">
                    {queryResult.elements.slice(0, 5).map((el, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                      >
                        <code className="text-xs text-zinc-700 dark:text-zinc-300">
                          &lt;{el.tag}
                          {el.id && <span className="text-[#1F5EFF]"> #{el.id}</span>}
                          {el.classes.length > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {' '}.{el.classes.slice(0, 2).join('.')}
                            </span>
                          )}
                          &gt;
                        </code>
                        {el.text && (
                          <p className="text-xs text-zinc-500 truncate mt-1">
                            {el.text.substring(0, 60)}{el.text.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    ))}
                    {queryResult.count > 5 && (
                      <p className="text-xs text-zinc-500 text-center">
                        Showing first 5 of {queryResult.count} elements
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
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            Recent Calls
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {toolCalls.slice(-3).reverse().map((call, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                  call.status === 'processing'
                    ? 'bg-[#1F5EFF]/5 dark:bg-[#1F5EFF]/10 border border-[#1F5EFF]/20'
                    : call.status === 'success'
                    ? 'bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700'
                    : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">{call.selector}</code>
                  <div className="flex items-center gap-2">
                    {call.count !== undefined && (
                      <span className="text-xs text-zinc-500 font-medium">
                        {call.count} found
                      </span>
                    )}
                    {call.status === 'processing' && (
                      <svg className="w-3.5 h-3.5 animate-spin text-[#1F5EFF]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {call.status === 'success' && (
                      <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {call.status === 'error' && (
                      <svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
                {call.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {call.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
