# Supabase Setup Guide

This project is configured to use Supabase as its database. Follow these steps to get started.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project" and fill in the project details:
   - **Name**: Your project name (e.g., "Mandaluyong College")
   - **Database Password**: Create a secure password
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Credentials

Once your project is created:

1. Go to **Settings** (bottom left) → **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon public**: Copy this key
3. Also note the **service_role** key (for backend operations - keep this private!)

## Step 3: Configure Environment Variables

1. Open `.env` in the project root
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser - only use the public anon key here
- For backend operations, create a `.env.local` file with the service role key:
  ```
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```

## Step 4: Create Database Tables

Use the Supabase SQL Editor to create your tables:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Write your SQL schema and execute

### Example: Create a Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Example: Create a Students Table

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  student_id VARCHAR(50) UNIQUE,
  course VARCHAR(100),
  enrollment_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 5: Use Supabase in Your Application

### Basic Query Example

```typescript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert([{ email: 'user@example.com', username: 'john' }])

// Update data
const { data, error } = await supabase
  .from('users')
  .update({ username: 'jane' })
  .eq('id', userId)

// Delete data
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId)
```

### Using the Custom Hook

```typescript
'use client'

import { useSupabaseQuery } from '@/lib/hooks/useSupabase'
import { supabase } from '@/lib/supabase'

export function UsersList() {
  const { data: users, loading, error } = useSupabaseQuery(
    () => supabase.from('users').select('*'),
    []
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  )
}
```

## Step 6: Set Up Row Level Security (RLS)

Protect your data with Row Level Security:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Create policies for your tables to control who can access what data

Example policy for users to only see their own data:

```sql
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentication with Supabase](https://supabase.com/docs/guides/auth)
- [Database Best Practices](https://supabase.com/docs/guides/database/best-practices)

## Environment Variables Reference

| Variable | Purpose | Value Type |
|----------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend access (keep private) | Private - `.env.local` |

## Troubleshooting

**Missing environment variables error?**
- Ensure `.env` file exists in the project root
- Check that the variable names match exactly (they're case-sensitive)
- Restart your development server after updating `.env`

**CORS errors when fetching from the browser?**
- Go to your Supabase project settings
- Add your application URL to the allowed CORS origins

**Connection refused?**
- Verify your Supabase project URL is correct
- Check that your project is running in the Supabase dashboard
- Ensure your internet connection is stable
