-- Comprehensive schema fix for all tables
-- This migration fixes schema mismatches and adds missing columns

-- Fix whatsapp_notifications table
ALTER TABLE IF EXISTS public.whatsapp_notifications
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Fix whatsapp_chat_messages table if needed
ALTER TABLE IF EXISTS public.whatsapp_chat_messages
ADD COLUMN IF NOT EXISTS direction TEXT CHECK (direction IN ('inbound', 'outbound')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'delivered',
ADD COLUMN IF NOT EXISTS external_message_id TEXT;

-- Ensure all required columns exist in orders table
ALTER TABLE IF EXISTS public.orders
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS created_by_waiter BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by_cashier BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS waiter_id UUID,
ADD COLUMN IF NOT EXISTS cashier_id UUID,
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Ensure all required columns exist in menu_items table
ALTER TABLE IF EXISTS public.menu_items
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Ensure all required columns exist in orders table
ALTER TABLE IF EXISTS public.orders
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Ensure all required columns exist in profiles table
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Ensure all required columns exist in customers table
ALTER TABLE IF EXISTS public.customers
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Ensure all required columns exist in waiters table
ALTER TABLE IF EXISTS public.waiters
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Ensure all required columns exist in payment_webhooks table
ALTER TABLE IF EXISTS public.payment_webhooks
ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR,
ADD COLUMN IF NOT EXISTS webhook_type VARCHAR,
ADD COLUMN IF NOT EXISTS action VARCHAR,
ADD COLUMN IF NOT EXISTS processing_status VARCHAR DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS webhook_data JSONB;

-- Create store_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on store_settings
ALTER TABLE IF EXISTS public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy for store_settings
CREATE POLICY "Allow public read access to store_settings" ON public.store_settings
  FOR SELECT USING (true);
