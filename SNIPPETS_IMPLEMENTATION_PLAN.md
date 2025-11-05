# WebMCP Documentation: Reusable Snippets Implementation Plan

> Strategy for extracting common code patterns into reusable snippets to maintain consistency and reduce duplication

**Status:** Draft
**Created:** 2025-11-05
**Owner:** Documentation Team

---

## Executive Summary

Analysis of the WebMCP documentation reveals **15+ high-value code patterns** that appear repeatedly across multiple pages. These patterns include:
- Tool registration (`registerTool()`) - 100+ occurrences
- React hooks (`useWebMCP()`) - 117+ occurrences
- Response formats - 52+ occurrences
- Client initialization - 18+ occurrences

Extracting these into reusable snippets will:
- ✅ **Reduce duplication** from ~400+ repeated code blocks to ~50 canonical snippets
- ✅ **Improve consistency** with single source of truth
- ✅ **Simplify maintenance** - update once, reflect everywhere
- ✅ **Reduce errors** from copy-paste inconsistencies
- ✅ **Speed up authoring** with ready-to-use components

---

## Current State Analysis

### Existing Snippets
Currently in `/snippets/`:
- `webmcp-tool-storage.jsx`
- `webmcp-tool-calculator.jsx`
- `webmcp-tool-dom-query.jsx`
- `add-webmcp-polyfill.md`
- `webmcp-polyfill-setup.jsx`
- `webmcp-tool-color-converter.jsx`

**Issues:**
- ❌ Limited to full tool examples only
- ❌ No foundational building blocks (imports, schemas, responses)
- ❌ No variation support (basic/advanced versions)
- ❌ No organization by category

### High-Duplication Patterns

| Pattern | Occurrences | Files Affected | Priority |
|---------|-------------|----------------|----------|
| `registerTool()` basic | 100+ | 19 files | CRITICAL |
| `useWebMCP()` hook | 117+ | 19 files | CRITICAL |
| Response format | 52+ | 11 files | CRITICAL |
| Error handling | 23+ | 8 files | CRITICAL |
| Client setup | 18+ | 10 files | CRITICAL |
| Zod schemas | 20+ | 8 files | HIGH |
| JSON schemas | 15+ | 7 files | HIGH |
| Fetch patterns | 5+ | 3 files | MEDIUM |
| Lifecycle patterns | 7+ | 4 files | MEDIUM |

---

## Proposed Snippet Organization

### Directory Structure

```
snippets/
├── core/                          # Essential patterns
│   ├── register-tool-basic.mdx
│   ├── register-tool-with-schema.mdx
│   ├── use-webmcp-basic.mdx
│   ├── use-webmcp-with-state.mdx
│   ├── response-success.mdx
│   ├── response-error.mdx
│   └── response-markdown.mdx
│
├── imports/                       # Common import statements
│   ├── react-imports.mdx
│   ├── client-imports.mdx
│   ├── extension-imports.mdx
│   └── all-imports.mdx
│
├── validation/                    # Schema patterns
│   ├── zod-basic.mdx
│   ├── zod-complex.mdx
│   ├── json-schema-basic.mdx
│   └── json-schema-complex.mdx
│
├── clients/                       # Transport/client setup
│   ├── tab-client-setup.mdx
│   ├── tab-server-setup.mdx
│   ├── iframe-parent-setup.mdx
│   ├── iframe-child-setup.mdx
│   ├── extension-client-setup.mdx
│   └── mcp-client-provider.mdx
│
├── patterns/                      # Advanced patterns
│   ├── error-handling.mdx
│   ├── fetch-api.mdx
│   ├── optimistic-update.mdx
│   ├── lifecycle-cleanup.mdx
│   └── tool-organization.mdx
│
├── templates/                     # Complete examples
│   ├── basic-tool-template.mdx
│   ├── react-component-template.mdx
│   └── extension-setup-template.mdx
│
└── examples/                      # Full working examples
    ├── webmcp-tool-storage.jsx    (existing)
    ├── webmcp-tool-calculator.jsx (existing)
    └── ...
```

---

## Implementation Phases

### Phase 1: Critical Foundation (Week 1)
**Goal:** Extract most-used patterns to immediately reduce duplication

**Snippets to Create:**

#### 1. Core Tool Registration
```mdx
snippets/core/register-tool-basic.mdx
```
- Basic `registerTool()` pattern
- Variations: minimal, with schema, with cleanup

#### 2. React Hook Patterns
```mdx
snippets/core/use-webmcp-basic.mdx
snippets/core/use-webmcp-with-state.mdx
```
- Basic `useWebMCP()` usage
- With execution state tracking

#### 3. Response Formats
```mdx
snippets/core/response-success.mdx
snippets/core/response-error.mdx
snippets/core/response-markdown.mdx
```
- Standard text response
- Error response with `isError`
- Markdown formatted response

#### 4. Import Statements
```mdx
snippets/imports/react-imports.mdx
snippets/imports/client-imports.mdx
```
- React setup imports
- Client/transport imports

**Files to Update:**
- `quickstart.mdx` - Replace 8+ code blocks
- `best-practices.mdx` - Replace 15+ code blocks
- `packages/react-webmcp.mdx` - Replace 10+ code blocks

**Success Metrics:**
- Reduce code duplication by 30%
- Update 3-5 high-traffic pages
- Create 10-12 foundational snippets

---

### Phase 2: Validation & Client Setup (Week 2)
**Goal:** Standardize schema and client initialization patterns

**Snippets to Create:**

#### 5. Schema Validation
```mdx
snippets/validation/zod-basic.mdx
snippets/validation/zod-complex.mdx
snippets/validation/json-schema-basic.mdx
```
- Basic Zod schema with `.describe()`
- Complex Zod with validation
- JSON Schema equivalents

#### 6. Client Initialization
```mdx
snippets/clients/tab-client-setup.mdx
snippets/clients/mcp-client-provider.mdx
```
- TabClientTransport setup
- React McpClientProvider pattern

**Files to Update:**
- `concepts/schemas.mdx` - Replace schema examples
- `packages/transports.mdx` - Replace client setup
- `packages/react-webmcp.mdx` - Replace provider examples

**Success Metrics:**
- Reduce schema duplication by 40%
- Standardize all client setup code
- Create 8-10 validation/client snippets

---

### Phase 3: Advanced Patterns (Week 3)
**Goal:** Extract specialized patterns and best practices

**Snippets to Create:**

#### 7. Error Handling
```mdx
snippets/patterns/error-handling.mdx
```
- Error formatter function
- Try-catch patterns
- Validation error handling

#### 8. Lifecycle Management
```mdx
snippets/patterns/lifecycle-cleanup.mdx
```
- useEffect cleanup
- beforeunload cleanup
- Dynamic tool patterns

#### 9. Optimistic Updates
```mdx
snippets/patterns/optimistic-update.mdx
```
- Immediate UI update
- Background sync
- Error rollback

**Files to Update:**
- `best-practices.mdx` - Replace advanced patterns
- `concepts/tool-registration.mdx` - Replace lifecycle examples
- `security.mdx` - Replace error handling

**Success Metrics:**
- Cover 90% of common patterns
- Create 6-8 advanced snippets
- Update all concept pages

---

### Phase 4: Templates & Migration (Week 4)
**Goal:** Create starter templates and complete migration

**Snippets to Create:**

#### 10. Complete Templates
```mdx
snippets/templates/basic-tool-template.mdx
snippets/templates/react-component-template.mdx
```
- Ready-to-use tool implementations
- Copy-paste starting points

**Files to Audit & Update:**
- All remaining MDX files
- Migration checklist completion
- Documentation updates

**Success Metrics:**
- 100% of high-value patterns extracted
- All pages using snippets consistently
- Documentation reflects new structure

---

## Snippet Design Guidelines

### 1. **Exportable Components**
Use MDX exports for maximum flexibility:

```mdx
// snippets/core/register-tool-basic.mdx
export const RegisterToolBasic = ({ toolName = "example_tool", description = "Tool description" }) => {
  return `navigator.modelContext.registerTool({
  name: "${toolName}",
  description: "${description}",
  inputSchema: { type: "object", properties: {} },
  async execute(args) {
    // Implementation here
    return { content: [{ type: "text", text: "Result" }] };
  }
});`;
};
```

**Usage:**
```mdx
import { RegisterToolBasic } from '/snippets/core/register-tool-basic.mdx';

<RegisterToolBasic toolName="my_tool" description="My tool description" />
```

### 2. **Variable Support**
Allow customization via props:

```mdx
// snippets/validation/zod-basic.mdx
export const ZodBasicSchema = ({ fieldName = "query", fieldType = "string" }) => {
  return `inputSchema: {
  ${fieldName}: z.${fieldType}().describe('Field description')
}`;
};
```

### 3. **Variation Pattern**
Provide basic → advanced progression:

```mdx
// snippets/core/use-webmcp-basic.mdx - Simple version
// snippets/core/use-webmcp-with-state.mdx - With state tracking
// snippets/core/use-webmcp-advanced.mdx - Full featured
```

### 4. **Documentation within Snippets**
Include usage notes in snippet files:

```mdx
// snippets/core/register-tool-basic.mdx

{/*
# Basic Tool Registration

Use this pattern for simple tools with no input parameters.

## When to use:
- Tools that don't need user input
- Read-only context tools
- Simple getters

## Example:
<RegisterToolBasic toolName="get_page_title" />
*/}

export const RegisterToolBasic = ({ toolName, description }) => { ... };
```

---

## Migration Strategy

### Step-by-Step Approach

#### 1. **Create Snippet**
- Extract pattern to snippet file
- Add variable support
- Test in isolation
- Document usage

#### 2. **Update One File**
- Replace code block with snippet import
- Verify rendering locally (`mintlify dev`)
- Check code block formatting (twoslash, icons, etc.)
- Commit change

#### 3. **Propagate Pattern**
- Update similar code blocks in other files
- Use search to find all instances
- Update in batches by pattern type

#### 4. **Verify & Test**
- Run local preview
- Check all pages render correctly
- Verify code examples display properly
- Test snippet variables

### Migration Checklist Template

```markdown
## Pattern: [Pattern Name]

**Snippet File:** `snippets/.../pattern-name.mdx`

**Files to Update:**
- [ ] quickstart.mdx (3 occurrences)
- [ ] best-practices.mdx (8 occurrences)
- [ ] packages/react-webmcp.mdx (5 occurrences)
- [ ] concepts/schemas.mdx (2 occurrences)

**Testing:**
- [ ] Local preview renders correctly
- [ ] Code formatting preserved (twoslash, icons, lines)
- [ ] Variables work as expected
- [ ] No broken imports

**Commit:** [Commit SHA]
```

---

## Maintenance Guidelines

### 1. **When to Create a Snippet**

Create a snippet if:
- ✅ Pattern appears **3+ times** across different files
- ✅ Pattern is **foundational** (imports, basic setup)
- ✅ Pattern needs to **stay consistent** (security, best practices)
- ✅ Pattern is **likely to change** (API updates, deprecations)

**Don't create a snippet if:**
- ❌ Pattern appears only 1-2 times
- ❌ Pattern is page-specific context
- ❌ Pattern benefits from inline explanation

### 2. **Updating Snippets**

When updating a snippet:
1. **Review all usages** - Check which pages import it
2. **Test changes** - Preview all affected pages
3. **Document changes** - Update snippet comments
4. **Communicate impact** - Note in changelog/commit

### 3. **Naming Conventions**

**Files:**
- Use kebab-case: `register-tool-basic.mdx`
- Be descriptive: `use-webmcp-with-state.mdx` not `hook2.mdx`
- Include variation: `-basic`, `-advanced`, `-with-state`

**Exports:**
- Use PascalCase: `RegisterToolBasic`
- Match filename: `register-tool-basic.mdx` → `RegisterToolBasic`
- Be explicit: `ZodBasicSchema` not just `Schema`

### 4. **Version Control**

Track snippet changes in CHANGELOG.md:

```markdown
## Snippets - 2025-11-10

### Added
- `snippets/core/register-tool-basic.mdx` - Basic tool registration pattern

### Changed
- `snippets/validation/zod-basic.mdx` - Added optional field support

### Deprecated
- `snippets/old-pattern.mdx` - Replaced by `new-pattern.mdx`
```

---

## Benefits Analysis

### Before Snippets

**Current state:**
- 100+ duplicated `registerTool()` blocks
- Manual updates required across 19+ files
- Inconsistent patterns (some with cleanup, some without)
- Copy-paste errors common
- ~400 total repeated code blocks

**Pain points:**
- 🔴 API changes require updating 50+ locations
- 🔴 Inconsistencies between examples
- 🔴 New contributors unsure which pattern to use
- 🔴 Outdated examples slip through reviews

### After Snippets

**New state:**
- ~50 canonical snippet sources
- Import once, use everywhere
- Consistent patterns site-wide
- Single source of truth

**Improvements:**
- 🟢 API changes update in 1 location
- 🟢 Guaranteed consistency
- 🟢 Clear "official" patterns
- 🟢 Easier to maintain and review

### Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code blocks | ~400 | ~50 snippets | -87% duplication |
| Update locations (API change) | 50+ | 1 | -98% effort |
| Consistency errors | ~15 found | 0 expected | -100% |
| New page authoring time | 30 min | 10 min | -66% time |

---

## Risk Mitigation

### Potential Risks

1. **Over-abstraction**
   - Risk: Snippets become too generic, lose context
   - Mitigation: Keep page-specific context inline, snippet only reusable parts

2. **Breaking changes**
   - Risk: Snippet update breaks multiple pages
   - Mitigation: Preview all pages before committing, use semantic versioning

3. **Discovery**
   - Risk: Contributors don't know snippets exist
   - Mitigation: Document in CLAUDE.md, create snippet catalog

4. **Flexibility**
   - Risk: Snippets too rigid for variations
   - Mitigation: Use props/variables, create variation snippets

### Rollback Plan

If snippets cause issues:
1. Git revert to previous commit
2. Keep snippet files, but don't import them
3. Gradually adopt with more testing
4. Revert individual pages, not all-or-nothing

---

## Success Criteria

### Phase 1 Success
- ✅ 10-12 foundational snippets created
- ✅ 3-5 high-traffic pages using snippets
- ✅ 30% reduction in code duplication
- ✅ Zero rendering errors

### Phase 2 Success
- ✅ 20+ snippets covering validation & clients
- ✅ 50% reduction in duplication
- ✅ All schema examples standardized
- ✅ Clear organization structure

### Phase 3 Success
- ✅ 30+ snippets covering advanced patterns
- ✅ 75% reduction in duplication
- ✅ All concept pages updated
- ✅ Best practices documented

### Phase 4 Success
- ✅ 90%+ of high-value patterns extracted
- ✅ All pages using snippets consistently
- ✅ Complete documentation and guidelines
- ✅ Maintenance workflow established

---

## Next Steps

### Immediate Actions
1. ✅ **Review this plan** - Get team feedback
2. ⏳ **Create Phase 1 snippets** - Start with highest-value patterns
3. ⏳ **Update quickstart.mdx** - Pilot implementation
4. ⏳ **Test and refine** - Validate approach
5. ⏳ **Document in CLAUDE.md** - Add snippet guidelines

### Week 1 Goals
- Create 10-12 core snippets
- Update 3 high-traffic pages
- Establish workflow
- Document learnings

### Long-term Goals
- Complete all 4 phases
- Create snippet catalog
- Automate snippet testing
- Monitor adoption and effectiveness

---

## Appendix A: High-Value Snippet List

### Must-Create Snippets (Phase 1)

1. **Core Registration**
   - `snippets/core/register-tool-basic.mdx`
   - `snippets/core/register-tool-with-schema.mdx`

2. **React Hooks**
   - `snippets/core/use-webmcp-basic.mdx`
   - `snippets/core/use-webmcp-with-state.mdx`

3. **Responses**
   - `snippets/core/response-success.mdx`
   - `snippets/core/response-error.mdx`
   - `snippets/core/response-markdown.mdx`

4. **Imports**
   - `snippets/imports/react-imports.mdx`
   - `snippets/imports/client-imports.mdx`

### High-Priority Snippets (Phase 2)

5. **Validation**
   - `snippets/validation/zod-basic.mdx`
   - `snippets/validation/zod-complex.mdx`
   - `snippets/validation/json-schema-basic.mdx`

6. **Clients**
   - `snippets/clients/tab-client-setup.mdx`
   - `snippets/clients/mcp-client-provider.mdx`

### Nice-to-Have Snippets (Phase 3-4)

7. **Patterns**
   - `snippets/patterns/error-handling.mdx`
   - `snippets/patterns/lifecycle-cleanup.mdx`
   - `snippets/patterns/optimistic-update.mdx`
   - `snippets/patterns/fetch-api.mdx`

8. **Templates**
   - `snippets/templates/basic-tool-template.mdx`
   - `snippets/templates/react-component-template.mdx`

---

## Appendix B: Migration Priority Matrix

| File | Duplications | Priority | Phase |
|------|-------------|----------|-------|
| best-practices.mdx | 25+ | CRITICAL | 1 |
| quickstart.mdx | 10+ | CRITICAL | 1 |
| packages/react-webmcp.mdx | 15+ | HIGH | 1 |
| packages/global.mdx | 12+ | HIGH | 2 |
| concepts/schemas.mdx | 8+ | HIGH | 2 |
| packages/transports.mdx | 10+ | MEDIUM | 2 |
| security.mdx | 12+ | MEDIUM | 2 |
| concepts/tool-registration.mdx | 7+ | MEDIUM | 3 |
| extension/index.mdx | 5+ | MEDIUM | 3 |
| advanced.mdx | 6+ | LOW | 4 |

---

**Last Updated:** 2025-11-05
**Next Review:** After Phase 1 completion
**Contact:** Documentation team
