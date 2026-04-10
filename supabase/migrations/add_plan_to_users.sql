-- Add plan and credits columns to the users table.
-- Run this migration in the Supabase SQL editor:
--   Dashboard → SQL Editor → paste and run.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'starter'
    CHECK (plan IN ('starter', 'pro', 'business')),
  ADD COLUMN IF NOT EXISTS credits_remaining integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS credits_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_reset_at timestamp with time zone NOT NULL
    DEFAULT (date_trunc('month', now()) + interval '1 month');

-- Allow users to read and update their own row
-- (plan changes should go through a payment webhook in production;
--  this policy is intentionally permissive for MVP.)
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Re-create handle_new_user so new sign-ups get the correct defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at,
    plan,
    credits_remaining,
    credits_used,
    credits_reset_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at,
    'starter',
    5,
    0,
    date_trunc('month', now()) + interval '1 month'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
