// Live Code Review Prompt Example
// Demonstrates: Prompt with arguments schema
export const CodeReviewPrompt = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [promptCalls, setPromptCalls] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null);
  const [lastMessages, setLastMessages] = useState(null);
  const [lastArgs, setLastArgs] = useState(null);
  const containerRef = useRef(null);

  const showPageEffect = (color = '#8B5CF6') => {
    const overlay = document.createElement('div');
    overlay.id = 'webmcp-code-review-effect';
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
    const overlay = document.getElementById('webmcp-code-review-effect');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  };

  const startExecution = async (onExecute) => {
    setExecutionPhase('executing');
    showPageEffect('#8B5CF6');

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = await onExecute();

    setExecutionPhase('complete');
    hidePageEffect();
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutionPhase(null);

    return result;
  };

  useEffect(() => {
    const registerPrompt = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        await window.navigator.modelContext.registerPrompt({
          name: 'code-review',
          description: 'Generate a code review request with syntax-highlighted code block',
          argsSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The code to review'
              },
              language: {
                type: 'string',
                description: 'Programming language (e.g., javascript, python, typescript)',
                default: 'javascript'
              },
            },
            required: ['code'],
          },
          async get(args) {
            return startExecution(async () => {
              const codeToReview = args.code;
              const lang = args.language || 'unknown';

              const messages = [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Please review this ${lang} code for best practices:\n\n\`\`\`${lang}\n${codeToReview}\n\`\`\``,
                  },
                },
              ];

              setLastMessages(messages);
              setLastArgs({ code: codeToReview, language: lang });
              setPromptCalls(prev => [...prev, {
                time: new Date().toISOString(),
                name: 'code-review',
                args: { code: codeToReview.substring(0, 50) + (codeToReview.length > 50 ? '...' : ''), language: lang },
                status: 'success',
                messages,
              }]);

              return { messages };
            });
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register code-review prompt:', error);
      }
    };

    registerPrompt();
    window.addEventListener('webmcp-loaded', registerPrompt);

    return () => {
      window.removeEventListener('webmcp-loaded', registerPrompt);
      if (window.navigator?.modelContext?.unregisterPrompt) {
        window.navigator.modelContext.unregisterPrompt('code-review');
      }
    };
  }, []);

  const isActive = executionPhase !== null;

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-300 relative ${
        isActive
          ? 'border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/10 ring-2 ring-[#8B5CF6]/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden">
          <div
            className={`h-full bg-[#8B5CF6] transition-all duration-500 ${
              executionPhase === 'executing' ? 'w-2/3 animate-pulse' : 'w-full'
            }`}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Code Review Prompt
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#A78BFA]">
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting prompt...
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            Ready
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">argsSchema</span>
        <span>Prompt with validated arguments</span>
      </div>

      {!isRegistered && !isActive && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            WebMCP not detected. Install the MCP-B extension to enable AI agent integration.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Show argument schema */}
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
            Arguments Schema
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <code className="text-violet-600 dark:text-violet-400">code</code>
              <span className="text-zinc-500 dark:text-zinc-400">string</span>
              <span className="px-1.5 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">required</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-violet-600 dark:text-violet-400">language</code>
              <span className="text-zinc-500 dark:text-zinc-400">string</span>
              <span className="text-zinc-400 dark:text-zinc-500">default: "javascript"</span>
            </div>
          </div>
        </div>

        {/* AI Result Display */}
        {lastMessages && lastArgs && (executionPhase === 'complete' || promptCalls.length > 0) && (
          <div className="p-4 rounded-lg bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-[#8B5CF6] dark:text-[#A78BFA] uppercase tracking-wide">
                Last Generated Message
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                lang: {lastArgs.language}
              </span>
            </div>
            <pre className="text-xs text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg overflow-x-auto max-h-40">
              {lastMessages[0]?.content?.text || lastMessages[0]?.content}
            </pre>
          </div>
        )}
      </div>

      {promptCalls.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            Recent Calls
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {promptCalls.slice(-3).reverse().map((call, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">
                    getPrompt("{call.name}", {'{'}lang: "{call.args?.language}"{'}'})
                  </code>
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
