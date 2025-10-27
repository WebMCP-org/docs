# NPM Packages Repository Issues

## Repository URL Updates Needed

The following package.json files in the `npm-packages` repository still reference the old GitHub organization name `MiguelsPizza/WebMCP`.

These should be updated to `WebMCP-org/npm-packages` or `WebMCP-org/WebMCP` as appropriate.

### Affected Files

1. **transports/package.json**
   - homepage: `https://github.com/MiguelsPizza/WebMCP#readme`
   - bugs.url: `https://github.com/MiguelsPizza/WebMCP/issues`
   - repository.url: `git+https://github.com/MiguelsPizza/WebMCP.git`

2. **global/package.json**
   - homepage: `https://github.com/MiguelsPizza/WebMCP#readme`
   - bugs.url: `https://github.com/MiguelsPizza/WebMCP/issues`
   - repository.url: `git+https://github.com/MiguelsPizza/WebMCP.git`

3. **smart-dom-reader/package.json**
   - homepage: `https://github.com/MiguelsPizza/WebMCP#readme`
   - bugs.url: `https://github.com/MiguelsPizza/WebMCP/issues`
   - repository.url: `git+https://github.com/MiguelsPizza/WebMCP.git`

4. **extension-tools/package.json**
   - homepage: `https://github.com/MiguelsPizza/WebMCP#readme`
   - bugs.url: `https://github.com/MiguelsPizza/WebMCP/issues`
   - repository.url: `git+https://github.com/MiguelsPizza/WebMCP.git`

5. **webmcp-ts-sdk/package.json**
   - Same issues as above

6. **extension-tools/README.md**
   - Also references old organization name

### Recommended Fix

Update all references from:
- `https://github.com/MiguelsPizza/WebMCP`
  → `https://github.com/WebMCP-org/npm-packages`

This affects:
- `homepage` field
- `bugs.url` field
- `repository.url` field
- README links

### Impact

Users who:
- Click "Repository" links on npmjs.com
- Click "Issues" links on npmjs.com
- Use `npm repo` or `npm bugs` commands
- Follow links from package READMEs

...will get 404 errors or be redirected to the wrong repository.

### Notes

- These changes should be made in the **npm-packages repository**, not in the docs repository
- After fixing, packages should be republished to npm to update the metadata
- The `react-webmcp` package.json correctly uses `WebMCP-org/WebMCP` in its URLs
