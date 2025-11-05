# Mintlify documentation

## Working relationship
- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context
- Format: MDX files with YAML frontmatter
- Config: mint.json for navigation, theme, settings
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
- If a code pattern appears 3+ times, consider creating a snippet
- Available snippet categories: core, imports, validation, clients, patterns, templates, examples
- See `/snippets/README.md` for full catalog and usage guidelines
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

## mint.json

- Refer to the [mint.json schema](https://mintlify.com/docs/settings/global) when building the mint.json file and site navigation
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
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

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