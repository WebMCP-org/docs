// Live Color Converter Tool Example
// Demonstrates: Complex input schemas with enums, defaults, and optional parameters
export const ColorConverterTool = () => {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [rgbOutput, setRgbOutput] = useState('');
  const [hslOutput, setHslOutput] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [splashColor, setSplashColor] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const containerRef = useRef(null);

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
            try {
              // Dramatic color splash animation
              setIsExecuting(true);
              setSplashColor(null);

              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

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

              // Trigger color splash effect
              setTimeout(() => setSplashColor(hex), 100);

              // Generate color palette
              const palette = generatePalette(hex);
              setColorPalette(palette);

              const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
              const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
              const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

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

              // Clear execution highlight after delay
              setTimeout(() => {
                setIsExecuting(false);
                setSplashColor(null);
              }, 3500);

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

              setTimeout(() => setIsExecuting(false), 2000);

              return {
                content: [{
                  type: 'text',
                  text: `Error converting color: ${error.message}`,
                }],
                isError: true,
              };
            }
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

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl p-6 space-y-4 transition-all duration-500 relative overflow-hidden ${
        isExecuting
          ? 'border-transparent shadow-2xl ring-4 ring-opacity-50 scale-[1.02]'
          : 'border-zinc-200 dark:border-white/10'
      }`}
      style={{
        ringColor: splashColor || undefined,
        boxShadow: splashColor ? `0 25px 50px -12px ${splashColor}40` : undefined,
      }}
    >
      {/* Color splash effect - expanding circles */}
      {splashColor && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Central expanding ring */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping"
            style={{
              backgroundColor: splashColor,
              width: '200%',
              height: '200%',
              opacity: 0.15,
              animationDuration: '1.5s',
            }}
          />
          {/* Color burst particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: splashColor,
                width: '20px',
                height: '20px',
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 45}deg) translateY(-80px)`,
                opacity: 0.6,
                animation: 'ping 1s ease-out forwards',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Color Converter Tool
          </h3>
          {isExecuting && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full text-white animate-pulse shadow-lg"
              style={{ backgroundColor: splashColor || '#3b82f6' }}
            >
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Converting...
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
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4 relative z-10">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">enum</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">default</span>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">optional</span>
        <span>Complex schemas with enums and defaults</span>
      </div>

      <div className="space-y-3 relative z-10">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            HEX Color
          </label>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 flex-shrink-0 transition-transform duration-300"
              style={{
                backgroundColor: hexInput,
                transform: isExecuting ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* AI Color Palette Display */}
        {isExecuting && colorPalette.length > 0 && (
          <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">AI Generated Palette:</p>
            <div className="flex gap-2">
              {colorPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-16 rounded-lg shadow-lg transition-all duration-500"
                  style={{
                    backgroundColor: color,
                    transform: `scale(${1 - idx * 0.02})`,
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div className="h-full w-full flex items-end justify-center pb-1">
                    <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-black/20 text-white">
                      {color}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rgbOutput && !isExecuting && (
          <div className="space-y-2">
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
        <div className="mt-6 pt-6 border-t dark:border-white/10 relative z-10">
          <h4 className="text-sm font-semibold mb-3">
            Recent AI Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm transition-all duration-300 ${
                  call.status === 'processing'
                    ? 'bg-primary/10 border-primary/30 animate-pulse'
                    : call.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : call.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    : 'bg-background-light dark:bg-background-dark border dark:border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg border dark:border-white/10 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: call.color }}
                  />
                  <div className="flex-1">
                    <code className="text-primary">{call.color}</code>
                    {call.outputFormat && call.outputFormat !== 'all' && (
                      <span className="ml-2 text-xs text-zinc-500">({call.outputFormat})</span>
                    )}
                  </div>
                  {call.status === 'processing' && (
                    <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
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
                {call.result && (
                  <div className="space-y-1 font-mono text-xs opacity-70">
                    <div>{call.result.rgb}</div>
                    <div>{call.result.hsl}</div>
                  </div>
                )}
                {call.error && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Error: {call.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
