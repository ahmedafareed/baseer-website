-- Add stock column to products table
ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0;

-- Update existing products with a random stock value (for demonstration purposes)
UPDATE products SET stock = floor(random() * 100);

