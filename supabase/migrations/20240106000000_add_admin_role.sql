-- Create admin_users table
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin_users"
  ON admin_users FOR SELECT
  USING (is_admin(auth.uid()));

-- Update auth.users trigger to set role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users WHERE id = NEW.id) THEN
    NEW.role := 'admin';
  ELSE
    NEW.role := 'user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add some sample admin users (replace with actual admin user IDs)
INSERT INTO admin_users (id) VALUES 
('00000000-0000-0000-0000-000000000000'),
('11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

