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
DECLARE
    old_streak int;
BEGIN
    -- Get current streak
    SELECT current_streak INTO old_streak FROM public.users WHERE id = target_user_id;

    -- Update users table
    UPDATE public.users
    SET current_streak = new_streak,
        longest_streak = GREATEST(longest_streak, new_streak),
        last_streak_day_utc = CURRENT_DATE
    WHERE id = target_user_id;

    -- If streak increased, insert historical record for Heatmap
    IF new_streak > old_streak THEN
        INSERT INTO public.user_updates (user_id, post_day_utc, post_url, review_status, created_at, reviewed_at)
        VALUES (target_user_id, CURRENT_DATE, 'https://nozerodays.com/admin-override', 'approved', now(), now())
        ON CONFLICT (user_id, post_day_utc) DO NOTHING;
    END IF;
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
    UPDATE public.users
    SET is_verified = new_status
    WHERE id = target_user_id;
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
