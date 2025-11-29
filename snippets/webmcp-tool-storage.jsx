// Live Storage Tool Example
// Demonstrates: Multiple tool registration and browser API integration
export const StorageTool = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedItems, setStoredItems] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null); // 'scrolling' | 'executing' | 'complete' | null
  const [activeOperation, setActiveOperation] = useState(null); // 'set' | 'get' | 'list'
  const [lastAction, setLastAction] = useState(null);
  const containerRef = useRef(null);

  // Page-level effect overlay with data-flow animation
  const showPageEffect = (operation) => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-page-effect';

    // Different colors for different operations
    const colors = {
      set: '#10b981',   // emerald for write
      get: '#3b82f6',   // blue for read
      list: '#8b5cf6'   // violet for list
    };
    const color = colors[operation] || '#1F5EFF';

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, ${color}22 0%, ${color}11 50%, ${color}22 100%);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    return overlay;
  };

  const hidePageEffect = () => {
    const overlay = document.getElementById('webmcp-page-effect');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  };

  // Execution sequence: indicate → scroll → wait → execute
  const startExecution = async (operation, onExecute) => {
    // Phase 1: Show indicator and page effect FIRST
    setExecutionPhase('executing');
    setActiveOperation(operation);
    showPageEffect(operation);

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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutionPhase(null);
    setActiveOperation(null);

    return result;
  };

  const refreshStorage = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('webmcp_demo_')) {
        items[key] = localStorage.getItem(key);
      }
    }
    setStoredItems(items);
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  useEffect(() => {
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        // Register storage management tools
        await window.navigator.modelContext.registerTool({
          name: 'storage_set',
          description: 'Stores a key-value pair in browser localStorage',
          inputSchema: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Storage key (will be prefixed with webmcp_demo_)',
              },
              value: {
                type: 'string',
                description: 'Value to store',
              },
            },
            required: ['key', 'value'],
          },
          async execute({ key, value }) {
            return startExecution('set', async () => {
              try {
                const prefixedKey = `webmcp_demo_${key}`;

                setToolCalls(prev => [...prev, {
                  time: new Date().toISOString(),
                  operation: 'set',
                  key: prefixedKey,
                  value,
                  status: 'processing'
                }]);

                localStorage.setItem(prefixedKey, value);
                refreshStorage();
                setLastAction({ type: 'set', key, value });

                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, status: 'success' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Stored "${value}" under key "${key}"`,
                  }],
                };
              } catch (error) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Error storing data: ${error.message}`,
                  }],
                  isError: true,
                };
              }
            });
          },
        });

        await window.navigator.modelContext.registerTool({
          name: 'storage_get',
          description: 'Retrieves a value from browser localStorage',
          inputSchema: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Storage key to retrieve',
              },
            },
            required: ['key'],
          },
          async execute({ key }) {
            return startExecution('get', async () => {
              try {
                const prefixedKey = `webmcp_demo_${key}`;

                setToolCalls(prev => [...prev, {
                  time: new Date().toISOString(),
                  operation: 'get',
                  key: prefixedKey,
                  status: 'processing'
                }]);

                const value = localStorage.getItem(prefixedKey);
                setLastAction({ type: 'get', key, value });

                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, value, status: 'success' } : call
                ));

                if (value === null) {
                  return {
                    content: [{
                      type: 'text',
                      text: `No value found for key "${key}"`,
                    }],
                  };
                }

                return {
                  content: [{
                    type: 'text',
                    text: `Value for "${key}": ${value}`,
                  }],
                };
              } catch (error) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Error retrieving data: ${error.message}`,
                  }],
                  isError: true,
                };
              }
            });
          },
        });

        await window.navigator.modelContext.registerTool({
          name: 'storage_list',
          description: 'Lists all stored keys and values',
          inputSchema: {
            type: 'object',
            properties: {},
          },
          async execute() {
            return startExecution('list', async () => {
              try {
                setToolCalls(prev => [...prev, {
                  time: new Date().toISOString(),
                  operation: 'list',
                  status: 'processing'
                }]);

                const items = {};
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('webmcp_demo_')) {
                    const cleanKey = key.replace('webmcp_demo_', '');
                    items[cleanKey] = localStorage.getItem(key);
                  }
                }

                setLastAction({ type: 'list', count: Object.keys(items).length });

                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, count: Object.keys(items).length, status: 'success' } : call
                ));

                const itemsList = Object.entries(items)
                  .map(([k, v]) => `  • ${k}: ${v}`)
                  .join('\n');

                return {
                  content: [{
                    type: 'text',
                    text: `Stored items (${Object.keys(items).length}):\n${itemsList || '  (none)'}`,
                  }],
                };
              } catch (error) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Error listing data: ${error.message}`,
                  }],
                  isError: true,
                };
              }
            });
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register storage tools:', error);
      }
    };

    // Try to register immediately if polyfill is already loaded
    registerTool();

    // Listen for polyfill load event
    window.addEventListener('webmcp-loaded', registerTool);

    return () => {
      window.removeEventListener('webmcp-loaded', registerTool);
      if (window.navigator?.modelContext?.unregisterTool) {
        window.navigator.modelContext.unregisterTool('storage_set');
        window.navigator.modelContext.unregisterTool('storage_get');
        window.navigator.modelContext.unregisterTool('storage_list');
      }
    };
  }, []);

  const handleStore = () => {
    if (!key || !value) return;
    const prefixedKey = `webmcp_demo_${key}`;
    localStorage.setItem(prefixedKey, value);
    refreshStorage();
    setKey('');
    setValue('');
  };

  const handleDelete = (key) => {
    localStorage.removeItem(key);
    refreshStorage();
  };

  const getOperationLabel = () => {
    switch (activeOperation) {
      case 'set': return 'Storing...';
      case 'get': return 'Reading...';
      case 'list': return 'Listing...';
      default: return 'Processing...';
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
            Storage Management Tool
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#1F5EFF]/10 text-[#1F5EFF] dark:bg-[#1F5EFF]/20 dark:text-[#4B7BFF]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {getOperationLabel()}
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
            3 Tools Ready
          </span>
        )}
      </div>

      {/* WebMCP capability badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">Promise.all()</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">localStorage</span>
        <span>Multiple tools + Browser API integration</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-shadow"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-shadow"
          />
        </div>

        <button
          onClick={handleStore}
          disabled={!key || !value}
          className="w-full px-4 py-2 bg-[#1F5EFF] hover:bg-[#1449CC] disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          Store Value
        </button>

        {/* AI Action Result */}
        {(executionPhase === 'executing' || executionPhase === 'complete') && lastAction && (
          <div className="p-4 rounded-lg bg-[#1F5EFF]/5 dark:bg-[#1F5EFF]/10 border border-[#1F5EFF]/20">
            <p className="text-xs font-medium text-[#1F5EFF] dark:text-[#4B7BFF] mb-2 uppercase tracking-wide">
              AI {lastAction.type === 'set' ? 'Stored' : lastAction.type === 'get' ? 'Retrieved' : 'Listed'}
            </p>
            {lastAction.type === 'set' && (
              <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                <span className="text-zinc-500">{lastAction.key}</span> = <span className="font-semibold">{lastAction.value}</span>
              </div>
            )}
            {lastAction.type === 'get' && (
              <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                <span className="text-zinc-500">{lastAction.key}</span> = <span className="font-semibold">{lastAction.value || '(not found)'}</span>
              </div>
            )}
            {lastAction.type === 'list' && (
              <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                <span className="font-semibold">{lastAction.count}</span> items in storage
              </div>
            )}
          </div>
        )}
      </div>

      {Object.keys(storedItems).length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Stored Items ({Object.keys(storedItems).length})
          </h4>
          <div className="space-y-1.5">
            {Object.entries(storedItems).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate font-mono">
                    {k.replace('webmcp_demo_', '')}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {v}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(k)}
                  className="ml-2 px-2 py-1 text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(storedItems).length === 0 && (
        <div className="mt-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-center">
          <p className="text-sm text-zinc-500">No items stored yet</p>
          <p className="text-xs text-zinc-400 mt-1">Ask AI to store something!</p>
        </div>
      )}

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
                  <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    storage_{call.operation}
                  </span>
                  <div className="flex items-center gap-2">
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
                {call.key && (
                  <p className="text-xs text-zinc-500 mt-1 font-mono">
                    {call.key.replace('webmcp_demo_', '')}{call.value !== undefined ? ` = ${call.value}` : ''}
                  </p>
                )}
                {call.count !== undefined && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {call.count} items
                  </p>
                )}
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
