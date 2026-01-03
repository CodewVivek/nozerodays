import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Breadcrumbs from '../../components/Breadcrumbs';
import ActivityHeatmap from '../../components/ActivityHeatmap';
import ShipFeed from '../../components/ShipFeed';
import ShareStreakButton from '../../components/ShareStreakButton';
import { Trophy, TrendingUp, Zap, Calendar } from 'lucide-react';
// ... (existing imports)

// ...


// Force dynamic rendering since we depend on params
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    // Wait for params
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
    // Wait for params
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

    // Calculate derived stats
    // (In a real app, 'total_ships' might be a column, but we can also count here)
    const totalShips = user.total_ships || safeUpdates.length;

    // Avatar Logic: Use DB url or DiceBear fallback (Shapes for purely abstract, modern look)
    const avatarSource = user.avatar_url || `https://api.dicebear.com/9.x/shapes/svg?seed=${user.username}`;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 py-12 px-4 sm:px-6">

            {/* Header Section */}
            <div>
                <Breadcrumbs items={[
                    { label: 'profile' },
                    { label: user.username, href: `/${user.username}` }
                ]} />

                <div className="flex flex-col md:flex-row gap-8 items-start mt-6">
                    {/* Avatar */}
                    <div className="relative group flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted/10">
                            <img src={avatarSource} alt={user.username} className="w-full h-full object-cover" />
                        </div>
                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full" title="Active Builder"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 pt-2">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-foreground">{user.display_name || user.username}</h1>
                            <p className="text-lg text-muted-foreground font-medium">@{user.username}</p>
                        </div>

                        {user.bio && <p className="text-muted-foreground leading-relaxed max-w-xl text-sm">{user.bio}</p>}

                        <div className="flex flex-wrap gap-3 pt-2">
                            <ShareStreakButton username={user.username} streak={user.current_streak} />

                            <a
                                href={`https://x.com/${user.username}`}
                                target="_blank"
                                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/10 text-foreground font-semibold text-sm transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                X (Twitter)
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Stats Grid - Clean & Minimal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    label="Current Streak"
                    value={user.current_streak}
                    suffix="days"
                    indicatorColor="bg-orange-500"
                />
                <StatCard
                    label="Longest Streak"
                    value={user.longest_streak}
                    suffix="days"
                    indicatorColor="bg-blue-500"
                />
                <StatCard
                    label="Total Ships"
                    value={totalShips}
                    suffix="updates"
                    indicatorColor="bg-green-500"
                />
            </div>

            {/* Consistency Heatmap */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="text-foreground" size={20} />
                        Consistency Grid
                    </h2>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <ActivityHeatmap userUpdates={safeUpdates} />
                </div>
            </div>

            {/* History Feed */}
            <div className="max-w-3xl">
                <ShipFeed updates={safeUpdates} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, suffix, indicatorColor }) => (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between h-32 hover:border-foreground/20 transition-colors cursor-default">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <div>
            <span className="text-4xl font-black tracking-tighter text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground font-medium ml-1">{suffix}</span>
        </div>
    </div>
);

export default ProfilePage;
