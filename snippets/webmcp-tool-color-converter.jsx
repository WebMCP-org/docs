// Live Color Converter Tool Example
// Demonstrates WebMCP tool for converting between color formats
export const ColorConverterTool = () => {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [rgbOutput, setRgbOutput] = useState('');
  const [hslOutput, setHslOutput] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);

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

  useEffect(() => {
    const registerTool = async () => {
      if (typeof window === 'undefined' || !window.navigator?.modelContext) {
        return;
      }

      try {
        await window.navigator.modelContext.registerTool({
          name: 'color_converter',
          description: 'Converts colors between HEX, RGB, and HSL formats',
          inputSchema: {
            type: 'object',
            properties: {
              color: {
                type: 'string',
                description: 'Color in HEX format (e.g., "#3b82f6" or "3b82f6")',
              },
              outputFormat: {
                type: 'string',
                enum: ['rgb', 'hsl', 'all'],
                description: 'Desired output format',
                default: 'all',
              },
            },
            required: ['color'],
          },
          async execute({ color, outputFormat = 'all' }) {
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
          },
        });

        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register color converter tool:', error);
      }
    };

    registerTool();

    return () => {
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
    <div className="not-prose border dark:border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
          Color Converter Tool
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
            HEX Color
          </label>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 flex-shrink-0"
              style={{ backgroundColor: hexInput }}
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

        {rgbOutput && (
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
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Recent AI Tool Calls
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolCalls.slice(-5).reverse().map((call, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-700"
                    style={{ backgroundColor: call.color }}
                  />
                  <code className="text-blue-600 dark:text-blue-400">{call.color}</code>
                </div>
                {call.result && (
                  <div className="space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    <div>{call.result.rgb}</div>
                    <div>{call.result.hsl}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Try it:</strong> Ask your AI: "Convert the color #FF5733 to RGB and HSL"
        </p>
      </div>
    </div>
  );
};
