# Common Vercel Deployment Errors

## NoAdapterInstalled Error

Full error message in Vercel build logs:

```
[error] NoAdapterInstalled: Cannot use `output: 'server'` or `output: 'hybrid'` without an adapter. Please install and configure the appropriate server adapter for your final deployment.
Hint: See https://docs.astro.build/en/guides/server-side-rendering/ for more information.
```

**Root cause in this project**: The `.gitignore` file contained `*.mjs` which prevented `astro.config.mjs` from being committed and deployed to Vercel. Without the config file, Astro didn't know about the adapter.

**Detection command**:
```bash
git ls-files astro.config.mjs
# Empty output = file is not tracked
```

## libsql Native Module Error

Runtime error (500 response) with logs showing:

```
Error: Could not locate libsql native module for platform linux-x64-gnu
    at Object.<anonymous> (/var/task/chunks/astro/server_BOvlqHIK.mjs:1:12345)
```

**Root cause**: The `@libsql/client` package includes native bindings that are platform-specific. When building locally on macOS and deploying prebuilt artifacts, the Linux bindings are missing.

**Solution**: Never use `vercel deploy --prebuilt` for projects with native dependencies. Let Vercel build remotely.

## Adapter Import Path Errors

For @astrojs/vercel v8.x:
```javascript
// CORRECT for v8.x
import vercel from '@astrojs/vercel/serverless';

// WRONG for v8.x - this path doesn't exist
import vercel from '@astrojs/vercel';
```

For @astrojs/vercel v9.x:
```javascript
// CORRECT for v9.x
import vercel from '@astrojs/vercel';

// DEPRECATED in v9.x
import vercel from '@astrojs/vercel/serverless';
```

## Environment Variable Missing

Astro DB connection errors:

```
Error: ASTRO_DB_REMOTE_URL is not set
```

Or Turso authentication failures:

```
Error: LibsqlError: HRANA_WEBSOCKET_ERROR: unexpected status 401
```

**Fix**: Ensure both variables are set in Vercel:
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

## Build Cache Issues

When Vercel logs show:

```
Detected prebuilt output from earlier invocation
Using prebuilt output...
```

This means Vercel is using cached build artifacts instead of rebuilding. To force a fresh build:

1. Dashboard: Settings > Git > "Clear Build Cache & Redeploy"
2. CLI: Delete `.vercel/output` locally before pushing
3. Environment: Add `VERCEL_FORCE_NO_BUILD_CACHE=1`
