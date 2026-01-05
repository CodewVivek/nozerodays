-- =============================================
-- NoZeroDays Database Migrations
-- Account Deletion & constraints
-- =============================================

-- 1. Ensure cascading deletes for user_updates
-- When a user is deleted, all their updates should be removed
ALTER TABLE public.user_updates 
DROP CONSTRAINT IF EXISTS user_updates_user_id_fkey;

ALTER TABLE public.user_updates 
ADD CONSTRAINT user_updates_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

-- 2. Ensure cascading deletes for sponsors
-- When a user is deleted, all their sponsor entries should be removed
ALTER TABLE public.sponsors 
DROP CONSTRAINT IF EXISTS sponsors_user_id_fkey;

ALTER TABLE public.sponsors 
ADD CONSTRAINT sponsors_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

-- =============================================
-- OPTIONAL: Database Function for Account Deletion
-- This is a fallback in case admin.deleteUser is not available
-- =============================================

CREATE OR REPLACE FUNCTION delete_user_account(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete user_updates (should cascade, but explicit for safety)
    DELETE FROM public.user_updates WHERE user_updates.user_id = delete_user_account.user_id;
    
    -- Delete sponsors (should cascade, but explicit for safety)
    DELETE FROM public.sponsors WHERE sponsors.user_id = delete_user_account.user_id;
    
    -- Delete user record
    DELETE FROM public.users WHERE users.id = delete_user_account.user_id;
    
    -- Note: Supabase auth record should be deleted separately via auth.admin.deleteUser()
END;
$$;

-- =============================================
-- 3. RPC Function: Approve User (Admin Action)
-- bypasses potential RLS update blocks
-- =============================================
CREATE OR REPLACE FUNCTION approve_user(target_user_id uuid, initial_streak int DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.users
    SET status = 'approved',
        current_streak = initial_streak,
        longest_streak = GREATEST(longest_streak, initial_streak)
    WHERE id = target_user_id;
END;
$$;

-- Ensure is_claimed column exists (Legacy support for logic)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT true;

-- Ensure Twitter Stats columns exist (for manual overrides or sync)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS twitter_followers INT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS twitter_tweets INT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS twitter_bio TEXT;

-- =============================================
-- 4. RPC Function: Update Streak (Admin Action)
-- =============================================
CREATE OR REPLACE FUNCTION update_streak(target_user_id uuid, new_streak int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.users
    SET current_streak = new_streak,
        longest_streak = GREATEST(longest_streak, new_streak),
        last_streak_day_utc = CURRENT_DATE
    WHERE id = target_user_id;
END;
$$;

-- =============================================
-- 5. RPC Function: Toggle Verification (Admin Action)
-- =============================================
CREATE OR REPLACE FUNCTION toggle_verification(target_user_id uuid, new_status boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all events
CREATE POLICY "Admins can view analytics"
    ON public.analytics_events
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' IN ('vivek@buildinpublic.com', 'admin@nozerodays.com') -- Replace with actual admin emails or logic
        OR 
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
    );

-- Policy: Anon can insert events (via RPC only to be safe, or direct if needed)
-- We will use a secure RPC for insertion to strictly control what gets logged.

-- Secure Logging Function
CREATE OR REPLACE FUNCTION log_analytics_event(e_type text, e_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.analytics_events (event_type, event_data)
    VALUES (e_type, e_data);
END;
$$;

-- =============================================
-- UPDATE approve_user to include verification
-- =============================================
CREATE OR REPLACE FUNCTION approve_user(target_user_id uuid, initial_streak int DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.users
    SET status = 'approved',
        current_streak = initial_streak,
        longest_streak = GREATEST(longest_streak, initial_streak),
        is_verified = true  -- Auto-verify on approval
    WHERE id = target_user_id;
END;
$$;
