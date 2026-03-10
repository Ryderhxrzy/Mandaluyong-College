-- Create admin accounts table for MCST authentication
CREATE TABLE IF NOT EXISTS admin_accounts (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'admin',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster login lookups
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON admin_accounts(email);

-- Create index on is_active for filtering active accounts
CREATE INDEX IF NOT EXISTS idx_admin_accounts_is_active ON admin_accounts(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to prevent unauthorized access
-- Users can only view their own account
CREATE POLICY "Admins can view own account" ON admin_accounts
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_accounts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_admin_accounts_timestamp_trigger ON admin_accounts;
CREATE TRIGGER update_admin_accounts_timestamp_trigger
  BEFORE UPDATE ON admin_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_accounts_timestamp();

-- Insert sample admin account (password hash should be generated using bcrypt)
-- This is a placeholder - replace 'test@mcst.edu.ph' with actual admin email
-- and generate proper bcrypt hash for password
INSERT INTO admin_accounts (
  email,
  password_hash,
  first_name,
  last_name,
  full_name,
  is_active,
  role
) VALUES (
  'admin@mcst.edu.ph',
  '$2b$10$placeholder_bcrypt_hash_here',
  'Admin',
  'Account',
  'Admin Account',
  true,
  'admin'
)
ON CONFLICT (email) DO NOTHING;
