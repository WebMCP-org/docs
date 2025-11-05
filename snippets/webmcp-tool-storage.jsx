// Live Storage Tool Example
// Demonstrates WebMCP tool for managing browser localStorage
export const StorageTool = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedItems, setStoredItems] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);

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
          handler: async ({ key, value }) => {
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
          handler: async ({ key }) => {
            try {
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
          },
        });

        await window.navigator.modelContext.registerTool({
          name: 'storage_list',
          description: 'Lists all stored keys and values',
          inputSchema: {
            type: 'object',
            properties: {},
          },
          handler: async () => {
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
    <div className="not-prose border dark:border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
          Storage Management Tool
        </h3>
        {isRegistered && (
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
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    storage_{call.operation}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    call.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    call.status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {call.status}
                  </span>
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
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Try it:</strong> Ask your AI: "Store 'Hello World' under the key 'greeting' using storage"
        </p>
      </div>
    </div>
  );
};
