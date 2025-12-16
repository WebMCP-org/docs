# Mintlify documentation

## Diataxis Documentation Framework

This documentation follows the [Diataxis framework](https://diataxis.fr/), which organizes content into four distinct types. **Do not mix content types within a single page.**

### The Four Content Types

| Type | Purpose | User Need | Directory |
|------|---------|-----------|-----------|
| **Tutorials** | Learn by doing | "Teach me" | `/tutorials/` |
| **How-to Guides** | Solve specific problems | "Help me do X" | `/how-to/` |
| **Reference** | Look up facts | "What are the details?" | `/packages/`, `/concepts/` |
| **Explanation** | Understand concepts | "Help me understand why" | `/concepts/` |

### Tutorials (`/tutorials/`)
- Guide users through building a complete project
- Focus on ONE path - don't present alternatives
- Don't explain "why" - just teach through doing
- Include checkpoints where users can verify success
- Example: "Build your first WebMCP tool with React"

### How-to Guides (`/how-to/`)
- Solve specific problems or tasks
- Assume the reader already knows the basics
- Action-focused: minimal explanation, maximum doing
- Can be read non-linearly
- Example: "How to handle errors in tools"

### Reference (`/packages/`, `/concepts/*.mdx`)
- Technical descriptions and facts
- Complete, accurate, austere
- Structure mirrors the thing being described
- No tutorials or explanations mixed in
- Example: "registerTool() API parameters"

### Explanation (`/concepts/why-webmcp.mdx`, `/concepts/architecture.mdx`)
- Help users understand concepts deeply
- Discuss "why" not "how"
- Can include opinions and perspectives
- Designed for reading away from keyboard
- Example: "Why WebMCP vs browser automation"

### Common Mistakes to Avoid
- **Don't mix types**: A tutorial that stops to explain "why" breaks flow
- **Don't add alternatives to tutorials**: Guide ONE path completely
- **Don't explain in reference docs**: Just state the facts
- **Don't include procedures in explanations**: Save the "how" for tutorials/guides

## Documentation structure overview

The WebMCP documentation uses a Diataxis-organized directory structure:

### Content type directories
- **`/tutorials/`**: Step-by-step learning content (Diataxis: Tutorials)
- **`/how-to/`**: Task-focused problem-solving guides (Diataxis: How-to Guides)
- **`/concepts/`**: Explanations and reference material (Diataxis: Explanation + Reference)
- **`/packages/`**: NPM package API reference (Diataxis: Reference)

### Other directories
- **`/calling-tools/`**: How agents call WebMCP tools (embedded agent, AI browsers, extension, devtools)
- **`/frameworks/`**: Framework-specific integration guides (Vue, Svelte, Angular, Rails, etc.)
- **`/extension/`**: Browser extension documentation (agents, userscripts)
- **`/tools/`**: Tools documentation (claude-code integration)
- **`/snippets/`**: Reusable code snippets organized by category (core, templates, validation, imports, patterns, clients)

### Key files & directories
- `docs.json`: Mintlify configuration, navigation structure, theme settings, and global metadata
- `*.mdx`: Documentation pages with frontmatter (title, description, sidebarTitle, icon)
- `/snippets/`: Reusable content fragments used across multiple pages (see USING_SNIPPETS.md)
  - Organized into subdirectories: `core/`, `templates/`, `validation/`, `imports/`, `patterns/`, `clients/`
- `/logo/`: Brand assets (mcp-b-logo.png)
- `/.github/`: GitHub workflows and automation documentation

### Navigation organization
The site navigation (defined in docs.json) groups pages conceptually, which may differ from the file structure:
- Navigation groups like "Getting Started", "Guides", "SDK Reference" are organizational concepts
- These groups pull from various locations (root pages and directories)
- Always check docs.json to understand the published navigation structure

## Contributing to the docs

### Before you start
1. **Search existing content**: Check if similar information already exists to avoid duplication
2. **Understand the audience**: Documentation targets developers working with MCP in browsers
3. **Review existing patterns**: Look at similar pages to maintain consistency

### Making changes
1. **Start small**: Make the smallest reasonable change that solves the problem
2. **Test thoroughly**: Verify all code examples work before publishing
3. **Check links**: Ensure all internal links use relative paths and are valid
4. **Preview locally**: Use `mintlify dev` to preview changes before committing

### Common workflows
- **Adding a new page**: Create MDX file with proper frontmatter → Add to docs.json navigation → Test locally
- **Updating SDK documentation**: Update MDX content → Test code examples → Verify TypeScript types are accurate
- **Fixing broken links**: Use relative paths like `./page-name` or `../section/page-name`
- **Adding code examples**: Check for existing snippet → If none exists, follow [Code Blocks Style Guide](CODE_BLOCKS_STYLE_GUIDE.md) → Test the code → Consider creating snippet if used 3+ times
- **Using reusable snippets**: Search `/snippets/` directory → Import snippet → Use with props → Preview locally to verify rendering

## Working relationship
- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context
- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components
- Organization: WebMCP-org GitHub organization
- Main repository: https://github.com/WebMCP-org/docs

## Content strategy
- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## Reusable snippets
- Use snippets from `/snippets/` directory for common code patterns
- **See [USING_SNIPPETS.md](USING_SNIPPETS.md) for complete usage guide with examples**
- 33 snippets available covering all common WebMCP patterns
- If a code pattern appears 3+ times, consider creating a snippet
- When to use snippets:
  - Tool registration patterns (registerTool, useWebMCP)
  - Response formats (success, error, markdown)
  - Import statements (React, vanilla JS, client)
  - Validation schemas (Zod, JSON Schema)
  - Client setup (McpClientProvider, transports)
- When NOT to use snippets:
  - Page-specific examples that benefit from inline context
  - One-off code examples (appears only 1-2 times)
  - Tutorial walkthroughs where step-by-step explanation is key

## docs.json

- Refer to the [Mintlify configuration schema](https://mintlify.com/docs/settings/global) when building the docs.json file and site navigation
- Navigation structure is defined in the "navigation" array
- Each group has a "group" name and "pages" array

## Frontmatter requirements for pages
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation
- sidebarTitle: (optional) Shorter title for sidebar display
- icon: (optional) Icon name from Font Awesome or Lucide

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Alt text on all images
- Relative paths for internal links

### Code blocks
Follow the [Code Blocks Style Guide](CODE_BLOCKS_STYLE_GUIDE.md) for all code formatting. Key requirements:
- **Always specify language** for syntax highlighting (e.g., `typescript`, `bash`, `tsx`)
- **Use `twoslash`** for TypeScript/TSX examples to enable hover type information
- **Add titles** to major code examples (3+ uses or complex): `"filename.ext"` or `"Description"`
- **Use icons** to provide visual context (e.g., `icon="react"`, `icon="server"`, `icon="npm"`)
- **Use `lines`** for reference documentation and tutorial content
- **Make long examples expandable** (50+ lines): add `expandable` option
- **Use diff syntax** for good vs. bad comparisons: `// [!code ++]` and `// [!code --]`
- **Highlight key lines** in teaching examples: `highlight={5-12}`

Example:
````markdown
```tsx "MyComponent.tsx" twoslash lines icon="react" highlight={5-7}
import { useWebMCP } from '@mcp-b/react-webmcp';

function MyComponent() {
  useWebMCP({
    name: 'my_tool',
    handler: async (args) => { ... }
  });
}
```
````

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks
- Use descriptive commit messages following conventional commits

## WebMCP-specific guidelines
- Reference the official WebMCP-org repositories
- Examples repository: https://github.com/WebMCP-org/examples
- NPM packages: @mcp-b/transports and related packages
- Focus on Model Context Protocol (MCP) functionality
- Include TypeScript examples with proper type definitions
- Document both browser and Node.js usage patterns

## Do not
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification
- Reference outdated MiguelsPizza organization links
- Commit node_modules or build artifacts

## Mintlify documentation reference

Use these official Mintlify resources when working on documentation:

### Essential references
- **[Global settings](https://mintlify.com/docs/organize/settings)**: Complete docs.json configuration options
- **[Navigation](https://mintlify.com/docs/organize/navigation)**: Structure and customize navigation hierarchy
- **[Pages](https://mintlify.com/docs/organize/pages)**: Page creation and frontmatter requirements
- **[Format text](https://mintlify.com/docs/create/text)**: Text formatting, headers, and styling
- **[Format code](https://mintlify.com/docs/create/code)**: Inline code and code blocks with syntax highlighting

### Components
- **[Callouts](https://mintlify.com/docs/components/callouts)**: Info, warning, success, and error callouts
- **[Cards](https://mintlify.com/docs/components/cards)**: Highlight main points with customizable layouts
- **[Tabs](https://mintlify.com/docs/components/tabs)**: Toggle between different content views
- **[Code groups](https://mintlify.com/docs/components/code-groups)**: Display multiple code examples
- **[Accordions](https://mintlify.com/docs/components/accordions)**: Collapsible content sections
- **[Steps](https://mintlify.com/docs/components/steps)**: Sequential procedural content

### Content creation
- **[Reusable snippets](https://mintlify.com/docs/create/reusable-snippets)**: Keep content in sync across pages
- **[Images and embeds](https://mintlify.com/docs/create/image-embeds)**: Add images, videos, and iframes
- **[Lists and tables](https://mintlify.com/docs/create/list-table)**: Display structured information
- **[Redirects and broken links](https://mintlify.com/docs/create/broken-links)**: Prevent invalid links

### Best practices
- **[Style and tone](https://mintlify.com/docs/guides/style-and-tone)**: Writing effective technical documentation
- **[Content types](https://mintlify.com/docs/guides/content-types)**: Create the right content for your users
- **[Organize navigation](https://mintlify.com/docs/guides/navigation)**: Information architecture guidelines
- **[Git concepts](https://mintlify.com/docs/guides/git-concepts)**: Git fundamentals for docs-as-code
- **[Working with branches](https://mintlify.com/docs/guides/branches)**: Make changes without affecting live docs
- **[SEO](https://mintlify.com/docs/guides/seo)**: Improve documentation discoverability

### Deployment and tools
- **[GitHub integration](https://mintlify.com/docs/deploy/github)**: Sync docs with GitHub repo
- **[Preview deployments](https://mintlify.com/docs/deploy/preview-deployments)**: Preview changes before merging
- **[CLI installation](https://mintlify.com/docs/installation)**: Preview and maintain docs locally