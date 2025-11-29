// Live Calculator Tool Example
// Demonstrates: Basic tool registration with simple input schema
export const CalculatorTool = () => {
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('2 + 2');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null); // 'scrolling' | 'executing' | 'complete' | null
  const [lastResult, setLastResult] = useState(null);
  const containerRef = useRef(null);

  // Page-level effect overlay
  const showPageEffect = (color = '#1F5EFF') => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-page-effect';
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

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.08';
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
  const startExecution = async (onExecute) => {
    // Phase 1: Show indicator and page effect FIRST
    setExecutionPhase('executing');
    const overlay = showPageEffect('#1F5EFF');

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

    return result;
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
            return startExecution(async () => {
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
                setLastResult(result);

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
            });
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
            Calculator Tool
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#1F5EFF]/10 text-[#1F5EFF] dark:bg-[#1F5EFF]/20 dark:text-[#4B7BFF]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Computing...
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
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">registerTool()</span>
        <span>Basic tool registration with simple input schema</span>
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
            Expression
          </label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Enter expression (e.g., 2 + 2 * 3)"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-shadow"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 bg-[#1F5EFF] hover:bg-[#1449CC] text-white font-medium rounded-lg transition-colors"
        >
          Calculate
        </button>

        {/* AI Result Display */}
        {(executionPhase === 'executing' || executionPhase === 'complete') && lastResult !== null && (
          <div className="p-4 rounded-lg bg-[#1F5EFF]/5 dark:bg-[#1F5EFF]/10 border border-[#1F5EFF]/20">
            <p className="text-xs font-medium text-[#1F5EFF] dark:text-[#4B7BFF] mb-1 uppercase tracking-wide">AI Result</p>
            <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{lastResult}</p>
          </div>
        )}

        {result && !isActive && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Result:</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{result}</p>
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
                  <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">{call.expression}</code>
                  <div className="flex items-center gap-2">
                    {call.result !== undefined && (
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">= {call.result}</span>
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
