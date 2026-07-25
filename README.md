# Teviq Support AI Widget

Plain JavaScript storefront widget for Teviq Support AI. It reads public configuration from the embed script, loads brand configuration from the backend, and sends customer messages to `POST /api/chat`.

## Production Embed

Use the immutable release URL in client stores:

```html
<script
  src="https://teviq-support-ai-widget.vercel.app/v1.0.0/widget.js"
  data-brand-id="CLIENT_BRAND_ID"
  data-api-url="https://teviq-support-ai-backend.onrender.com">
</script>
```

`data-brand-id` is a public brand identifier. The backend still validates the brand and scopes all knowledge and commerce lookups server-side.

## Local Verification

```bash
npm ci
npx playwright install chromium
npm run test:syntax
npm run test:release
npm run test:e2e
```

The browser tests cover welcome suggestions, updated suggestion handlers, manual messages, close/reopen persistence, and mobile fullscreen behavior.

## Releases

- `widget.js` is the short-cache development/stable alias.
- `v1.0.0/widget.js` is the immutable production release.
- `release-manifest.json` records the stable version and SHA-256 checksum.
- `npm run test:release` fails if a released file changes without a matching manifest update.

To publish a new version:

1. Finish and verify changes in `widget.js`.
2. Copy the reviewed source into a new version directory such as `v1.1.0/widget.js`.
3. Add the immutable cache rule in `vercel.json`.
4. Update `release-manifest.json` with the new path and SHA-256.
5. Run all widget tests.
6. Update dashboard and website embeds only after the release is deployed.

Rollback is a one-line embed change to the previous immutable version.

## Hosting

The repository is deployed as a static Vercel project. No framework or build step is required for the widget runtime.
