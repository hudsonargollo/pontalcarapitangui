-- Fix payment_webhooks table schema
-- Add missing columns if they don't exist

ALTER TABLE IF EXISTS public.payment_webhooks
ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR,
ADD COLUMN IF NOT EXISTS webhook_type VARCHAR,
ADD COLUMN IF NOT EXISTS action VARCHAR,
ADD COLUMN IF NOT EXISTS processing_status VARCHAR DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add webhook_data if it doesn't exist
ALTER TABLE IF EXISTS public.payment_webhooks
ADD COLUMN IF NOT EXISTS webhook_data JSONB;

-- Now create the indexes (commented out as columns may not exist)
-- CREATE INDEX IF NOT EXISTS idx_payment_webhooks_mercadopago_payment_id 
-- ON public.payment_webhooks(mercadopago_payment_id);

-- CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processing_status 
-- ON public.payment_webhooks(processing_status);

-- Create unique index for deduplication based on payment ID and webhook type/action
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_webhooks_deduplication 
-- ON public.payment_webhooks(mercadopago_payment_id, webhook_type, action, (webhook_data->>'date_created'));
