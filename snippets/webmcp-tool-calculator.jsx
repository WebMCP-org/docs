// Live Calculator Tool Example
// Demonstrates: Basic tool registration with simple input schema
export const CalculatorTool = () => {
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('2 + 2');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [animatedResult, setAnimatedResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef(null);

  // Animate number counting up to result
  const animateNumber = (target, duration = 800) => {
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeOut;

      setAnimatedResult(progress < 1 ? current.toFixed(2) : target);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Register the calculator tool with WebMCP
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
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
          async execute({ expression }) {
            try {
              // Dramatic highlight and scroll to tool when AI executes it
              setIsExecuting(true);
              setShowCelebration(false);
              setAnimatedResult(null);

              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

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

              // Animate the result number
              if (typeof result === 'number' && isFinite(result)) {
                animateNumber(result);
              } else {
                setAnimatedResult(result);
              }

              // Trigger celebration animation
              setTimeout(() => setShowCelebration(true), 300);

              setToolCalls(prev => prev.map((call, idx) =>
                idx === prev.length - 1 ? { ...call, result, status: 'success' } : call
              ));

              // Clear execution highlight after delay
              setTimeout(() => {
                setIsExecuting(false);
                setShowCelebration(false);
              }, 3000);

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

              setTimeout(() => setIsExecuting(false), 2000);

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

    // Try to register immediately if polyfill is already loaded
    registerTool();

    // Listen for polyfill load event
    window.addEventListener('webmcp-loaded', registerTool);

    return () => {
      window.removeEventListener('webmcp-loaded', registerTool);
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
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-500 relative overflow-hidden ${
        isExecuting
          ? 'border-blue-500 dark:border-blue-400 shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500/30 scale-[1.02]'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-ping"
              style={{
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Calculator Tool
          </h3>
          {isExecuting && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/50">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Computing...
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
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">registerTool()</span>
        <span>Basic tool registration with simple input schema</span>
      </div>

      {!isRegistered && !isExecuting && (
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

        {/* Animated AI Result Display */}
        {animatedResult !== null && isExecuting && (
          <div className={`p-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white transform transition-all duration-500 ${showCelebration ? 'scale-105' : 'scale-100'}`}>
            <p className="text-sm font-medium opacity-80 mb-1">AI Result:</p>
            <p className="text-4xl font-bold font-mono tracking-tight">{animatedResult}</p>
          </div>
        )}

        {result && !isExecuting && (
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
                  <code className="text-blue-600 dark:text-blue-400 flex-1">{call.expression}</code>
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
                {call.result !== undefined && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Result: <span className="font-mono font-semibold">{call.result}</span>
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
