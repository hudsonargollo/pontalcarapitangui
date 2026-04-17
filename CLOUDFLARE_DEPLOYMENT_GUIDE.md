# Cloudflare Pages Deployment Guide

## Overview

This guide covers deploying the Coco Loko Açaiteria application to Cloudflare Pages with automatic Supabase migrations.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository initialized
- Cloudflare account with Pages enabled
- Supabase CLI installed (`npm install -g supabase` or `npm install supabase --save-dev`)
- Wrangler CLI installed (`npm install -g wrangler`)

## Current Configuration

### Cloudflare Pages
- **Project Name**: portalcarapitangui
- **Build Output**: dist/
- **Framework**: Vite + React
- **URL**: https://portalcarapitangui.pages.dev

### Supabase
- **Project ID**: jxmxavugxuzqgfvjjxdb
- **Project URL**: https://jxmxavugxuzqgfvjjxdb.supabase.co
- **Migrations**: 67 total
- **Status**: Active & Healthy

### Environment Variables
All environment variables are configured in `wrangler.toml`:
- ✓ Supabase credentials (URL, keys)
- ✓ MercadoPago API keys
- ✓ Evolution API (WhatsApp)
- ✓ WhatsApp configuration

## Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Deploy to main branch
bash scripts/deploy-cloudflare.sh

# Deploy to specific branch
bash scripts/deploy-cloudflare.sh staging
```

**What it does:**
1. Verifies prerequisites (npm, git)
2. Checks git status
3. Installs dependencies
4. Runs linter
5. Applies Supabase migrations
6. Builds the application
7. Deploys to Cloudflare Pages
8. Deploys Supabase Edge Functions
9. Verifies deployment

### Method 2: Manual Deployment

```bash
# 1. Install dependencies
npm install

# 2. Apply Supabase migrations
npx supabase db push --linked

# 3. Build the application
npm run build

# 4. Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=coco-loko-acaiteria --branch=main

# 5. Deploy Edge Functions
npx supabase functions deploy create-waiter
npx supabase functions deploy list-waiters
npx supabase functions deploy delete-waiter
npx supabase functions deploy update-waiter-profile
npx supabase functions deploy send-password-reset
npx supabase functions deploy mercadopago-webhook
```

### Method 3: GitHub Actions (CI/CD)

If you have GitHub Actions configured, commits to main branch will automatically:
1. Run tests
2. Build the application
3. Deploy to Cloudflare Pages

## Supabase Migrations

### Automatic Migration on Deploy

The deployment script automatically applies pending migrations:

```bash
npx supabase db push --linked
```

This command:
- Connects to your Supabase project
- Checks for pending migrations
- Applies any new migrations
- Skips if all migrations are already applied

### Manual Migration

```bash
# Apply migrations to production
npx supabase db push --linked

# View migration status
npx supabase migration list --linked

# Create a new migration
npx supabase migration new <migration_name>

# Rollback (if needed)
npx supabase db reset
```

### Migration Files

All migrations are stored in `supabase/migrations/`:
- 67 total migrations
- Organized by date and feature
- Include schema, functions, policies, and data

## Environment Variables

### Frontend Variables (in wrangler.toml)
```toml
VITE_SUPABASE_URL = "https://jxmxavugxuzqgfvjjxdb.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_MERCADOPAGO_PUBLIC_KEY = "APP_USR-..."
VITE_EVOLUTION_API_URL = "http://wppapi.clubemkt.digital"
```

### Backend Variables (in wrangler.toml)
```toml
SUPABASE_URL = "https://jxmxavugxuzqgfvjjxdb.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
MERCADOPAGO_ACCESS_TOKEN = "APP_USR-..."
```

## Deployment Checklist

Before deploying, verify:

- [ ] All code changes are committed
- [ ] Tests pass: `npm run test:run`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables are correct in `wrangler.toml`
- [ ] Supabase project is healthy
- [ ] No pending migrations
- [ ] Cloudflare account is active

## Post-Deployment Verification

After deployment, verify:

1. **Application is accessible**
   ```bash
   curl https://coco-loko-acaiteria.pages.dev
   ```

2. **Supabase connection works**
   - Check Supabase dashboard
   - Verify real-time subscriptions
   - Test authentication

3. **Migrations were applied**
   ```bash
   npx supabase migration list --linked
   ```

4. **Edge Functions are deployed**
   ```bash
   npx supabase functions list
   ```

5. **Environment variables are loaded**
   - Check browser console for any errors
   - Verify API calls work

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Deployment Fails

```bash
# Check Wrangler status
wrangler status

# Verify Cloudflare credentials
wrangler whoami

# Check project configuration
cat wrangler.toml
```

### Migrations Don't Apply

```bash
# Check migration status
npx supabase migration list --linked

# View migration logs
npx supabase logs postgres --linked

# Link to project if not linked
npx supabase link --project-ref jxmxavugxuzqgfvjjxdb
```

### Environment Variables Not Loading

1. Verify variables in `wrangler.toml`
2. Check Cloudflare Pages settings
3. Rebuild and redeploy
4. Clear browser cache

## Rollback

If deployment has issues:

```bash
# Rollback to previous version
# 1. Revert git commits
git revert <commit-hash>
git push origin main

# 2. Redeploy
bash scripts/deploy-cloudflare.sh

# 3. If database changes needed, create rollback migration
npx supabase migration new rollback_<feature>
```

## Monitoring

### Cloudflare Dashboard
- https://dash.cloudflare.com/
- Monitor deployment status
- View analytics and logs

### Supabase Dashboard
- https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb
- Monitor database performance
- View real-time logs
- Check authentication metrics

### Application Logs
```bash
# View Supabase logs
npx supabase logs postgres --linked

# View Edge Function logs
npx supabase functions logs <function-name>
```

## Performance Optimization

### Build Optimization
```bash
# Check build size
npm run build
ls -lh dist/

# Analyze bundle
npm run build -- --analyze
```

### Database Optimization
- Monitor slow queries in Supabase
- Add indexes for frequently queried columns
- Optimize RLS policies

## Security

### Secrets Management
- Never commit `.env` files
- Use Cloudflare Pages secrets for sensitive data
- Rotate API keys periodically
- Monitor access logs

### Database Security
- RLS policies protect data
- Service role key is kept secret
- Anon key has limited permissions
- Regular backups are maintained

## Support & Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Supabase Docs**: https://supabase.com/docs
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Project Dashboard**: https://dash.cloudflare.com/
- **Supabase Dashboard**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb

## Quick Commands

```bash
# Deploy everything
bash scripts/deploy-cloudflare.sh

# Deploy to staging
bash scripts/deploy-cloudflare.sh staging

# Build only
npm run build

# Apply migrations only
npx supabase db push --linked

# View deployment status
wrangler pages list

# View project info
npx supabase projects list
```

---

**Last Updated**: April 17, 2026
**Deployment Status**: Ready
**Supabase Status**: Active & Healthy
