// Live DOM Query Tool Example
// Demonstrates WebMCP tool for querying page elements
export const DOMQueryTool = () => {
  const [selector, setSelector] = useState('h1');
  const [queryResult, setQueryResult] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);

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
          handler: async ({ selector, action = 'all' }) => {
            try {
              setToolCalls(prev => [...prev, {
                time: new Date().toISOString(),
                selector,
                action,
                status: 'processing'
              }]);

              const elements = document.querySelectorAll(selector);

              if (elements.length === 0) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, count: 0, status: 'success' } : call
                ));

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

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, count: elements.length, elements: elementData, status: 'success' } : call
              ));

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

    registerTool();

    return () => {
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
    <div className="not-prose border dark:border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
          DOM Query Tool
        </h3>
        {isRegistered && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Tool Registered
          </span>
        )}
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
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleQuery}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Query
            </button>
          </div>
        </div>

        {queryResult && (
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
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            AI Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <code className="text-blue-600 dark:text-blue-400">{call.selector}</code>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {call.count !== undefined && `${call.count} found`}
                  </span>
                </div>
                {call.elements && call.elements.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {call.elements.slice(0, 2).map((el, elIdx) => (
                      <div key={elIdx} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">
                        &lt;{el.tag}{el.id && ` #${el.id}`}{el.classes.length > 0 && ` .${el.classes.join('.')}`}&gt;
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Try it:</strong> Ask your AI: "How many navigation links are on this page?" or "Query for all h2 headings"
        </p>
      </div>
    </div>
  );
};
