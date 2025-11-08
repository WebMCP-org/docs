# Documentation

This documentation is built with [Mintlify](https://mintlify.com).

## 🚀 Quick Start

### Prerequisites

- Node.js v18.0.0 or higher
- npm, yarn, or pnpm package manager

### Installation

Install the Mintlify CLI:

```bash
npm i -g mintlify
```

### Development

Run the development server:

```bash
mintlify dev
```

Your documentation will be available at `http://localhost:3000`.

### Building

Build the documentation:

```bash
mintlify build
```

## 📁 Project Structure

```
.
├── docs.json                      # Mintlify configuration, navigation, and theme settings
├── favicon.ico                    # Site favicon
├── style.css                      # Custom styles
│
├── Root Documentation Pages/
│   ├── introduction.mdx           # Landing page
│   ├── quickstart.mdx             # Getting started guide
│   ├── development.mdx            # Development workflow
│   ├── best-practices.mdx         # Best practices guide
│   ├── security.mdx               # Security documentation
│   ├── troubleshooting.mdx        # Troubleshooting guide
│   ├── advanced.mdx               # Advanced topics
│   ├── examples.mdx               # Code examples overview
│   ├── frontend-tools.mdx         # Frontend tooling
│   ├── building-mcp-ui-apps.mdx   # Building MCP UI applications
│   ├── connecting-agents.mdx      # Agent connections
│   ├── native-host-setup.mdx      # Native host configuration
│   ├── live-tool-examples.mdx     # Interactive examples
│   ├── changelog.mdx              # Version history
│   ├── why-webmcp.mdx             # WebMCP motivation
│   └── llms-txt.mdx               # LLM context file
│
├── concepts/                      # Core concepts documentation
│   ├── overview.mdx               # Concepts overview
│   ├── architecture.mdx           # System architecture
│   ├── tool-design.mdx            # Tool design patterns
│   ├── tool-registration.mdx      # Tool registration
│   ├── schemas.mdx                # Schema documentation
│   ├── security.mdx               # Security concepts
│   ├── performance.mdx            # Performance optimization
│   ├── transports.mdx             # Transport layers
│   ├── extension.mdx              # Browser extension concepts
│   ├── mcp-ui-integration.mdx     # MCP UI integration
│   └── glossary.mdx               # Terminology reference
│
├── ai-frameworks/                 # AI framework integration
│   ├── index.mdx                  # Frameworks overview
│   ├── setup.mdx                  # Framework setup
│   ├── assistant-ui.mdx           # Assistant UI integration
│   ├── ag-ui.mdx                  # AG UI integration
│   ├── custom-runtime.mdx         # Custom runtime setup
│   └── best-practices.mdx         # Framework best practices
│
├── extension/                     # Browser extension documentation
│   ├── index.mdx                  # Extension overview
│   ├── agents.mdx                 # Extension agents
│   └── managing-userscripts.mdx   # Userscript management
│
├── packages/                      # NPM package reference
│   ├── global.mdx                 # Global package
│   ├── react-webmcp.mdx           # React integration
│   ├── webmcp-ts-sdk.mdx          # TypeScript SDK
│   ├── transports.mdx             # Transport packages
│   ├── smart-dom-reader.mdx       # Smart DOM reader
│   └── extension-tools.mdx        # Extension utilities
│
├── tools/                         # Tools documentation
│   └── claude-code.mdx            # Claude Code integration
│
├── snippets/                      # Reusable code snippets
│   ├── README.md                  # Snippets documentation
│   ├── core/                      # Core tool snippets
│   ├── templates/                 # Tool templates
│   ├── imports/                   # Import statements
│   ├── validation/                # Validation schemas
│   ├── patterns/                  # Common patterns
│   ├── clients/                   # Client setup
│   └── [sample tools].jsx         # Full tool examples
│
├── logo/                          # Brand assets
│   └── mcp-b-logo.png            # WebMCP logo
│
├── .github/                       # GitHub automation
│   ├── workflows/                 # GitHub Actions
│   └── CHANGELOG_AUTOMATION.md   # Changelog automation docs
│
└── Documentation Files/           # Contributing and guidelines
    ├── README.md                  # This file
    ├── CLAUDE.md                  # AI assistant instructions
    ├── CODE_BLOCKS_STYLE_GUIDE.md # Code formatting standards
    ├── USING_SNIPPETS.md          # Snippet usage guide
    └── [other guides].md          # Additional documentation
```

## 🎨 Customization

### Colors

Edit the `colors` section in `docs.json`:

```json
{
  "colors": {
    "primary": "#0D9373",
    "light": "#07C983",
    "dark": "#0D9373"
  }
}
```

### Navigation

Update the `navigation` array in `docs.json` to customize the sidebar structure.

### Logo

Replace the SVG files in the `/logo` directory with your own logo files.

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [Component Library](https://mintlify.com/docs/components)
- [API Reference Setup](https://mintlify.com/docs/api-playground/openapi)

## 🆘 Support

For help with Mintlify, visit:
- [Documentation](https://mintlify.com/docs)
- [Community](https://mintlify.com/community)
- [Support](mailto:support@mintlify.com)

## 📝 License

This documentation is powered by Mintlify.