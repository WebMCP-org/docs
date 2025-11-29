// Interactive Quickstart Component
// A tool builder that shows code being generated in real-time
import { useState, useEffect, useRef } from 'react';

export const InteractiveQuickstart = () => {
  const [isPolyfillLoaded, setIsPolyfillLoaded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [activeTab, setActiveTab] = useState('react');
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const registrationRef = useRef(null);

  // Tool configuration state
  const [toolConfig, setToolConfig] = useState({
    name: 'greet_user',
    description: 'Greets the user by name',
    parameters: [
      { name: 'name', type: 'string', description: 'Name to greet', required: true }
    ],
  });

  // Test input state
  const [testInput, setTestInput] = useState({ name: 'World' });

  // Check polyfill status
  useEffect(() => {
    const checkPolyfill = () => {
      if (window.navigator?.modelContext) {
        setIsPolyfillLoaded(true);
      }
    };
    checkPolyfill();
    window.addEventListener('webmcp-loaded', checkPolyfill);
    return () => window.removeEventListener('webmcp-loaded', checkPolyfill);
  }, []);

  // Generate code for different frameworks
  const generateCode = (framework) => {
    const paramName = toolConfig.parameters[0]?.name || 'input';

    if (framework === 'react') {
      const zodSchema = toolConfig.parameters
        .map(p => `      ${p.name}: z.${p.type}()${p.required ? '' : '.optional()'}`)
        .join(',\n');

      return `import '@mcp-b/global';
import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function MyComponent() {
  useWebMCP({
    name: '${toolConfig.name}',
    description: '${toolConfig.description}',
    inputSchema: {
${zodSchema}
    },
    handler: async ({ ${paramName} }) => {
      return \`Hello, \${${paramName}}!\`;
    }
  });

  return <div>My Component</div>;
}`;
    }

    if (framework === 'vanilla') {
      const schemaProps = toolConfig.parameters
        .map(p => `        ${p.name}: { type: '${p.type}', description: '${p.description}' }`)
        .join(',\n');
      const required = toolConfig.parameters
        .filter(p => p.required)
        .map(p => `'${p.name}'`)
        .join(', ');

      return `import '@mcp-b/global';

navigator.modelContext.registerTool({
  name: '${toolConfig.name}',
  description: '${toolConfig.description}',
  inputSchema: {
    type: 'object',
    properties: {
${schemaProps}
    },
    required: [${required}]
  },
  execute: async ({ ${paramName} }) => {
    return {
      content: [{ type: 'text', text: \`Hello, \${${paramName}}!\` }]
    };
  }
});`;
    }

    if (framework === 'script') {
      const schemaProps = toolConfig.parameters
        .map(p => `        ${p.name}: { type: '${p.type}', description: '${p.description}' }`)
        .join(',\n');
      const required = toolConfig.parameters
        .filter(p => p.required)
        .map(p => `'${p.name}'`)
        .join(', ');

      return `<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>
<script>
  navigator.modelContext.registerTool({
    name: '${toolConfig.name}',
    description: '${toolConfig.description}',
    inputSchema: {
      type: 'object',
      properties: {
${schemaProps}
      },
      required: [${required}]
    },
    execute: async ({ ${paramName} }) => {
      return {
        content: [{ type: 'text', text: \`Hello, \${${paramName}}!\` }]
      };
    }
  });
</script>`;
    }
  };

  // Register the tool
  const registerTool = async () => {
    if (!isPolyfillLoaded) {
      setRegistrationError('WebMCP polyfill not loaded');
      return;
    }

    // Unregister previous if exists
    if (registrationRef.current) {
      try {
        registrationRef.current.unregister?.();
      } catch (e) {}
    }

    setRegistrationError(null);
    setIsRegistered(false);
    setTestResult(null);

    try {
      const schema = {
        type: 'object',
        properties: {},
        required: []
      };

      toolConfig.parameters.forEach(p => {
        schema.properties[p.name] = { type: p.type, description: p.description };
        if (p.required) schema.required.push(p.name);
      });

      registrationRef.current = await window.navigator.modelContext.registerTool({
        name: toolConfig.name,
        description: toolConfig.description,
        inputSchema: schema,
        execute: async (args) => {
          setIsExecuting(true);
          const paramName = toolConfig.parameters[0]?.name || 'input';
          const result = `Hello, ${args[paramName] || 'friend'}!`;
          setTestResult({ success: true, result });
          setTimeout(() => setIsExecuting(false), 1500);
          return { content: [{ type: 'text', text: result }] };
        }
      });

      setIsRegistered(true);
    } catch (error) {
      setRegistrationError(error.message);
    }
  };

  // Test the tool
  const testTool = async () => {
    if (!isRegistered) return;
    setIsExecuting(true);
    setTestResult(null);

    const paramName = toolConfig.parameters[0]?.name || 'input';
    const result = `Hello, ${testInput[paramName] || 'friend'}!`;
    setTestResult({ success: true, result });
    setTimeout(() => setIsExecuting(false), 1000);
  };

  // Copy code
  const copyCode = () => {
    navigator.clipboard.writeText(generateCode(activeTab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update parameter
  const updateParameter = (index, field, value) => {
    setToolConfig(prev => ({
      ...prev,
      parameters: prev.parameters.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }));
    // Update test input key if name changed
    if (field === 'name') {
      const oldName = toolConfig.parameters[index].name;
      setTestInput(prev => {
        const newInput = { ...prev };
        if (oldName in newInput) {
          newInput[value] = newInput[oldName];
          delete newInput[oldName];
        }
        return newInput;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`not-prose rounded-xl border overflow-hidden transition-all duration-300 ${
        isExecuting
          ? 'border-green-500 ring-2 ring-green-500/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">

        {/* Left: Form */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Configure Your Tool</h4>
            {isPolyfillLoaded ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                WebMCP Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Loading...
              </span>
            )}
          </div>

          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Tool Name
            </label>
            <input
              type="text"
              value={toolConfig.name}
              onChange={(e) => setToolConfig(prev => ({
                ...prev,
                name: e.target.value.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
              }))}
              className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={toolConfig.description}
              onChange={(e) => setToolConfig(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Parameter */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Parameter
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={toolConfig.parameters[0]?.name || ''}
                onChange={(e) => updateParameter(0, 'name', e.target.value.replace(/[^a-z0-9_]/gi, ''))}
                placeholder="name"
                className="flex-1 px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={toolConfig.parameters[0]?.type || 'string'}
                onChange={(e) => updateParameter(0, 'type', e.target.value)}
                className="px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
              </select>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={registerTool}
            disabled={!isPolyfillLoaded || !toolConfig.name}
            className={`w-full py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
              isRegistered
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed'
            }`}
          >
            {isRegistered ? '✓ Tool Registered' : 'Register Tool'}
          </button>

          {registrationError && (
            <p className="text-sm text-red-600 dark:text-red-400">{registrationError}</p>
          )}

          {/* Test Section */}
          {isRegistered && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <h5 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Test Your Tool</h5>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput[toolConfig.parameters[0]?.name] || ''}
                  onChange={(e) => setTestInput({ [toolConfig.parameters[0]?.name]: e.target.value })}
                  placeholder={toolConfig.parameters[0]?.name || 'input'}
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={testTool}
                  disabled={isExecuting}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors"
                >
                  {isExecuting ? 'Running...' : 'Test'}
                </button>
              </div>

              {testResult && (
                <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                    {testResult.result}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Try it with AI:</strong> Open the{' '}
                  <a
                    href="https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    MCP-B extension
                  </a>
                  {' '}and ask Claude to use your <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900">{toolConfig.name}</code> tool.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Code Preview */}
        <div className="flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900">
            {[
              { id: 'react', label: 'React' },
              { id: 'vanilla', label: 'Vanilla JS' },
              { id: 'script', label: 'Script Tag' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-zinc-800'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1"></div>
            <button
              onClick={copyCode}
              className="px-3 py-1 m-1 text-xs font-medium rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Code */}
          <div className="flex-1 overflow-auto bg-zinc-900">
            <pre className="p-4 text-sm leading-relaxed">
              <code className="text-zinc-100">{generateCode(activeTab)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
