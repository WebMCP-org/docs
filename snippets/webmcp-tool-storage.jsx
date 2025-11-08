// Live Storage Tool Example
// Demonstrates WebMCP tool for managing browser localStorage
export const StorageTool = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedItems, setStoredItems] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const containerRef = useRef(null);

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
            try {
              // Highlight and scroll to tool when AI executes it
              setIsExecuting(true);
              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

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

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, status: 'success' } : call
              ));

              setTimeout(() => setIsExecuting(false), 2000);

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

              setTimeout(() => setIsExecuting(false), 2000);

              return {
                content: [{
                  type: 'text',
                  text: `Error storing data: ${error.message}`,
                }],
                isError: true,
              };
            }
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
            try {
              // Highlight and scroll to tool when AI executes it
              setIsExecuting(true);
              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

              const prefixedKey = `webmcp_demo_${key}`;

              setToolCalls(prev => [...prev, {
                time: new Date().toISOString(),
                operation: 'get',
                key: prefixedKey,
                status: 'processing'
              }]);

              const value = localStorage.getItem(prefixedKey);

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, value, status: 'success' } : call
              ));

              setTimeout(() => setIsExecuting(false), 2000);

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

              setTimeout(() => setIsExecuting(false), 2000);

              return {
                content: [{
                  type: 'text',
                  text: `Error retrieving data: ${error.message}`,
                }],
                isError: true,
              };
            }
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
            try {
              // Highlight and scroll to tool when AI executes it
              setIsExecuting(true);
              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

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

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, count: Object.keys(items).length, status: 'success' } : call
              ));

              setTimeout(() => setIsExecuting(false), 2000);

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

              setTimeout(() => setIsExecuting(false), 2000);

              return {
                content: [{
                  type: 'text',
                  text: `Error listing data: ${error.message}`,
                }],
                isError: true,
              };
            }
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register storage tools:', error);
      }
    };

    registerTool();

    return () => {
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

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-300 ${
        isExecuting
          ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Storage Management Tool
          </h3>
          {isExecuting && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 animate-pulse">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Executing
            </span>
          )}
        </div>
        {isRegistered && !isExecuting && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            3 Tools Registered
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleStore}
          disabled={!key || !value}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          Store Value
        </button>
      </div>

      {Object.keys(storedItems).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Stored Items ({Object.keys(storedItems).length})
          </h4>
          <div className="space-y-2">
            {Object.entries(storedItems).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {k.replace('webmcp_demo_', '')}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate font-mono">
                    {v}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(k)}
                  className="ml-2 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {toolCalls.length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Recent Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                  call.status === 'processing'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 animate-pulse'
                    : call.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : call.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-blue-600 dark:text-blue-400 flex-1">
                    storage_{call.operation}
                  </span>
                  {call.status === 'processing' && (
                    <svg className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
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
                {call.key && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Key: <code>{call.key.replace('webmcp_demo_', '')}</code>
                  </p>
                )}
                {call.value !== undefined && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Value: <code>{call.value}</code>
                  </p>
                )}
                {call.count !== undefined && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Items: <span className="font-semibold">{call.count}</span>
                  </p>
                )}
                {call.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Error: {call.error}
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
