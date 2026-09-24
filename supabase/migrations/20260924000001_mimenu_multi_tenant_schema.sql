-- ==============================================================================
-- MIMENU Multi-Tenant SaaS Schema & Moe's Taberna Santa Cruz de la Sierra Setup
-- ==============================================================================

-- 1. Create Venues Table (Multi-tenant master)
CREATE TABLE IF NOT EXISTS public.venues (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    city TEXT NOT NULL DEFAULT 'Santa Cruz de la Sierra',
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    currency TEXT NOT NULL DEFAULT 'Bs.',
    currency_code TEXT NOT NULL DEFAULT 'BOB',
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#D97706',
    accent_color TEXT NOT NULL DEFAULT '#EF4444',
    background_theme TEXT NOT NULL DEFAULT 'dark',
    opening_hours TEXT,
    instagram TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Physical Venue Tables & QR Mapping
CREATE TABLE IF NOT EXISTS public.venue_tables (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    label TEXT NOT NULL,
    qr_code_hash TEXT UNIQUE NOT NULL,
    zone TEXT NOT NULL DEFAULT 'Principal',
    is_occupied BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Cycling Offers & Promotions (Intelligent Automated Smart Offers)
CREATE TABLE IF NOT EXISTS public.cycling_offers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    badge TEXT NOT NULL DEFAULT 'PROMO',
    original_price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    priority_level INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    included_item_names TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.offer_schedules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    offer_id TEXT NOT NULL REFERENCES public.cycling_offers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL DEFAULT -1, -- -1 = All days, 0 = Sunday, 1 = Monday...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS public.offer_analytics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    offer_id TEXT UNIQUE NOT NULL REFERENCES public.cycling_offers(id) ON DELETE CASCADE,
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    add_to_carts BIGINT NOT NULL DEFAULT 0,
    conversions BIGINT NOT NULL DEFAULT 0,
    revenue_generated NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Item-Level Customer Reviews & Moderation
CREATE TABLE IF NOT EXISTS public.item_reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Add Hotness Metrics columns to Menu Items
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'hotness_score') THEN
        ALTER TABLE public.menu_items ADD COLUMN hotness_score INTEGER NOT NULL DEFAULT 1 CHECK (hotness_score BETWEEN 1 AND 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'velocity_24h') THEN
        ALTER TABLE public.menu_items ADD COLUMN velocity_24h INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'baseline_14d') THEN
        ALTER TABLE public.menu_items ADD COLUMN baseline_14d NUMERIC(8,2) NOT NULL DEFAULT 1.00;
    END IF;
END $$;

-- 6. Hotness Algorithm Stored Procedure
CREATE OR REPLACE FUNCTION public.calculate_hotness_scores()
RETURNS void AS $$
DECLARE
    rec RECORD;
    v_velocity INTEGER;
    v_baseline NUMERIC(8,2);
    v_ratio NUMERIC(8,2);
    v_score INTEGER;
BEGIN
    FOR rec IN SELECT id, velocity_24h, baseline_14d FROM public.menu_items LOOP
        v_velocity := rec.velocity_24h;
        v_baseline := GREATEST(rec.baseline_14d, 1.0);
        v_ratio := v_velocity::numeric / v_baseline;

        IF v_ratio >= 3.5 OR v_velocity >= 40 THEN
            v_score := 5; -- On Fire 🔥🔥🔥
        ELSIF v_ratio >= 2.5 OR v_velocity >= 25 THEN
            v_score := 4; -- Muy Caliente 🔥
        ELSIF v_ratio >= 1.5 OR v_velocity >= 15 THEN
            v_score := 3; -- Popular ⚡
        ELSIF v_ratio >= 0.8 OR v_velocity >= 5 THEN
            v_score := 2; -- Templado 🌡️
        ELSE
            v_score := 1; -- Frío ❄️
        END IF;

        UPDATE public.menu_items
        SET hotness_score = v_score
        WHERE id = rec.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 7. Seed Initial Moe's Taberna Venue Data
INSERT INTO public.venues (
    id, slug, name, tagline, description, city, address, phone, whatsapp, currency, currency_code, primary_color, accent_color, background_theme, opening_hours
) VALUES (
    'venue-moes-taberna-scz',
    'moes',
    'Moe''s Taberna',
    'La Taberna Más Prendida de Santa Cruz 🍺🔥',
    'Salchipapas legendarias con queso derretido, nachos monstruosos, fernet bien cruceño, chopp helado escarchado y el mejor ambiente nocturno de Santa Cruz de la Sierra.',
    'Santa Cruz de la Sierra',
    'Av. San Martín #450, Barrio Equipetrol, Santa Cruz, Bolivia',
    '+591 78012345',
    '+59178012345',
    'Bs.',
    'BOB',
    '#D97706',
    '#EF4444',
    'dark',
    'Martes a Domingo: 18:00 - 03:00'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    currency = EXCLUDED.currency;
