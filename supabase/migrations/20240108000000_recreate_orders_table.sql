-- Drop the existing orders table
DROP TABLE IF EXISTS orders;

-- Recreate the orders table with all necessary columns
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    order_number TEXT UNIQUE NOT NULL,
    user_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    items JSONB NOT NULL,
    applied_discount NUMERIC(5, 2) DEFAULT 0,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_country TEXT NOT NULL,
    shipping_postal_code TEXT NOT NULL,
    payment_method TEXT NOT NULL
);

-- Create an index on the order_number for faster lookups
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Create an index on user_id for faster user-specific queries
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own orders
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Optionally, create a policy for administrators to manage all orders
-- Note: You'll need to implement an is_admin() function or use a specific admin role
-- CREATE POLICY "Admins can manage all orders" ON orders
--     USING (is_admin(auth.uid()));

