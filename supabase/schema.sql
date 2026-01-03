-- BUILD-IN-PUBLIC LEADERBOARD SCHEMA

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_streak_day_utc DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Updates table
CREATE TABLE IF NOT EXISTS user_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_day_utc DATE NOT NULL,
    post_url TEXT,
    review_status TEXT CHECK (review_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Prevent duplicate submissions for the same day
    UNIQUE(user_id, post_day_utc)
);

-- 3. RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_updates ENABLE ROW LEVEL SECURITY;

-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Anyone can create a profile (to join the leaderboard)
CREATE POLICY "Anyone can create a profile" ON users
    FOR INSERT WITH CHECK (true);

-- Anyone can update their own profile (based on username matching)
-- For MVP we'll just allow all updates for now to simplify
CREATE POLICY "Anyone can update a profile" ON users
    FOR UPDATE USING (true);

-- Updates are viewable by everyone
CREATE POLICY "Updates are viewable by everyone" ON user_updates
    FOR SELECT USING (true);

-- Anyone can submit updates
CREATE POLICY "Anyone can submit updates" ON user_updates
    FOR INSERT WITH CHECK (true);

-- Anyone can update an update (e.g. for review or upsert)
CREATE POLICY "Anyone can update an update" ON user_updates
    FOR UPDATE USING (true);

-- 4. Streak Calculation Function
CREATE OR REPLACE FUNCTION calculate_streaks(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    streak_count INT := 0;
    max_streak INT := 0;
    last_date DATE;
    current_date_utc DATE := CURRENT_DATE AT TIME ZONE 'UTC';
    update_record RECORD;
BEGIN
    -- 1. Calculate current streak
    FOR update_record IN 
        SELECT post_day_utc 
        FROM user_updates 
        WHERE user_id = target_user_id AND review_status = 'approved' 
        ORDER BY post_day_utc DESC
    LOOP
        IF last_date IS NULL THEN
            IF update_record.post_day_utc = current_date_utc OR update_record.post_day_utc = (current_date_utc - INTERVAL '1 day')::DATE THEN
                streak_count := 1;
                last_date := update_record.post_day_utc;
            ELSE
                EXIT;
            END IF;
        ELSE
            IF update_record.post_day_utc = (last_date - INTERVAL '1 day')::DATE THEN
                streak_count := streak_count + 1;
                last_date := update_record.post_day_utc;
            ELSE
                EXIT;
            END IF;
        END IF;
    END LOOP;

    -- 2. Calculate longest streak
    WITH streak_groups AS (
        SELECT 
            post_day_utc,
            post_day_utc - (ROW_NUMBER() OVER (ORDER BY post_day_utc))::INT as grp
        FROM user_updates
        WHERE user_id = target_user_id AND review_status = 'approved'
    ),
    streak_lengths AS (
        SELECT grp, COUNT(*) as len
        FROM streak_groups
        GROUP BY grp
    )
    SELECT COALESCE(MAX(len), 0) INTO max_streak FROM streak_lengths;

    UPDATE users 
    SET 
        current_streak = streak_count,
        longest_streak = GREATEST(max_streak, longest_streak),
        last_streak_day_utc = (SELECT post_day_utc FROM user_updates WHERE user_id = target_user_id AND review_status = 'approved' ORDER BY post_day_utc DESC LIMIT 1),
        updated_at = now()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger
CREATE OR REPLACE FUNCTION trigger_calculate_streak()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.review_status = 'approved' OR (OLD.review_status = 'approved' AND NEW.review_status != 'approved') THEN
        PERFORM calculate_streaks(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_on_approval
AFTER UPDATE ON user_updates
FOR EACH ROW
EXECUTE FUNCTION trigger_calculate_streak();
