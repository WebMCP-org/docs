// Live Calculator Tool Example
// Demonstrates a simple WebMCP tool that can be called by AI agents
export const CalculatorTool = () => {
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('2 + 2');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);

  useEffect(() => {
    // Register the calculator tool with WebMCP
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        console.log('WebMCP not available');
        return;
      }

      try {
        await window.navigator.modelContext.registerTool({
          name: 'calculator',
          description: 'Performs mathematical calculations. Supports basic arithmetic operations (+, -, *, /) and common math functions.',
          inputSchema: {
            type: 'object',
            properties: {
              expression: {
                type: 'string',
                description: 'Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)", "pow(2, 3)")',
              },
            },
            required: ['expression'],
          },
          handler: async ({ expression }) => {
            try {
              // Track the tool call
              setToolCalls(prev => [...prev, {
                time: new Date().toISOString(),
                expression,
                status: 'processing'
              }]);

              // Safe evaluation using Function constructor with Math context
              const sanitized = expression
                .replace(/[^0-9+\-*/().,\s]/g, '')
                .replace(/Math\./g, '');

              const result = Function(`"use strict"; return (${sanitized})`)();

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, result, status: 'success' } : call
              ));

              return {
                content: [{
                  type: 'text',
                  text: `The result of ${expression} is ${result}`,
                }],
              };
            } catch (error) {
              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
              ));

              return {
                content: [{
                  type: 'text',
                  text: `Error evaluating expression: ${error.message}`,
                }],
                isError: true,
              };
            }
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register calculator tool:', error);
      }
    };

    registerTool();

    return () => {
      // Cleanup: unregister tool
      if (window.navigator?.modelContext?.unregisterTool) {
        window.navigator.modelContext.unregisterTool('calculator');
      }
    };
  }, []);

  const handleCalculate = () => {
    try {
      const sanitized = expression
        .replace(/[^0-9+\-*/().,\s]/g, '')
        .replace(/Math\./g, '');
      const calcResult = Function(`"use strict"; return (${sanitized})`)();
      setResult(calcResult.toString());
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="not-prose border dark:border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
          Live Calculator Tool
        </h3>
        {isRegistered && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Tool Registered
          </span>
        )}
      </div>

      {!isRegistered && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            WebMCP not detected. Install the MCP-B extension to enable AI agent integration.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Expression
          </label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Enter expression (e.g., 2 + 2 * 3)"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Calculate
        </button>

        {result && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Result:</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{result}</p>
          </div>
        )}
      </div>

      {toolCalls.length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            AI Agent Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <code className="text-blue-600 dark:text-blue-400">{call.expression}</code>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    call.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    call.status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {call.status}
                  </span>
                </div>
                {call.result !== undefined && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Result: <span className="font-mono font-semibold">{call.result}</span>
                  </p>
                )}
                {call.error && (
                  <p className="text-red-600 dark:text-red-400">Error: {call.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Try it:</strong> Open your AI assistant and ask: "Use the calculator tool to compute 42 * 1.5 + 10"
        </p>
      </div>
    </div>
  );
};
