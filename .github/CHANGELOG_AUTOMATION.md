# Changelog Automation

This document explains how the changelog automation works and how to use it.

## Features

### 1. RSS Feed
The changelog at `/changelog` includes an RSS feed that users can subscribe to. The feed is available at:
- **URL**: `https://docs.mcp-b.ai/changelog/rss.xml`
- **Enabled by**: `rss: true` in the changelog frontmatter

Users can subscribe via:
- [Slack RSS integration](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack)
- Email (via [Zapier](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email))
- Discord bots ([Readybot](https://readybot.io) or [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot))

### 2. Automated Updates
The changelog can be automatically updated when new npm packages are published.

## Manual Update via GitHub Actions

1. Go to **Actions** → **Update Changelog**
2. Click **Run workflow**
3. Fill in the required fields:
   - **Version**: e.g., `1.1.0`
   - **Label**: e.g., `February 2025`
   - **Tags**: e.g., `Bug Fixes,Performance` (optional, comma-separated)
   - **Content**: Markdown content for the changelog entry

### Example Content

```markdown
## New Features

- ✨ Added support for Firefox extensions
- ✨ New performance monitoring tools

## Bug Fixes

- Fixed memory leak in extension transport
- Corrected TypeScript definitions for tool schemas

## Performance Improvements

- Reduced bundle size by 15%
- Optimized tool registration performance
```

## Automated Updates from npm-packages Repo

To trigger changelog updates automatically when publishing npm packages:

### 1. Add workflow to npm-packages repo

Create `.github/workflows/publish-changelog.yml`:

```yaml
name: Publish Changelog to Docs

on:
  release:
    types: [published]

jobs:
  trigger-docs-update:
    runs-on: ubuntu-latest
    steps:
      - name: Extract release info
        id: release
        run: |
          VERSION="${{ github.event.release.tag_name }}"
          VERSION="${VERSION#v}"  # Remove 'v' prefix if present
          echo "version=${VERSION}" >> $GITHUB_OUTPUT

          # Extract month and year for label
          LABEL=$(date +'%B %Y')
          echo "label=${LABEL}" >> $GITHUB_OUTPUT

      - name: Trigger docs update
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.DOCS_REPO_TOKEN }}
          repository: WebMCP-org/docs
          event-type: npm-release
          client-payload: |
            {
              "version": "${{ steps.release.outputs.version }}",
              "label": "${{ steps.release.outputs.label }}",
              "tags": "Release",
              "content": ${{ toJSON(github.event.release.body) }}
            }
```

### 2. Create GitHub Token

1. Go to **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Create a new token with:
   - **Repository access**: Only select repositories → `WebMCP-org/docs`
   - **Permissions**:
     - Contents: Read and write
     - Workflows: Read and write
3. Add the token as `DOCS_REPO_TOKEN` secret in the npm-packages repo

### 3. Format Release Notes

When creating a release in the npm-packages repo, format the release notes using Markdown. They will be automatically added to the docs changelog.

## Example Release Workflow

1. **In npm-packages repo**:
   ```bash
   # Create and publish a new release
   npm version 1.1.0
   git push --tags
   ```

2. **GitHub Release**:
   - Go to Releases → Draft a new release
   - Choose the tag (e.g., `v1.1.0`)
   - Add release notes in Markdown format
   - Publish release

3. **Automatic docs update**:
   - The workflow triggers automatically
   - Changelog is updated in the docs repo
   - RSS feed is updated with the new entry

## RSS Feed Format

The RSS feed is generated automatically by Mintlify from the `Update` components. Each Update component creates an RSS entry with:
- **Title**: The label (e.g., "February 2025")
- **Description**: The version (e.g., "v1.1.0")
- **Content**: The full markdown content
- **Link**: Direct link to the changelog section

## Troubleshooting

### Workflow doesn't trigger
- Check that the `DOCS_REPO_TOKEN` secret is set correctly
- Verify the token has the required permissions
- Check the workflow logs in both repositories

### Changelog format issues
- Ensure release notes use proper Markdown syntax
- Test the Update component format locally before publishing
- Check that tags are comma-separated without extra spaces

### RSS feed not updating
- RSS feeds update when new Update components are added or when headings change
- Clear browser cache and retry
- Verify `rss: true` is in the frontmatter
