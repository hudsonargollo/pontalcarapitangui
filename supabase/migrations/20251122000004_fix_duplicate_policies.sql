-- Fix duplicate RLS policies
-- Drop all existing policies and recreate them cleanly

-- Drop all policies on orders table
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Waiters can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Waiters can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON public.orders;

-- Drop all policies on order_items table
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Public can read order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public to read order items" ON public.order_items;

-- Drop all policies on menu_categories table
DROP POLICY IF EXISTS "Allow public read access to menu_categories" ON public.menu_categories;

-- Drop all policies on menu_items table
DROP POLICY IF EXISTS "Allow public read access to menu_items" ON public.menu_items;

-- Recreate basic policies
CREATE POLICY "Allow public read access to menu_categories" ON public.menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to menu_items" ON public.menu_items
  FOR SELECT USING (available = true);

CREATE POLICY "Allow authenticated users to create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to view their own orders" ON public.orders
  FOR SELECT USING (
    auth.uid()::text = customer_phone OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public to insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read order items" ON public.order_items
  FOR SELECT USING (true);
