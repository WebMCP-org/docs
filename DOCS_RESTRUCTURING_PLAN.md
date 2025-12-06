# WebMCP Documentation Restructuring Plan

## Executive Summary

This document outlines a plan to restructure the WebMCP documentation to reflect the product pivot: **from extension-as-product to extension-as-one-option**. The new mental model positions the in-page agent as the primary way to test and interact with WebMCP tools, with the extension, Chrome DevTools MCP, and local MCP clients as alternative options.

---

## Current State Problems

### 1. Extension is Over-Positioned
| Location | Problem |
|----------|---------|
| **Navbar CTA** | Primary button is "Get Extension" |
| **Quickstart prerequisites** | Extension listed as required |
| **Introduction audiences** | "Extension Users" listed as equal to "Website Developers" |
| **"How It Works" step 3** | "Install the MCP-B Extension or integrate with AI frameworks" |
| **Navigation** | Extension has its own top-level tab |

### 2. Missing Content
- **In-page agent** - Not documented at all (the new primary testing method)
- **Testing story** - Scattered across 4+ pages with no clear guidance

### 3. Confusing Mental Model
Current docs suggest:
> Build tools → Install extension → Test

Should be:
> Build tools → Test with any agent (in-page, extension, DevTools, etc.)

---

## New Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         WebMCP                                   │
│         A standard for making websites AI-accessible            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUILD TOOLS                                 │
│                                                                  │
│   Register functions with navigator.modelContext.registerTool() │
│   - React: useWebMCP() hook                                     │
│   - Vanilla: registerTool() API                                 │
│   - Script tag: CDN include                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONSUME / TEST TOOLS                         │
│                                                                  │
│   Multiple options (all equal):                                 │
│                                                                  │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│   │  In-Page     │ │   Browser    │ │  Frontend AI │           │
│   │  Agent ⭐    │ │   Agents     │ │  Frameworks  │           │
│   │  (Primary)   │ │  (Future)    │ │ (Assistant-UI│           │
│   │              │ │              │ │   AG-UI)     │           │
│   └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                  │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│   │   MCP-B      │ │ Chrome       │ │  Local MCP   │           │
│   │  Extension   │ │ DevTools MCP │ │  Clients     │           │
│   │              │ │              │ │(Claude, etc.)│           │
│   └──────────────┘ └──────────────┘ └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight**: The in-page agent will be embedded in the docs site itself, letting users test tools without installing anything.

---

## Proposed Navigation Structure

### Current Navigation (docs.json)

```
Navbar CTA: "Get Extension" ❌

Tabs:
├── Documentation
├── Concepts
├── Extension          ← Own top-level tab (over-positioned)
├── AI Frameworks
├── Frameworks
├── For AI
└── Live Examples
```

### Proposed Navigation

```
Navbar CTA: "Try Live Demo" or "Get Started" ✅

Tabs:
├── Documentation
│   ├── Getting Started
│   │   ├── introduction
│   │   ├── quickstart
│   │   └── examples
│   ├── Guides
│   │   ├── connecting-agents    ← Reframed: "Testing & Connecting Agents"
│   │   ├── best-practices
│   │   ├── development
│   │   ├── advanced
│   │   ├── building-mcp-ui-apps
│   │   └── security
│   ├── NPM Packages
│   │   └── ... (no changes)
│   └── Reference
│       └── ... (no changes)
│
├── Concepts
│   └── ... (no changes, but add "Testing" concept?)
│
├── Testing & Agents               ← NEW: Replaces "Extension" tab
│   ├── Overview
│   │   └── testing-agents-overview   ← NEW: Explains all testing options
│   ├── In-Page Agent
│   │   └── in-page-agent             ← NEW: Primary testing method
│   ├── MCP-B Extension               ← Demoted to a section
│   │   ├── extension/index
│   │   ├── extension/agents
│   │   └── extension/managing-userscripts
│   ├── Other Options
│   │   ├── native-host-setup
│   │   └── packages/chrome-devtools-mcp
│   └── Architecture
│       ├── concepts/extension
│       └── packages/extension-tools
│
├── AI Frameworks
│   └── ... (no changes)
│
├── Frameworks
│   └── ... (no changes)
│
├── For AI
│   └── ... (no changes)
│
└── Live Examples
    └── ... (no changes, but powered by in-page agent!)
```

**Key changes:**
1. **Navbar CTA**: "Get Extension" → "Try Live Demo" or "Get Started"
2. **Extension tab** → "Testing & Agents" tab (reframes purpose)
3. **In-page agent** becomes the primary testing option
4. **Extension** becomes one section within "Testing & Agents"

---

## Page-by-Page Changes

### HIGH PRIORITY (Core Messaging)

#### 1. `docs.json` - Navigation & CTA
**Changes:**
- [ ] Change navbar primary button from "Get Extension" to "Try Live Demo" or "Get Started"
- [ ] Rename "Extension" tab to "Testing & Agents"
- [ ] Reorganize tab structure per proposal above

#### 2. `introduction.mdx` - First Impressions
**Changes:**
- [ ] Update "Who Is This For?" section:
  - Keep: "Website Developers", "App Builders", "AI Developers"
  - Reframe: "Extension Users" → "Power Users" (or remove entirely)
- [ ] Update "How It Works" Step 3:
  - Current: "Install the MCP-B Extension or integrate with AI frameworks"
  - New: "Test with any agent" (in-page, extension, DevTools, etc.)
- [ ] Add card for in-page agent in "Key Terms" or "Next Steps"

#### 3. `quickstart.mdx` - The Critical Entry Point
**Changes:**
- [ ] Remove extension from prerequisites
- [ ] Update "Testing" section to show multiple options:
  1. **In-page agent** (primary) - "Try it right here on the docs"
  2. **MCP-B Extension** - "For testing across multiple tabs"
  3. **Chrome DevTools MCP** - "For AI-driven development"
- [ ] Keep interactive quickstart component (already good!)
- [ ] Emphasize: "No installation required to test"

#### 4. `connecting-agents.mdx` - The Agent Overview
**Changes:**
- [ ] Rename to "Testing & Connecting Agents" (or similar)
- [ ] Reorder connection methods:
  1. **In-page Agent** (NEW - primary)
  2. **Browser Agents** (future)
  3. **Frontend AI Frameworks**
  4. **MCP-B Extension** (demoted)
  5. **Chrome DevTools MCP**
  6. **Local MCP Clients**
- [ ] Add prominent callout: "Easiest way to test: use the in-page agent right here in the docs"

### MEDIUM PRIORITY (Supporting Pages)

#### 5. `development.mdx` - Development Workflow
**Changes:**
- [ ] Update "Testing" section to reference multiple options
- [ ] Remove extension as implicit requirement
- [ ] Add reference to new testing overview page

#### 6. `best-practices.mdx` - Tool Design
**Changes:**
- [ ] Review extension references for accuracy
- [ ] Ensure advice is agent-agnostic where possible

#### 7. `advanced.mdx` - Advanced Patterns
**Changes:**
- [ ] Review 31 extension mentions
- [ ] Ensure extension content is positioned as "one option" not "the option"
- [ ] Keep extension-specific advanced content (multi-tab aggregation, etc.)

### NEW PAGES NEEDED

#### 8. `testing-agents-overview.mdx` (NEW)
**Purpose:** Single page explaining all testing options, helps users choose
**Content:**
- Quick comparison table of all testing options
- When to use each option
- "Easiest path" recommendation (in-page agent)
- Links to detailed guides for each option

#### 9. `in-page-agent.mdx` (NEW)
**Purpose:** Documentation for the new in-page agent
**Content:**
- What it is (script tag / custom element / React component)
- How to add to your project
- How it works on the docs site (interactive testing)
- Comparison with other options
- API reference (if applicable)

**Note:** Content depends on in-page agent implementation details.

### LOW PRIORITY (Extension-Specific)

#### 10. `extension/index.mdx` - Extension Overview
**Changes:**
- [ ] Add intro framing: "The MCP-B Extension is one way to test and use WebMCP tools..."
- [ ] Keep all existing content (it's well-written)
- [ ] Ensure it doesn't position extension as the primary path

#### 11. `extension/agents.mdx`, `extension/managing-userscripts.mdx`
**Changes:**
- [ ] No content changes needed
- [ ] Navigation moves them under "Testing & Agents" → "MCP-B Extension"

#### 12. `native-host-setup.mdx`
**Changes:**
- [ ] Move from extension-specific to general "Other Options"
- [ ] Frame as "Connect browser tools to desktop AI" (agent-agnostic)

#### 13. `concepts/extension.mdx`, `packages/extension-tools.mdx`
**Changes:**
- [ ] No content changes needed
- [ ] Move to "Testing & Agents" → "Architecture" section

---

## Content Creation Plan

### Phase 1: Core Restructuring (No New Content)
1. Update `docs.json` navigation
2. Update `introduction.mdx` messaging
3. Update `quickstart.mdx` prerequisites & testing section
4. Update `connecting-agents.mdx` ordering

### Phase 2: New Content
1. Create `testing-agents-overview.mdx`
2. Create `in-page-agent.mdx` (when implementation is ready)

### Phase 3: Refinement
1. Review and update `development.mdx`, `best-practices.mdx`, `advanced.mdx`
2. Add intro framing to `extension/index.mdx`
3. Final review of all extension mentions for consistency

---

## Interactive Features Plan

### Docs Site Enhancements
The in-page agent will enable:

1. **Live tool testing on any docs page**
   - Users can test example tools without leaving the page
   - No extension installation required

2. **Interactive quickstart**
   - Already exists but powered by extension
   - Update to use in-page agent

3. **Live Examples tab**
   - Already exists (`live-tool-examples.mdx`, etc.)
   - Will work seamlessly with in-page agent

### Implementation Notes
- The docs site already loads `@mcp-b/global` via script in `docs.json`
- In-page agent will need to be added as additional script or component
- Consider: Agent UI position (floating button? sidebar? modal?)

---

## Messaging Guidelines

### Before (Extension-Centric)
> "Install the MCP-B Extension to test your WebMCP tools and connect them to AI assistants like Claude."

### After (Agent-Agnostic)
> "Test your WebMCP tools instantly with the in-page agent, or connect to AI assistants using the MCP-B Extension, Chrome DevTools MCP, or your preferred MCP client."

### Key Phrases to Use
- "Test with any agent"
- "No installation required"
- "Multiple testing options"
- "The extension is one option for..."

### Key Phrases to Avoid
- "Install the extension to get started"
- "The extension is required"
- "Open in Chrome with MCP-B extension" (as a prerequisite)

---

## Success Metrics

After restructuring, users should:

1. **Understand** that WebMCP is about building AI-accessible tools
2. **Know** they can test tools without installing anything (via in-page agent)
3. **See** the extension as one of several options
4. **Choose** the right testing/connection method for their use case
5. **Not feel** that the extension is required or primary

---

## Timeline Suggestion

| Phase | Tasks | Dependencies |
|-------|-------|--------------|
| **Phase 1** | Core restructuring (docs.json, intro, quickstart, connecting-agents) | None |
| **Phase 2** | New pages (testing-agents-overview, in-page-agent) | In-page agent implementation |
| **Phase 3** | Refinement & review | Phase 1 & 2 complete |

**Note:** Phase 1 can begin immediately. Phase 2 depends on in-page agent being ready to document.

---

## Open Questions

1. **In-page agent name**: What will it be called? (e.g., "WebMCP Agent", "Embedded Agent", "Page Agent")

2. **In-page agent UI**: Where will it appear on the docs? (floating button, sidebar, etc.)

3. **Navbar CTA**: What should the new primary CTA be?
   - Option A: "Try Live Demo" (links to webmcp.sh or live examples)
   - Option B: "Get Started" (links to quickstart)
   - Option C: Remove primary CTA entirely

4. **Extension tab name**: Should "Extension" tab become:
   - Option A: "Testing & Agents"
   - Option B: "Using Tools"
   - Option C: Fold into main Documentation tab as a section

5. **Userscripts**: Are userscripts still a priority? They're heavily documented but extension-specific. Should they remain prominent or be further demoted?

---

## Appendix: All Files to Review

### Must Change
- `/home/user/docs/docs.json`
- `/home/user/docs/introduction.mdx`
- `/home/user/docs/quickstart.mdx`
- `/home/user/docs/connecting-agents.mdx`

### Should Review
- `/home/user/docs/development.mdx`
- `/home/user/docs/best-practices.mdx`
- `/home/user/docs/advanced.mdx`
- `/home/user/docs/extension/index.mdx`

### New Files Needed
- `/home/user/docs/testing-agents-overview.mdx` (or similar)
- `/home/user/docs/in-page-agent.mdx` (or similar)

### No Changes Needed
- `/home/user/docs/extension/agents.mdx`
- `/home/user/docs/extension/managing-userscripts.mdx`
- `/home/user/docs/native-host-setup.mdx`
- `/home/user/docs/concepts/extension.mdx`
- `/home/user/docs/packages/extension-tools.mdx`
