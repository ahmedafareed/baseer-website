-- Add shipping information columns to the orders table
ALTER TABLE orders
ADD COLUMN shipping_address text,
ADD COLUMN shipping_city text,
ADD COLUMN shipping_state text,
ADD COLUMN shipping_country text,
ADD COLUMN shipping_postal_code text,
ADD COLUMN payment_method text;

-- Add an index on the order_number column for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

