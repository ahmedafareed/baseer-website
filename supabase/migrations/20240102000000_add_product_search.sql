-- Enable the pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add a GIN index to the name column for faster text search
CREATE INDEX IF NOT EXISTS products_name_search_idx ON products USING GIN (name gin_trgm_ops);

-- Add a GIN index to the description column for faster text search
CREATE INDEX IF NOT EXISTS products_description_search_idx ON products USING GIN (description gin_trgm_ops);

