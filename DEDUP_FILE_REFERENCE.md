# Deduplication: Complete File Reference & Line Numbers

## Critical Duplications

### 1. Tool Design Guidance (2,485 Total Lines)

#### A. Naming Conventions
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 16-51 (36 lines)
  - Section: "Tool Design Principles" → "Use Descriptive Names"
  - Contains: `domain_verb_noun` pattern, good/bad examples
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 9-47 (39 lines)
  - Section: "Naming Conventions"
  - Contains: IDENTICAL pattern and examples
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 297-311 (15 lines)
  - Section: "Use clear naming conventions"
  - Contains: Same pattern, repeated examples

**Action**: Keep best-practices (most canonical); reference from others

---

#### B. Detailed Descriptions / Clarity
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 53-93 (41 lines)
  - Section: "Provide Detailed Descriptions"
  - Uses "products_search" example extensively
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 49-77 (29 lines)
  - Section: "Writing Clear Descriptions"
  - Uses SAME "products_search" example
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 313-338 (26 lines)
  - Section: "Write descriptive tool descriptions"
  - Same content, different emphasis

**Overlap**: ~80% identical guidance  
**Action**: Consolidate into single source; reference from others

---

#### C. Input Validation
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 147-215 (69 lines)
  - Uses Zod schema examples
  - Covers business logic validation
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 80-177 (98 lines)
  - "Input Design" section
  - Uses JSON Schema AND Zod examples
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 182-233 (52 lines)
  - "Validate inputs with Zod"
  - Same patterns, Zod focused

**Overlap**: ~70% similar patterns  
**Action**: Keep best-practices as primary; tool-design for pattern theory

---

#### D. Error Handling
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 365-435 (71 lines)
  - Section: "Error Handling"
  - Covers graceful errors, business logic errors
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 360-400 (41 lines)
  - Section: "Error Handling"
  - Almost IDENTICAL examples and patterns
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 94-180 (87 lines)
  - "Handle errors gracefully"
  - Same patterns shown

**Overlap**: ~85% identical  
**Action**: Consolidate; keep one canonical version

---

#### E. Response Formatting
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 249-330 (82 lines)
  - Section: "Response Format"
  - "Use Markdown Instead of JSON" recommendation
  - Shows markdown vs JSON comparison
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 179-216 (38 lines)
  - Section: "Output Design"
  - "Return Structured Data" (implies JSON)
  - **CONFLICTS with File 1**

**Critical Issue**: CONFLICTING GUIDANCE!
- best-practices says: Markdown better for AI
- tool-design says: Structured JSON better

**Action**: RESOLVE CONFLICT - which approach is actually recommended? Update both files to agree

---

#### F. Tool Annotations
- **File 1**: `/home/user/docs/best-practices.mdx` Referenced within multiple sections
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 274-300 (27 lines)
  - Dedicated section on annotations
  - Explains: readOnlyHint, idempotentHint, destructiveHint
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 340-368 (29 lines)
  - "Set appropriate tool annotations"
  - SAME annotations, same examples

**Action**: Keep tool-design as reference; reference from others

---

#### G. Testing
- **File 1**: `/home/user/docs/best-practices.mdx` Lines 780-873 (94 lines)
  - Section: "Testing & Quality Assurance"
  - Unit testing, E2E testing patterns
  
- **File 2**: `/home/user/docs/concepts/tool-design.mdx` Lines 402-423 (22 lines)
  - Section: "Testing Tools"
  - Same patterns, more concise
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 459-520 (62 lines)
  - Section: "Testing"
  - Same test structure examples

**Action**: best-practices is most comprehensive; reference from others

---

### 2. Setup & Installation (250+ Lines Duplicate)

#### A. Introduction Quick Example (React/Vanilla/Script Tag)
- **File**: `/home/user/docs/introduction.mdx` Lines 164-235 (72 lines)
  - Section: "Quick Example"
  - Three tabs: React, Vanilla JS, Script Tag
  - React example: useWebMCP hook with Zod schema
  - Vanilla JS: navigator.modelContext.registerTool()
  - Script Tag: CDN-based example

**Content Summary**:
```tsx
// React Tab (Lines 168-188)
import '@mcp-b/global';
import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function ProductPage({ productId }) {
  useWebMCP({
    name: 'add_to_cart',
    description: 'Add this product to shopping cart',
    inputSchema: { quantity: z.number().min(1).default(1) },
    handler: async ({ quantity }) => { ... }
  });
}
```

---

#### B. Quickstart Installation & Examples
- **File**: `/home/user/docs/quickstart.mdx` Lines 18-92 (75 lines)
  - Section: "Installation" + code examples
  - IDENTICAL React/Vanilla/Script Tag tabs
  - Same useWebMCP example code

**Critical Finding**: Lines 26-91 are nearly VERBATIM copy of introduction.mdx Lines 164-235

---

#### C. Development Quick Setup  
- **File**: `/home/user/docs/development.mdx` Lines 11-33 + 53-124 (94 lines total)
  - Section: "Quick Setup" + "Development Workflow"
  - Same React example with useWebMCP
  - Same Vanilla JS examples

**Critical Finding**: Contains SAME setup code as quickstart.mdx Lines 22-24

---

**Action**: 
- Keep quickstart.mdx as primary (best organization for beginners)
- Remove code examples from introduction.mdx (add link to quickstart instead)
- development.mdx references quickstart for setup
- Estimated removal: 100-150 lines

---

### 3. Security Guidance (500+ Lines Scattered)

#### A. Authentication & Authorization  
- **File 1**: `/home/user/docs/security.mdx` Lines 9-75
  - Section: "Protecting User Sessions"
  - Shows auth flow diagram, best practices
  
- **File 2**: `/home/user/docs/concepts/security.mdx` Lines 9-76
  - Section: "Authentication & Authorization"
  - Same flow diagram, similar patterns
  
- **File 3**: `/home/user/docs/best-practices.mdx` Lines 472-499
  - Section: "Validate User Authentication"
  - Abbreviated version of same pattern

**Overlap**: ~70%  
**Action**: security.mdx is primary; concepts/security is architectural; remove from best-practices

---

#### B. Input Validation & Sanitization
- **File 1**: `/home/user/docs/security.mdx` Lines 798-910
  - Section: "Standard Web Security"
  - Shows DOMPurify example, escapeHtml pattern
  
- **File 2**: `/home/user/docs/best-practices.mdx` Lines 501-524
  - Section: "Sanitize Inputs"
  - IDENTICAL DOMPurify example code
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 401-420
  - "Sanitize inputs" section
  - Same pattern, abbreviated

**Overlap**: ~90% identical  
**Action**: Remove from best-practices; reference security.mdx

---

#### C. Rate Limiting
- **File 1**: `/home/user/docs/security.mdx` Lines 526-559
  - Section: "Rate Limit Tool Calls"
  - Shows limiter implementation
  
- **File 2**: `/home/user/docs/best-practices.mdx` Lines 526-559
  - **EXACT SAME LINES** - copy/paste duplication
  - Section: "Rate Limit Tool Calls"
  
- **File 3**: `/home/user/docs/ai-frameworks/best-practices.mdx` Lines 422-456
  - Shows rate limiter pattern (different implementation)

**Overlap**: 100% for Files 1 & 2  
**Action**: REMOVE from best-practices; keep security.mdx as primary

---

#### D. Agent-Specific Threats (Prompt Injection)
- **File 1**: `/home/user/docs/security.mdx` Lines 52-350
  - Comprehensive section on:
    - Prompt injection risks (lines 54-170)
    - Sensitive data exposure (lines 70-180)
    - Other prompt injection mitigations (lines 180-242)
    - Tool misrepresentation (lines 246-349)
    - Privacy/fingerprinting (lines 351-459)
  
- **File 2**: `/home/user/docs/best-practices.mdx` Lines 470-593
  - "Security Best Practices"
  - Less comprehensive coverage of same topics

**Critical Issue**: security.mdx has much more detailed threat model that some developers may miss

**Action**: Ensure best-practices cross-links to security.mdx for detailed guidance

---

### 4. AI Framework Integration (6 Files, 300-500 Lines)

#### A. Architecture Explanation
- **File 1**: `/home/user/docs/ai-frameworks/index.mdx` Lines 11-49
  - Section: "How Frontend Tool Calling Works"
  - Steps 1-5 + sequence diagram
  
- **File 2**: `/home/user/docs/connecting-agents.mdx` Lines 79-88
  - Similar architecture explanation
  - References ai-frameworks/index (good cross-link)
  
- **File 3**: `/home/user/docs/ai-frameworks/assistant-ui.mdx` (partial)
  - Repeats architecture before framework content

**Action**: index.mdx is primary; strengthen it as hub; remove repetition from others

---

#### B. Setup Instructions
- **File 1**: `/home/user/docs/ai-frameworks/setup.mdx` (dedicated setup page)
  - Package installation
  - Client configuration
  
- **File 2**: `/home/user/docs/ai-frameworks/assistant-ui.mdx` Lines 1-60
  - Includes setup steps (should reference setup.mdx)
  
- **File 3**: `/home/user/docs/ai-frameworks/ag-ui.mdx` Lines 1-60
  - Also includes setup steps

**Action**: Move all setup to dedicated setup.mdx; framework files reference it

---

#### C. MCP Client Integration
- **File 1**: `/home/user/docs/ai-frameworks/setup.mdx`
  - Shows provider setup with `McpClientProvider`
  
- **File 2**: `/home/user/docs/ai-frameworks/assistant-ui.mdx` Lines 50-150
  - Nearly identical provider setup code
  
- **File 3**: `/home/user/docs/ai-frameworks/ag-ui.mdx` Lines 100-200
  - Same pattern shown again

**Overlap**: ~80% code duplication  
**Action**: Consolidate in setup.mdx; reference from framework files

---

### 5. Tool Registration (Scattered, 150-200 Lines)

#### A. registerTool() vs useWebMCP()
- **File 1**: `/home/user/docs/concepts/tool-registration.mdx` (dedicated file)
  - Section: "The Simple Way: registerTool()"
  - Explains lifecycle, best practices
  
- **File 2**: `/home/user/docs/packages/react-webmcp.mdx` Lines 43-120
  - "useWebMCP" detailed API reference
  - Includes type definitions, advanced usage
  
- **File 3**: `/home/user/docs/quickstart.mdx` Lines 55-73
  - Brief tool registration example
  
- **File 4**: `/home/user/docs/best-practices.mdx` (scattered references)
  - Mentions patterns but doesn't detail

**Note**: These are somewhat complementary rather than true duplicates, but could be consolidated better

---

### 6. Conditional Tool Registration (100 Lines)

#### A. Dynamic Tools Based on State
- **File 1**: `/home/user/docs/advanced.mdx` Lines 7-84
  - Section: "Dynamic Tool Registration"
  - Shows user role-based registration
  - Shows page-specific tools
  - Shows component lifecycle scoping
  
- **File 2**: `/home/user/docs/security.mdx` Lines 559-616
  - Section: "Conditional Registration"
  - Shows admin-only tools example
  
- **File 3**: `/home/user/docs/best-practices.mdx` Lines 875-914
  - Section: "Tool Organization" → "Reference Related Tools"

**Overlap**: ~40% - similar patterns shown in different contexts

**Action**: advanced.mdx is best reference; mention in security.mdx

---

## Minor/Organizational Issues

### Navigation Issues (Not Direct Duplication)

1. **Extension Documentation** (`/home/user/docs/extension/`)
   - index.mdx (512 lines) + agents.mdx (416 lines) + managing-userscripts.mdx (566 lines)
   - Not duplicate, but fragmented - users must read multiple pages
   
2. **Tool Design Scattered**
   - concepts/tool-design.mdx talks design patterns
   - best-practices.mdx talks implementation
   - Both should be clearly linked in hierarchy

3. **Security Model vs Best Practices**
   - concepts/security.mdx = architectural model
   - security.mdx = implementation best practices
   - Should be clearly related

---

## Summary by Severity

### CRITICAL (Immediate Resolution Needed)
1. ✅ **Resolve JSON vs Markdown conflict** (best-practices vs tool-design)
2. ✅ **Consolidate tool naming guidance** (3 identical sections)
3. ✅ **Remove rate limiting duplication** (100% copy/paste in files 1 & 2)

### HIGH (Week 1)
4. **Merge tool design patterns** (tool-design + best-practices)
5. **Deduplicate setup instructions** (introduction/quickstart/development)
6. **Consolidate AI framework setup** (6 files with overlapping content)

### MEDIUM (Week 1-2)
7. Improve security navigation (add TOC)
8. Restructure best-practices.mdx (too large)
9. Fix tool registration cross-links

### LOW (Nice to Have)
10. Improve extension documentation navigation
11. Use code snippet patterns for duplicates
12. Create "decision tree" for users

