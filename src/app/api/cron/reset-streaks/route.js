import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// This route should be called periodically (e.g., every hour) via Vercel Cron or external scheduler
export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        // Simple protection: Check for a secret key if needed (e.g. CRON_SECRET)
        // For now, we allow it to be public or protected by Vercel Cron protection middleware if configured

        // 1. Get current time in UTC
        const now = new Date();
        const nowUtc = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );

        // 2. Fetch all approved users
        const { data: users, error } = await supabase
            .from('users')
            .select('id, username, current_streak, last_streak_day_utc')
            .eq('status', 'approved');

        if (error) throw error;

        const updates = [];
        const resetIds = [];

        // 3. Check each user
        for (const user of users) {
            if (!user.last_streak_day_utc || user.current_streak === 0) continue;

            const lastStreakDate = new Date(user.last_streak_day_utc); // "YYYY-MM-DD" is treated as UTC in JS if simple format
            // Actually JS parses "YYYY-MM-DD" as UTC midnight
            const lastStreakTime = lastStreakDate.getTime();

            // Time since last eligible post day (midnight)
            // If last post was "2024-01-01", that is 1704067200000
            // If now is "2024-01-03 00:00:01", that is > 24h gap

            // Logic:
            // A post covers a specific UTC date.
            // If today is `D`, and last_post was `D-1`, streak is safe.
            // If last_post was `D-2`, streak is BROKEN... UNLESS we are in grace period of `D`.

            // Let's rely on calculating the "Deadline".
            // Deadline for "Yesterday's Post" was "Yesterday Midnight".
            // Deadline for "Today's Post" is "Tonight Midnight".

            // If I haven't posted for Today yet, my streak is valid until Tonight Midnight.
            // If I missed Yesterday, my streak ends... UNLESS now < Yesterday Midnight + 12h.

            // Calculate days difference purely by calendar days
            const msPerDay = 1000 * 60 * 60 * 24;
            const daysSinceLastPost = Math.floor(nowUtc / msPerDay) - Math.floor(lastStreakTime / msPerDay);

            // If 0 days: Posted today. Safe.
            // If 1 day: Posted yesterday. Safe until tonight.
            // If >= 2 days: Missed yesterday. Streak broken?

            if (daysSinceLastPost >= 2) {
                // Missed a whole day.
                // "2 days ago" means last post was Jan 1. Today is Jan 3. Missed Jan 2.

                // Valid Until: Jan 2 Midnight (deadline for Jan 2 post) + 12h Grace.
                // Jan 2 Midnight is `lastStreakTime + 2 * msPerDay`? No.
                // lastStreakTime is Jan 1 00:00.
                // Deadline for Jan 2 was Jan 3 00:00.
                // Grace period is Jan 3 12:00.

                const deadlineForNextPost = lastStreakTime + (2 * msPerDay); // Jan 3 00:00
                const graceDeadline = deadlineForNextPost + (12 * 60 * 60 * 1000); // +12 hours

                if (nowUtc > graceDeadline) {
                    resetIds.push(user.id);
                }
            }
        }

        // 4. Perform Resets
        if (resetIds.length > 0) {
            const { error: updateError } = await supabase
                .from('users')
                .update({ current_streak: 0 })
                .in('id', resetIds);

            if (updateError) throw updateError;
        }

        return NextResponse.json({
            success: true,
            checked: users.length,
            resets: resetIds.length,
            reset_ids: resetIds
        });

    } catch (error) {
        console.error('Streak Reset Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
