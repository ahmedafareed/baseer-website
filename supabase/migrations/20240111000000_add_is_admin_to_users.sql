-- Add is_admin column to auth.users table
ALTER TABLE auth.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT is_admin INTO is_admin_user
  FROM auth.users
  WHERE id = user_id;
  RETURN COALESCE(is_admin_user, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the RLS policy for the products table to allow admins to insert and delete
CREATE POLICY "Allow admins to manage products" ON products
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

