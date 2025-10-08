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
├── mint.json           # Global configuration
├── introduction.mdx    # Landing page
├── quickstart.mdx      # Getting started guide
├── development.mdx     # Development guide
├── essentials/         # Core documentation
│   ├── markdown.mdx
│   ├── code.mdx
│   ├── images.mdx
│   ├── settings.mdx
│   ├── navigation.mdx
│   └── reusable-snippets.mdx
├── logo/              # Logo assets
│   ├── light.svg
│   └── dark.svg
├── images/            # Image assets
└── favicon.svg        # Favicon
```

## 🎨 Customization

### Colors

Edit the `colors` section in `mint.json`:

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

Update the `navigation` array in `mint.json` to customize the sidebar structure.

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