// Interactive Quickstart Component
// A step-by-step wizard to build and test your first WebMCP tool
import { useState, useEffect, useRef } from 'react';

export const InteractiveQuickstart = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPolyfillLoaded, setIsPolyfillLoaded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const containerRef = useRef(null);
  const registrationRef = useRef(null);

  // Tool configuration state
  const [toolConfig, setToolConfig] = useState({
    name: 'my_first_tool',
    description: 'A simple tool that greets the user',
    parameters: [
      { name: 'name', type: 'string', description: 'Name to greet', required: true }
    ],
    handlerType: 'greeting' // greeting, page_info, custom
  });

  // Test input state
  const [testInput, setTestInput] = useState({ name: 'World' });

  const steps = [
    { title: 'Check Status', icon: '1' },
    { title: 'Name Your Tool', icon: '2' },
    { title: 'Add Parameters', icon: '3' },
    { title: 'Choose Handler', icon: '4' },
    { title: 'Register & Test', icon: '5' },
    { title: 'Export Code', icon: '6' },
  ];

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

  // Generate handler code based on type
  const getHandlerCode = () => {
    const params = toolConfig.parameters.map(p => p.name).join(', ');

    switch (toolConfig.handlerType) {
      case 'greeting':
        return `async ({ ${params} }) => {
  return {
    content: [{ type: 'text', text: \`Hello, \${${toolConfig.parameters[0]?.name || 'name'}}! Welcome to WebMCP.\` }]
  };
}`;
      case 'page_info':
        return `async () => {
  return {
    content: [{ type: 'text', text: \`Page: \${document.title} | URL: \${window.location.href}\` }]
  };
}`;
      case 'custom':
        return `async ({ ${params} }) => {
  // Your custom logic here
  return {
    content: [{ type: 'text', text: 'Tool executed successfully!' }]
  };
}`;
      default:
        return '';
    }
  };

  // Generate full code for different frameworks
  const generateCode = (framework) => {
    const schemaProps = toolConfig.parameters
      .map(p => `          ${p.name}: { type: '${p.type}', description: '${p.description}' }`)
      .join(',\n');
    const required = toolConfig.parameters
      .filter(p => p.required)
      .map(p => `'${p.name}'`)
      .join(', ');

    if (framework === 'react') {
      const zodSchema = toolConfig.parameters
        .map(p => `    ${p.name}: z.${p.type}()${p.required ? '' : '.optional()'}`)
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
    handler: ${getHandlerCode()}
  });

  return <div>My Component</div>;
}`;
    }

    if (framework === 'vanilla') {
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
  execute: ${getHandlerCode()}
});`;
    }

    if (framework === 'script') {
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
    execute: ${getHandlerCode()}
  });
</script>`;
    }
  };

  // Actually register the tool
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

      const executeHandler = async (args) => {
        setIsExecuting(true);

        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        let result;
        try {
          switch (toolConfig.handlerType) {
            case 'greeting':
              result = `Hello, ${args[toolConfig.parameters[0]?.name] || 'friend'}! Welcome to WebMCP.`;
              break;
            case 'page_info':
              result = `Page: ${document.title} | URL: ${window.location.href}`;
              break;
            default:
              result = 'Tool executed successfully!';
          }

          setTestResult({ success: true, result });

          setTimeout(() => setIsExecuting(false), 2000);

          return {
            content: [{ type: 'text', text: result }]
          };
        } catch (error) {
          setTestResult({ success: false, error: error.message });
          setTimeout(() => setIsExecuting(false), 2000);
          return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true
          };
        }
      };

      registrationRef.current = await window.navigator.modelContext.registerTool({
        name: toolConfig.name,
        description: toolConfig.description,
        inputSchema: schema,
        execute: executeHandler
      });

      setIsRegistered(true);
    } catch (error) {
      setRegistrationError(error.message);
    }
  };

  // Test the tool manually
  const testTool = async () => {
    if (!isRegistered) return;

    setIsExecuting(true);
    setTestResult(null);

    try {
      let result;
      switch (toolConfig.handlerType) {
        case 'greeting':
          result = `Hello, ${testInput[toolConfig.parameters[0]?.name] || 'friend'}! Welcome to WebMCP.`;
          break;
        case 'page_info':
          result = `Page: ${document.title} | URL: ${window.location.href}`;
          break;
        default:
          result = 'Tool executed successfully!';
      }

      setTestResult({ success: true, result });
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    }

    setTimeout(() => setIsExecuting(false), 1500);
  };

  // Copy code to clipboard
  const copyCode = (framework) => {
    navigator.clipboard.writeText(generateCode(framework));
  };

  // Add parameter
  const addParameter = () => {
    setToolConfig(prev => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', type: 'string', description: '', required: false }]
    }));
  };

  // Update parameter
  const updateParameter = (index, field, value) => {
    setToolConfig(prev => ({
      ...prev,
      parameters: prev.parameters.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  // Remove parameter
  const removeParameter = (index) => {
    setToolConfig(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return isPolyfillLoaded;
      case 1: return toolConfig.name && toolConfig.description;
      case 2: return toolConfig.parameters.every(p => p.name && p.type);
      case 3: return toolConfig.handlerType;
      case 4: return isRegistered;
      default: return true;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`not-prose border rounded-xl overflow-hidden transition-all duration-500 ${
        isExecuting
          ? 'border-green-500 shadow-2xl shadow-green-500/20 ring-4 ring-green-500/20'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h3 className="text-xl font-bold mb-2">Build Your First Tool</h3>
        <p className="text-blue-100 text-sm">Create and test a WebMCP tool in 60 seconds</p>
      </div>

      {/* Progress Steps */}
      <div className="flex border-b border-zinc-200 dark:border-white/10 overflow-x-auto">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => idx <= currentStep && setCurrentStep(idx)}
            className={`flex-1 min-w-[100px] py-3 px-2 text-center text-xs font-medium transition-all ${
              idx === currentStep
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : idx < currentStep
                ? 'text-green-600 dark:text-green-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800'
                : 'text-zinc-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs ${
              idx < currentStep
                ? 'bg-green-500 text-white'
                : idx === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
            }`}>
              {idx < currentStep ? '✓' : step.icon}
            </div>
            {step.title}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="p-6">
        {/* Step 0: Status Check */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">WebMCP Status</h4>
            <div className={`p-4 rounded-lg flex items-center gap-4 ${
              isPolyfillLoaded
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPolyfillLoaded ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {isPolyfillLoaded ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-semibold ${isPolyfillLoaded ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {isPolyfillLoaded ? 'WebMCP is Ready!' : 'WebMCP Not Detected'}
                </p>
                <p className={`text-sm ${isPolyfillLoaded ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {isPolyfillLoaded
                    ? 'The navigator.modelContext API is available. You can create tools!'
                    : 'The polyfill should load automatically on this page. Try refreshing.'}
                </p>
              </div>
            </div>
            {isPolyfillLoaded && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Great! The WebMCP polyfill is loaded on this documentation site. Let's create your first tool.
              </p>
            )}
          </div>
        )}

        {/* Step 1: Name Your Tool */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Name Your Tool</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Give your tool a descriptive name and explain what it does.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tool Name</label>
                <input
                  type="text"
                  value={toolConfig.name}
                  onChange={(e) => setToolConfig(prev => ({ ...prev, name: e.target.value.replace(/[^a-z0-9_]/gi, '_').toLowerCase() }))}
                  placeholder="my_tool_name"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">Use snake_case (e.g., get_user_info, add_to_cart)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={toolConfig.description}
                  onChange={(e) => setToolConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A brief description of what this tool does"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">AI uses this to understand when to call your tool</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add Parameters */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Define Parameters</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              What inputs does your tool need? Add parameters below.
            </p>
            <div className="space-y-3">
              {toolConfig.parameters.map((param, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParameter(idx, 'name', e.target.value.replace(/[^a-z0-9_]/gi, ''))}
                      placeholder="param_name"
                      className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm font-mono"
                    />
                    <select
                      value={param.type}
                      onChange={(e) => updateParameter(idx, 'type', e.target.value)}
                      className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                    </select>
                    <input
                      type="text"
                      value={param.description}
                      onChange={(e) => updateParameter(idx, 'description', e.target.value)}
                      placeholder="Description"
                      className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParameter(idx, 'required', e.target.checked)}
                      className="rounded"
                    />
                    Required
                  </label>
                  <button
                    onClick={() => removeParameter(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addParameter}
                className="w-full py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                + Add Parameter
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Handler */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Choose Handler Type</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              What should your tool do when called?
            </p>
            <div className="grid gap-3">
              {[
                { id: 'greeting', title: 'Greeting', desc: 'Returns a personalized greeting message', icon: '👋' },
                { id: 'page_info', title: 'Page Info', desc: 'Returns current page title and URL', icon: '📄' },
                { id: 'custom', title: 'Custom', desc: 'A template for your own logic', icon: '🔧' },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setToolConfig(prev => ({ ...prev, handlerType: option.id }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    toolConfig.handlerType === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-medium">{option.title}</p>
                      <p className="text-sm text-zinc-500">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Code Preview */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Handler Preview:</p>
              <pre className="p-4 rounded-lg bg-zinc-900 text-zinc-100 text-xs overflow-x-auto">
                <code>{getHandlerCode()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Step 4: Register & Test */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Register & Test Your Tool</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Click below to register your tool with WebMCP, then test it!
            </p>

            {/* Registration */}
            <div className="space-y-3">
              <button
                onClick={registerTool}
                disabled={isRegistered}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  isRegistered
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRegistered ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tool Registered!
                  </span>
                ) : 'Register Tool'}
              </button>

              {registrationError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  Error: {registrationError}
                </div>
              )}
            </div>

            {/* Test Interface */}
            {isRegistered && (
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <p className="font-medium text-sm">Test Your Tool:</p>

                {toolConfig.handlerType !== 'page_info' && toolConfig.parameters.map((param, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      {param.name}
                    </label>
                    <input
                      type={param.type === 'number' ? 'number' : 'text'}
                      value={testInput[param.name] || ''}
                      onChange={(e) => setTestInput(prev => ({ ...prev, [param.name]: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
                    />
                  </div>
                ))}

                <button
                  onClick={testTool}
                  disabled={isExecuting}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {isExecuting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Executing...
                    </span>
                  ) : 'Run Test'}
                </button>

                {testResult && (
                  <div className={`p-3 rounded-lg ${
                    testResult.success
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <p className="text-xs font-medium mb-1">
                      {testResult.success ? 'Result:' : 'Error:'}
                    </p>
                    <p className={`text-sm font-mono ${
                      testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {testResult.success ? testResult.result : testResult.error}
                    </p>
                  </div>
                )}

                <p className="text-xs text-zinc-500 text-center mt-2">
                  AI agents can now call this tool too! Try it with the MCP-B extension.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Export Code */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Export Your Code</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Copy the code below to add this tool to your project.
            </p>

            {/* Framework Tabs */}
            <div className="space-y-3">
              {[
                { id: 'react', label: 'React', icon: '⚛️' },
                { id: 'vanilla', label: 'Vanilla JS', icon: '📦' },
                { id: 'script', label: 'Script Tag', icon: '🏷️' },
              ].map(fw => (
                <div key={fw.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800">
                    <span className="font-medium text-sm">{fw.icon} {fw.label}</span>
                    <button
                      onClick={() => copyCode(fw.id)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-zinc-900 text-zinc-100 text-xs overflow-x-auto max-h-48">
                    <code>{generateCode(fw.id)}</code>
                  </pre>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Next steps:</strong> Paste this code into your project, customize the handler logic, and your tool will be discoverable by AI agents!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between p-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900">
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ← Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};
