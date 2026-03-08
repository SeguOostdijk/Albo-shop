-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_name TEXT,
  status TEXT DEFAULT 'pending',
  total REAL NOT NULL,
  shipping_cost REAL NOT NULL,
  shipping_method TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key from order_items to orders
ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_order
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid() OR user_id IS NULL
  )
);

-- Policy: Users can insert their own order items
CREATE POLICY "Users can insert own order items" ON order_items
FOR INSERT
WITH CHECK (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid() OR user_id IS NULL
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

