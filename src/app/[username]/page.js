import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Breadcrumbs from '../../components/Breadcrumbs';
import ActivityHeatmap from '../../components/ActivityHeatmap';
import ProgressFeed from '../../components/ProgressFeed';
import ShareStreakButton from '../../components/ShareStreakButton';
import EditProfileButton from '../../components/EditProfileButton';
import ProfileHeader from '../../components/ProfileHeader';
import { Trophy, TrendingUp, Zap, Calendar, Github, CheckCircle, Activity, BarChart2 } from 'lucide-react';
import { XIcon, VerifiedBadge } from '../../components/Icons';

// Force dynamic rendering since we depend on params
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { username } = await params;
    return {
        title: `${username} | NoZeroDays Profile`,
        description: `Check out ${username}'s build-in-public consistency streak on NoZeroDays.`,
        openGraph: {
            title: `${username} is shipping daily on NoZeroDays!`,
            description: `Track ${username}'s daily streak and consistency.`,
        }
    };
}

const ProfilePage = async ({ params }) => {
    const { username } = await params;

    // 1. Fetch User (Case-insensitive)
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .single();

    if (userError || !user) {
        return notFound();
    }

    // 2. Fetch User Updates (Approved only)
    const { data: updates, error: updatesError } = await supabase
        .from('user_updates')
        .select('*')
        .eq('user_id', user.id)
        .eq('review_status', 'approved')
        .order('post_day_utc', { ascending: false });

    const safeUpdates = updates || [];
    const totalShips = user.total_ships || safeUpdates.length;
    const displayProfile = user;

    // 3. Calculate Rank
    const { count: higherStreakCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gt('current_streak', user.current_streak);

    const rank = (higherStreakCount || 0) + 1;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pt-4 pb-8 px-4 sm:px-6">

            <ProfileHeader
                initialProfile={displayProfile}
            />

            <div className="w-full h-px bg-border/60" />

            {/* Minimalist Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Global Rank (was Current Streak) */}
                <div className="col-span-2 md:col-span-1 p-6 rounded-3xl bg-card border border-border/50 flex flex-col justify-between group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap size={16} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wider">Global Rank</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-black tracking-tighter text-foreground block">
                            #{rank}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Current Streak: {user.current_streak} days</span>
                    </div>
                </div>

                {/* 2. Longest Streak */}
                <div className="p-6 rounded-3xl bg-card border border-border/50 flex flex-col justify-between group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy size={16} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wider">Metric Best</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-black tracking-tighter text-foreground block">
                            {user.longest_streak}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Days High</span>
                    </div>
                </div>

                {/* 3. Total Posts (Twitter) */}
                <div className="p-6 rounded-3xl bg-card border border-border/50 flex flex-col justify-between group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart2 size={16} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Posts</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-black tracking-tighter text-foreground block">
                            {(user.twitter_tweets || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Lifetime Tweets</span>
                    </div>
                </div>

                {/* 4. Social Impact (Followers) */}
                <div className="p-6 rounded-3xl bg-card border border-border/50 flex flex-col justify-between group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <XIcon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Audience</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-black tracking-tighter text-foreground block">
                            {(user.twitter_followers || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Followers</span>
                    </div>
                </div>
            </div>

            {/* Execution History (Heatmap) */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                        <Calendar className="text-primary" size={24} />
                        Execution History
                    </h2>
                </div>

                <div className="space-y-12">
                    <div className="p-6 border border-border rounded-3xl bg-card/50 shadow-sm">
                        <ActivityHeatmap updates={safeUpdates} />
                    </div>
                    <ProgressFeed updates={safeUpdates} />
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
