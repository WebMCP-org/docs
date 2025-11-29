# WebMCP Documentation Reorganization: Action Checklist

## QUICK SUMMARY FOR DECISION-MAKERS

**Main Finding**: The Documentation tab contains 100% conceptual content in `why-webmcp.mdx` that should be in the Concepts tab. Additionally, three major architectural concepts are embedded in procedural pages and should be extracted to dedicated Concepts pages.

**Time to Implement**: ~8-12 hours total

---

## PHASE 1: CRITICAL FIXES (1-2 hours)

### ☐ Move why-webmcp.mdx to Concepts Tab
- **What**: Move entire file to `concepts/alternatives.mdx`
- **Why**: 100% conceptual content (design philosophy, alternatives comparison)
- **Files to change**: docs.json, introduction.mdx
- **Time**: 1 hour
- **Impact**: Fixes major tab confusion, improves navigation

### ☐ Update docs.json Navigation
```json
// Remove from Documentation tab -> Guides:
"why-webmcp"

// Add to Concepts tab -> NEW GROUP "Design & Philosophy":
{
  "group": "Design & Philosophy",
  "pages": [
    "concepts/overview",
    "concepts/alternatives"
  ]
}
```

### ☐ Update introduction.mdx
- Remove link to `/why-webmcp`
- Add link to `/concepts/alternatives` in relevant sections
- Lines affected: 31, 293-295

---

## PHASE 2: DOCUMENTATION IMPROVEMENTS (3-4 hours)

### ☐ Update Documentation Pages with Concept Links

#### connecting-agents.mdx
- Add link to concepts/architecture near line 35 (Browser Agents section)
- Add link to concepts/extension near line 143
- Condense "What are local MCP clients?" (lines 198-206) to 1-2 sentences + link

#### best-practices.mdx  
- Add "See Also" section at end
- Link to concepts/tool-design.mdx
- Link to concepts/performance.mdx
- Link to concepts/security.mdx

#### advanced.mdx
- Add callout box before "Multi-Tab Tool Collection" (line 382) saying:
  "For architectural overview, see [Concepts: Tool Routing](/concepts/tool-routing)"
- Add callout before "Cross-Site Tool Composition" (line 652) saying:
  "For detailed architecture, see [Concepts: Tool Composition](/concepts/tool-composition)"

#### security.mdx
- Add callout after "Why WebMCP Security is Different" (line 30) saying:
  "For deep dive into threat models, see [Concepts: Agent Threat Model](/concepts/agent-threat-model)"

---

## PHASE 3: CREATE MISSING CONCEPTS PAGES (5-6 hours)

### ☐ Create concepts/agent-threat-model.mdx (NEW)
- **Source material**: documentation/security.mdx lines 11-180
- **Size**: 150-200 lines
- **Content sections**:
  - Prompt Injection: The "Lethal Trifecta"
  - Tool Misrepresentation Risks
  - Privacy: User Fingerprinting via Over-Parameterization
- **Time to create**: 2-3 hours
- **Frontmatter**:
  ```yaml
  title: 'Agent-Specific Security Threats'
  description: 'Unique security challenges in multi-agent environments. Threat modeling, prompt injection risks, and WebMCP-specific defenses.'
  icon: 'triangle-exclamation'
  ```

### ☐ Create concepts/tool-routing.mdx (NEW)
- **Source material**: documentation/advanced.mdx lines 382-436
- **Size**: 100-150 lines
- **Content sections**:
  - Multi-Tab Tool Collection Overview
  - How Tool Collection Works (with mermaid diagram)
  - Tool Routing Mechanism
  - Design Implications
- **Time to create**: 1-2 hours
- **Frontmatter**:
  ```yaml
  title: 'Tool Routing & Multi-Tab Collection'
  description: 'How MCP-B extension collects and routes tool calls across multiple browser tabs simultaneously.'
  icon: 'network-wired'
  ```

### ☐ Create concepts/tool-composition.mdx (NEW)
- **Source material**: documentation/advanced.mdx lines 652-710
- **Size**: 100-150 lines
- **Content sections**:
  - Cross-Site Tool Composition Overview
  - How Cross-Site Calls Work (with sequence diagram)
  - Security Isolation Between Sites
  - Common Composition Patterns
- **Time to create**: 1-2 hours
- **Frontmatter**:
  ```yaml
  title: 'Cross-Site Tool Composition'
  description: 'Composing tools from multiple websites into complex workflows. Architecture, patterns, and security considerations.'
  icon: 'link'
  ```

### ☐ Update docs.json to Add New Concepts Pages
```json
{
  "group": "Architecture & Patterns",
  "pages": [
    "concepts/architecture",
    "concepts/tool-routing",
    "concepts/tool-composition",
    "concepts/mcp-ui-integration"
  ]
}
```

---

## PHASE 4: OPTIONAL POLISH (2-3 hours)

### ☐ Consider Renaming Tabs for Clarity
- **Option 1**: "Documentation" → "How-To Guides"
- **Option 2**: "Concepts" → "Concepts & Philosophy"
- Pros: More descriptive
- Cons: Breaking change to URL structure

### ☐ Add Tab Purpose Descriptions
Add to top of each tab in navigation (mintlify supports this):
```
Documentation: Step-by-step guides and procedural instructions for building and deploying WebMCP tools
Concepts: Theoretical foundations, architectural patterns, and design decisions behind WebMCP
```

### ☐ Add Cross-References at Bottom of Pages
- Add "Learn more: [Read the theory behind this guide](/concepts/page-name)" callouts
- Add "Get started: [Implement this pattern](/guide-name)" callouts in Concepts pages

### ☐ Consider Splitting best-practices.mdx
- Current: 1481 lines (very long)
- Option: Split into:
  - best-practices-tool-design.mdx
  - best-practices-security.mdx
  - best-practices-performance.mdx
- Note: Only if page length becomes unwieldy (recommend <1200 lines)

---

## VERIFICATION CHECKLIST

After completing above, verify:

- ☐ No procedural/action-oriented content in Concepts tab
- ☐ No 100% conceptual content in Documentation tab
- ☐ All architectural patterns (tool routing, composition, threat models) have dedicated Concepts pages
- ☐ Cross-references exist between related Documentation and Concepts pages
- ☐ docs.json navigation structure updated and consistent
- ☐ All internal links still work (test after file moves)
- ☐ Each Concepts page links to relevant Documentation page (if exists)
- ☐ Each Documentation page links to related Concepts pages (if exists)

---

## LINE-BY-LINE MIGRATION SPECIFICS

### why-webmcp.mdx → concepts/alternatives.mdx

**Files to modify**:
1. `/home/user/docs/why-webmcp.mdx` → `/home/user/docs/concepts/alternatives.mdx`
2. `/home/user/docs/introduction.mdx` (update links)
3. `/home/user/docs/docs.json` (update navigation)

**Frontmatter change**:
```yaml
# BEFORE
---
title: 'Why WebMCP?'
description: 'Understand why WebMCP provides a better approach...'
icon: 'lightbulb'
---

# AFTER
---
title: 'WebMCP vs Alternatives'
description: 'Comparison of WebMCP with browser automation, remote MCP, computer use, and other approaches. When to use WebMCP vs alternatives.'
icon: 'columns-3'
---
```

---

## ESTIMATED EFFORT BREAKDOWN

| Phase | Task | Hours | Priority |
|-------|------|-------|----------|
| 1 | Move why-webmcp.mdx | 1 | CRITICAL |
| 1 | Update docs.json | 0.5 | CRITICAL |
| 2 | Add concept links to Doc pages | 3 | HIGH |
| 3 | Create agent-threat-model.mdx | 2.5 | HIGH |
| 3 | Create tool-routing.mdx | 1.5 | HIGH |
| 3 | Create tool-composition.mdx | 1.5 | HIGH |
| 3 | Update docs.json for new pages | 0.5 | HIGH |
| 4 | Polish/renaming/cross-refs | 2 | MEDIUM |
| 4 | Test all links | 1 | MEDIUM |
| **TOTAL** | | **13.5 hours** | |

**Recommended approach**: 
- Do Phases 1-3 (9 hours) in one work session
- Do Phase 4 (4.5 hours) in follow-up session after community feedback

---

## SUCCESS CRITERIA (Final Review)

Page through documentation and verify users experience:

1. **Getting started?** → Introduction → Quickstart → Examples (all procedural)
2. **Want to build?** → Guides section (all procedural)
3. **Want to understand WHY?** → Concepts section (all conceptual)
4. **Need architectural details?** → New concepts pages cover tool routing, composition, threats
5. **Cross-references exist?** → Documentation → Concepts and vice versa

✅ If all above check out, reorganization is complete!

