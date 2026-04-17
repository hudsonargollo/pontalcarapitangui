# Your Supabase User Profile

## Account Information

### Organization
- **Organization ID**: mhyhbblyiwxoeaoxaozr
- **Organization Slug**: mhyhbblyiwxoeaoxaozr

### Authentication Status
✓ **Authenticated** - You have valid Supabase credentials configured

## Project Details

### Project: pontalcarapitangui
- **Project ID**: jxmxavugxuzqgfvjjxdb
- **Project Reference**: jxmxavugxuzqgfvjjxdb
- **Status**: ACTIVE_HEALTHY ✓
- **Region**: East US (Ohio) (us-east-2)
- **Created**: April 17, 2026 at 18:06:39 UTC
- **Linked**: Yes (to local workspace)

### Database
- **Host**: db.jxmxavugxuzqgfvjjxdb.supabase.co
- **Engine**: PostgreSQL 17
- **Version**: 17.6.1.104
- **Release Channel**: GA (General Availability)

### API Endpoints
- **Supabase URL**: https://jxmxavugxuzqgfvjjxdb.supabase.co
- **Database URL**: postgresql://postgres:U%q$qn-yka4%.QD@db.jxmxavugxuzqgfvjjxdb.supabase.co:5432/postgres

## Authentication Keys

### Anon Key (Public)
- **Type**: Anonymous/Public Key
- **Role**: anon
- **Usage**: Client-side authentication, public API access
- **Scope**: Limited by Row-Level Security (RLS) policies
- **Status**: ✓ Active

### Service Role Key (Private)
- **Type**: Service Role Key
- **Role**: service_role
- **Usage**: Server-side operations, admin functions
- **Scope**: Bypasses RLS policies
- **Status**: ✓ Active
- **⚠️ WARNING**: Keep this key secret! Never commit to version control.

## Access Permissions

### Your Role
- **Primary Role**: Project Owner/Admin
- **Organization Role**: Owner
- **Permissions**: Full access to all project resources

### What You Can Do
✓ Create and manage databases
✓ Configure authentication
✓ Manage API keys and tokens
✓ Deploy edge functions
✓ Configure webhooks
✓ Manage storage buckets
✓ View analytics and logs
✓ Manage team members
✓ Configure RLS policies
✓ Create and run migrations

## Current Configuration

### Environment Variables (in .env)
```
VITE_SUPABASE_URL=https://jxmxavugxuzqgfvjjxdb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=jxmxavugxuzqgfvjjxdb
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### CLI Profile
- **Profile Name**: supabase (default)
- **Linked Project**: pontalcarapitangui
- **Status**: Connected ✓

## Database Schema Status

### Tables Created: 67 Migrations Applied
- ✓ Core tables (orders, customers, menu items, etc.)
- ✓ Payment integration tables
- ✓ WhatsApp integration tables
- ✓ Staff management tables
- ✓ RLS policies configured
- ✓ Storage buckets created

### Current Features Enabled
- ✓ Real-time subscriptions
- ✓ Row-Level Security (RLS)
- ✓ Authentication with roles
- ✓ Payment webhook handling
- ✓ WhatsApp integration
- ✓ Soft delete functionality
- ✓ Admin and customer access controls

## Security Status

### ✓ Secure Configuration
- Service role key is stored in `.env` (not committed)
- Anon key is used for client-side operations
- RLS policies protect sensitive data
- Database password is secure

### ⚠️ Important Security Notes
1. **Never share** your service role key
2. **Never commit** `.env` to version control
3. **Rotate keys** periodically for production
4. **Use RLS policies** to control data access
5. **Monitor** API usage and logs

## Quick Links

- **Dashboard**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb
- **SQL Editor**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb/sql
- **Database**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb/editor
- **Auth**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb/auth/users
- **Storage**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb/storage/buckets
- **Functions**: https://app.supabase.com/project/jxmxavugxuzqgfvjjxdb/functions

## Useful Commands

```bash
# View your projects
npx supabase projects list

# Link to this project
npx supabase link --project-ref jxmxavugxuzqgfvjjxdb

# View project status
npx supabase status

# View migrations
npx supabase migration list --linked

# Deploy migrations
npx supabase db push --linked

# View logs
npx supabase logs postgres --linked
```

## Support & Resources

- **Documentation**: https://supabase.com/docs
- **API Reference**: https://supabase.com/docs/reference/api
- **CLI Reference**: https://supabase.com/docs/reference/cli/introduction
- **Status Page**: https://status.supabase.com
- **Community**: https://discord.supabase.io

---

**Profile Generated**: April 17, 2026
**Account Status**: Active ✓
**Project Status**: Healthy ✓
