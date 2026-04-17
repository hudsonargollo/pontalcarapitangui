# Supabase Migration Guide - Coco Loko Açaiteria

## Installation Complete ✓

Supabase CLI v2.92.1 has been successfully installed as a dev dependency.

## Project Configuration

- **Project ID**: sntxekdwdllwkszclpiq
- **Supabase URL**: https://jxmxavugxuzqgfvjjxdb.supabase.co
- **Environment**: Production (Supabase Cloud)

## Current Database Schema

The project includes **67 migrations** covering:

### Core Tables
- `orders` - Customer orders with payment tracking
- `order_items` - Individual items in orders
- `menu_items` - Product catalog
- `categories` - Menu categories
- `customers` - Customer profiles
- `profiles` - User profiles with roles
- `waiters` - Waiter staff accounts

### Feature Tables
- `payment_webhooks` - MercadoPago payment confirmations
- `whatsapp_notifications` - WhatsApp message tracking
- `whatsapp_sessions` - WhatsApp session management
- `whatsapp_error_logs` - WhatsApp error tracking
- `whatsapp_opt_outs` - Customer opt-out preferences
- `whatsapp_chat_messages` - Chat message history
- `notification_templates` - WhatsApp message templates
- `store_settings` - Store configuration

### Storage
- `product_images` - Product image bucket

## Migration Timeline

### Phase 1: Base Schema (Jan 2024)
- Base schema and initial tables
- WhatsApp error logs

### Phase 2: Payment Integration (Nov 2024)
- Payment fields and webhooks
- Payment confirmation infrastructure
- Payment method tracking

### Phase 3: WhatsApp Integration (Nov 2024)
- WhatsApp notifications
- Session management
- Error logging and opt-outs
- Chat messages

### Phase 4: Staff Management (Nov 2024)
- Waiter module with order management
- Staff accounts and permissions
- Display names and phone numbers

### Phase 5: Security & Optimization (Nov 2024)
- RLS policies for all tables
- Admin and customer access controls
- Soft delete functionality
- Payment status tracking

### Phase 6: Rebranding (Nov 2024)
- Menu population for Pontal
- Schema fixes and optimizations
- Duplicate policy cleanup

## How to Apply Migrations

### Option 1: Local Development (Recommended for Testing)

```bash
# Start local Supabase
npx supabase start

# Apply all migrations to local database
npx supabase db push

# Reset database (clears all data)
npx supabase db reset
```

### Option 2: Production Deployment

```bash
# Link to production project
npx supabase link --project-ref sntxekdwdllwkszclpiq

# Apply migrations to production
npx supabase db push --linked

# Create a new migration
npx supabase migration new <migration_name>
```

### Option 3: Manual SQL Execution

If migrations have already been applied via Supabase dashboard:

1. Go to https://app.supabase.com
2. Select project: sntxekdwdllwkszclpiq
3. Navigate to SQL Editor
4. Review migration files in `supabase/migrations/`
5. Execute any pending migrations

## Environment Variables

All required environment variables are configured in `.env`:

```
VITE_SUPABASE_URL=https://jxmxavugxuzqgfvjjxdb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
VITE_SUPABASE_PROJECT_ID=jxmxavugxuzqgfvjjxdb
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## Key Features Enabled

✓ Real-time subscriptions
✓ Row-level security (RLS)
✓ Authentication with roles
✓ Payment webhook handling
✓ WhatsApp integration
✓ Soft delete functionality
✓ Admin and customer access controls

## Next Steps

1. **Verify Migrations**: Check Supabase dashboard to confirm all migrations are applied
2. **Test Connections**: Run `npm run dev` and verify database connectivity
3. **Seed Data**: Use migration files to populate initial menu items and settings
4. **Deploy**: Use `npm run deploy` to deploy to production

## Troubleshooting

### Migrations Not Applying
- Check Supabase project status: https://app.supabase.com
- Verify service role key has proper permissions
- Review migration logs in Supabase dashboard

### Connection Issues
- Verify `.env` variables are correct
- Check network connectivity to Supabase
- Ensure project is not paused

### RLS Policy Errors
- Review policies in Supabase dashboard
- Check user roles and permissions
- Verify authentication tokens

## Support

For issues with Supabase:
- Documentation: https://supabase.com/docs
- Status: https://status.supabase.com
- Support: https://supabase.com/support
