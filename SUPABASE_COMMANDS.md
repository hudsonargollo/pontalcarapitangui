# Supabase CLI Quick Reference

## Installation Status
✓ Supabase CLI v2.92.1 installed as dev dependency

## Essential Commands

### Local Development
```bash
# Start local Supabase instance
npx supabase start

# Stop local Supabase
npx supabase stop

# Reset local database (clears all data)
npx supabase db reset

# View local database status
npx supabase status
```

### Database Migrations
```bash
# Apply pending migrations to local database
npx supabase db push

# Create a new migration
npx supabase migration new <migration_name>

# List all migrations
npx supabase migration list

# View migration status
npx supabase migration list --linked
```

### Production Deployment
```bash
# Link to production project
npx supabase link --project-ref sntxekdwdllwkszclpiq

# Apply migrations to production
npx supabase db push --linked

# Pull production schema to local
npx supabase db pull

# Create migration from production changes
npx supabase db pull --schema-only
```

### Project Management
```bash
# View project status
npx supabase status

# List all projects
npx supabase projects list

# Switch projects
npx supabase link --project-ref <project_id>
```

### Functions (Edge Functions)
```bash
# Deploy edge functions
npx supabase functions deploy

# List deployed functions
npx supabase functions list

# View function logs
npx supabase functions logs <function_name>
```

### Secrets Management
```bash
# Set environment variable
npx supabase secrets set KEY=value

# List secrets
npx supabase secrets list

# Delete secret
npx supabase secrets unset KEY
```

## Project Details

- **Project ID**: sntxekdwdllwkszclpiq
- **Project URL**: https://jxmxavugxuzqgfvjjxdb.supabase.co
- **Migrations**: 67 total
- **Status**: Production (Supabase Cloud)

## Common Workflows

### Adding a New Feature
```bash
# 1. Create migration
npx supabase migration new add_feature_name

# 2. Edit migration file in supabase/migrations/
# 3. Test locally
npx supabase db reset

# 4. Deploy to production
npx supabase db push --linked
```

### Debugging Database Issues
```bash
# Check local database
npx supabase status

# View logs
npx supabase logs postgres

# Connect to local database
psql postgresql://postgres:postgres@localhost:54322/postgres
```

### Syncing with Team
```bash
# Pull latest schema from production
npx supabase db pull

# Commit changes
git add supabase/migrations/
git commit -m "Update database schema"

# Team member applies changes
npx supabase db push
```

## Useful Links

- Supabase Dashboard: https://app.supabase.com
- Project: https://app.supabase.com/project/sntxekdwdllwkszclpiq
- Documentation: https://supabase.com/docs
- CLI Docs: https://supabase.com/docs/reference/cli/introduction
