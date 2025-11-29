// Live Color Converter Tool Example
// Demonstrates: Complex input schemas with enums, defaults, and optional parameters
export const ColorConverterTool = () => {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [rgbOutput, setRgbOutput] = useState('');
  const [hslOutput, setHslOutput] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [executionPhase, setExecutionPhase] = useState(null); // 'scrolling' | 'executing' | 'complete' | null
  const [lastConversion, setLastConversion] = useState(null);
  const containerRef = useRef(null);

  // Execution sequence: scroll → wait → execute
  const startExecution = async (onExecute) => {
    setExecutionPhase('scrolling');
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    await new Promise(resolve => setTimeout(resolve, 250));
    setExecutionPhase('executing');
    const result = await onExecute();
    setExecutionPhase('complete');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutionPhase(null);
    return result;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Generate complementary color palette
  const generatePalette = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [];

    // Generate 5 colors: original, complementary, and analogous
    const hues = [0, 180, 30, -30, 60].map(offset => (hsl.h + offset + 360) % 360);

    hues.forEach(h => {
      const hNorm = h / 360;
      const sNorm = hsl.s / 100;
      const lNorm = hsl.l / 100;

      let r, g, b;
      if (sNorm === 0) {
        r = g = b = lNorm;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;
        r = hue2rgb(p, q, hNorm + 1/3);
        g = hue2rgb(p, q, hNorm);
        b = hue2rgb(p, q, hNorm - 1/3);
      }

      const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
      palette.push(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    });

    return palette;
  };

  useEffect(() => {
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        await window.navigator.modelContext.registerTool({
          name: 'color_converter',
          description: 'Converts HEX colors to RGB and HSL formats. Input must be in HEX format.',
          inputSchema: {
            type: 'object',
            properties: {
              color: {
                type: 'string',
                description: 'Color in HEX format (e.g., "#3b82f6" or "3b82f6"). Must be a valid HEX color code.',
              },
              outputFormat: {
                type: 'string',
                enum: ['rgb', 'hsl', 'all'],
                description: 'Desired output format (rgb, hsl, or all)',
                default: 'all',
              },
            },
            required: ['color'],
          },
          async execute({ color, outputFormat = 'all' }) {
            return startExecution(async () => {
              try {
                setToolCalls(prev => [...prev, {
                  time: new Date().toISOString(),
                  color,
                  outputFormat,
                  status: 'processing'
                }]);

                const hex = color.startsWith('#') ? color : `#${color}`;
                const rgb = hexToRgb(hex);

                if (!rgb) {
                  throw new Error('Invalid HEX color format');
                }

                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

                setLastConversion({ hex, rgb: rgbStr, hsl: hslStr });

                let result;
                if (outputFormat === 'rgb') {
                  result = rgbStr;
                } else if (outputFormat === 'hsl') {
                  result = hslStr;
                } else {
                  result = `RGB: ${rgbStr}\nHSL: ${hslStr}`;
                }

                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, result: { rgb: rgbStr, hsl: hslStr }, status: 'success' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Color ${hex} converted:\n${result}`,
                  }],
                };
              } catch (error) {
                setToolCalls(prev => prev.map((call, idx) =>
                  idx === prev.length - 1 ? { ...call, error: error.message, status: 'error' } : call
                ));

                return {
                  content: [{
                    type: 'text',
                    text: `Error converting color: ${error.message}`,
                  }],
                  isError: true,
                };
              }
            });
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register color converter tool:', error);
      }
    };

    // Try to register immediately if polyfill is already loaded
    registerTool();

    // Listen for polyfill load event
    window.addEventListener('webmcp-loaded', registerTool);

    return () => {
      window.removeEventListener('webmcp-loaded', registerTool);
      if (window.navigator?.modelContext?.unregisterTool) {
        window.navigator.modelContext.unregisterTool('color_converter');
      }
    };
  }, []);

  const handleConvert = () => {
    try {
      const hex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      const rgb = hexToRgb(hex);

      if (!rgb) {
        setRgbOutput('Invalid HEX color');
        setHslOutput('Invalid HEX color');
        return;
      }

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setRgbOutput(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      setHslOutput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    } catch (error) {
      setRgbOutput(`Error: ${error.message}`);
      setHslOutput(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    handleConvert();
  }, [hexInput]);

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
            className={`h-full bg-[#1F5EFF] transition-all duration-300 ${
              executionPhase === 'scrolling' ? 'w-1/4' :
              executionPhase === 'executing' ? 'w-3/4 animate-pulse' :
              'w-full'
            }`}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Color Converter Tool
          </h3>
          {isActive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[#1F5EFF]/10 text-[#1F5EFF] dark:bg-[#1F5EFF]/20 dark:text-[#4B7BFF]">
              {executionPhase === 'scrolling' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F5EFF] animate-pulse" />
                  Navigating...
                </>
              )}
              {executionPhase === 'executing' && (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
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
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">enum</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">default</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">optional</span>
        <span>Complex schemas with enums and defaults</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            HEX Color
          </label>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 flex-shrink-0 transition-all duration-300"
              style={{ backgroundColor: hexInput }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        {/* AI Conversion Result */}
        {(executionPhase === 'executing' || executionPhase === 'complete') && lastConversion && (
          <div className="p-4 rounded-lg bg-[#1F5EFF]/5 dark:bg-[#1F5EFF]/10 border border-[#1F5EFF]/20">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg border-2 border-[#1F5EFF]/30"
                style={{ backgroundColor: lastConversion.hex }}
              />
              <div>
                <p className="text-xs font-medium text-[#1F5EFF] dark:text-[#4B7BFF] uppercase tracking-wide">AI Result</p>
                <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{lastConversion.hex}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-white/50 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">RGB</p>
                <p className="font-mono text-xs text-zinc-900 dark:text-zinc-100">{lastConversion.rgb}</p>
              </div>
              <div className="p-2 rounded bg-white/50 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">HSL</p>
                <p className="font-mono text-xs text-zinc-900 dark:text-zinc-100">{lastConversion.hsl}</p>
              </div>
            </div>
          </div>
        )}

        {rgbOutput && !isActive && (
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">RGB</p>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{rgbOutput}</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">HSL</p>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{hslOutput}</p>
            </div>
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
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-600"
                      style={{ backgroundColor: call.color }}
                    />
                    <code className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">{call.color}</code>
                  </div>
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
