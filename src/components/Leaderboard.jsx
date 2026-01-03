"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { Trophy, TrendingUp, Calendar, Hash, ChevronDown, Loader2, Timer } from 'lucide-react';

const STREAK_EXAMPLES = [
    { id: '1', username: 'pixelforge', current_streak: 21, longest_streak: 21, last_streak_day_utc: '2026-01-01' },
    { id: '2', username: 'codepilot', current_streak: 18, longest_streak: 18, last_streak_day_utc: '2026-01-01' },
    { id: '3', username: 'buildmaster', current_streak: 34, longest_streak: 34, last_streak_day_utc: '2026-01-01' },
    { id: '4', username: 'devvoyager', current_streak: 27, longest_streak: 27, last_streak_day_utc: '2026-01-01' },
    { id: '5', username: 'launchloop', current_streak: 9, longest_streak: 9, last_streak_day_utc: '2026-01-01' },
    { id: '6', username: 'stackrunner', current_streak: 12, longest_streak: 12, last_streak_day_utc: '2026-01-01' },
    { id: '7', username: 'neonmaker', current_streak: 12, longest_streak: 12, last_streak_day_utc: '2026-01-01' },
    { id: '8', username: 'asyncartist', current_streak: 12, longest_streak: 12, last_streak_day_utc: '2026-01-01' },
    { id: '9', username: 'debugcraft', current_streak: 12, longest_streak: 12, last_streak_day_utc: '2026-01-01' },
    { id: '10', username: 'shipstream', current_streak: 12, longest_streak: 12, last_streak_day_utc: '2026-01-01' },
    { id: '11', username: 'bytefounder', current_streak: 31, longest_streak: 31, last_streak_day_utc: '2026-01-01' },
    { id: '12', username: 'makerorbit', current_streak: 7, longest_streak: 7, last_streak_day_utc: '2026-01-01' },
    { id: '13', username: 'streaksmith', current_streak: 25, longest_streak: 25, last_streak_day_utc: '2026-01-01' },
    { id: '14', username: 'uxnomad', current_streak: 16, longest_streak: 16, last_streak_day_utc: '2026-01-01' },
    { id: '15', username: 'indiekernel', current_streak: 29, longest_streak: 29, last_streak_day_utc: '2026-01-01' },
    { id: '16', username: 'deploydawn', current_streak: 14, longest_streak: 14, last_streak_day_utc: '2026-01-01' },
    { id: '17', username: 'sprintpilot', current_streak: 22, longest_streak: 22, last_streak_day_utc: '2026-01-01' },
    { id: '18', username: 'apollohacker', current_streak: 11, longest_streak: 11, last_streak_day_utc: '2026-01-01' },
    { id: '19', username: 'lunarbuilder', current_streak: 19, longest_streak: 19, last_streak_day_utc: '2026-01-01' },
    { id: '20', username: 'circuitdream', current_streak: 33, longest_streak: 33, last_streak_day_utc: '2026-01-01' }
];

const PAGE_SIZE = 50;

const Leaderboard = ({ searchQuery = "" }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isMock, setIsMock] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Reset page and fetch when search query changes
        setPage(0);
        fetchLeaderboard(0);
    }, [searchQuery]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nowUtc = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );

            const endOfDayUtc = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + 1,
                0, 0, 0
            );

            const difference = endOfDayUtc - nowUtc;

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, []);

    const fetchLeaderboard = async (pageNum) => {
        if (pageNum === 0) setLoading(true);
        else setLoadingMore(true);

        try {
            let query = supabase
                .from('users')
                .select('*')
                .eq('status', 'approved');

            // Apply search filter if exists
            if (searchQuery && searchQuery.trim() !== "") {
                const term = searchQuery.trim();
                query = query.or(`username.ilike.%${term}%,display_name.ilike.%${term}%`);
            }

            const { data, error } = await query
                .order('current_streak', { ascending: false })
                .order('longest_streak', { ascending: false })
                .order('created_at', { ascending: true })
                .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                if (pageNum === 0) setUsers(data);
                else setUsers(prev => [...prev, ...data]);

                setHasMore(data.length === PAGE_SIZE);
                setIsMock(false);
            } else if (pageNum === 0) {
                // If searching and no results, don't show mock data, show empty
                if (searchQuery.trim() !== "") {
                    setUsers([]);
                    setHasMore(false);
                    setIsMock(false);
                } else {
                    const sortedMock = [...STREAK_EXAMPLES].sort((a, b) => b.current_streak - a.current_streak);
                    setUsers(sortedMock);
                    setHasMore(false);
                    setIsMock(true);
                }
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.warn("DB not ready or error:", e);
            if (pageNum === 0 && (!searchQuery || searchQuery === "")) {
                const sortedMock = [...STREAK_EXAMPLES].sort((a, b) => b.current_streak - a.current_streak);
                setUsers(sortedMock);
                setHasMore(false);
                setIsMock(true);
            } else {
                setUsers([]); // Clear on error if searching
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchLeaderboard(nextPage);
    };

    const getTimerColors = () => {
        const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;
        if (totalMinutes < 30) return "text-red-500 bg-red-500/10 border-red-500/20";
        if (totalMinutes < 120) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-accent bg-accent/10 border-accent/20";
    };

    const timerClasses = getTimerColors();

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}-${month}-${year.slice(2)}`;
        } catch (e) {
            return dateString;
        }
    };

    const formatNumber = (num) => num.toString().padStart(2, '0');

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Skeleton Header */}
                <div className="bg-card border border-border rounded-3xl shadow-sm relative overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-card/50">
                        <div className="h-8 w-40 bg-muted/20 rounded-lg animate-pulse" />
                        <div className="h-8 w-24 bg-muted/20 rounded-full animate-pulse" />
                    </div>

                    {/* Skeleton Table */}
                    <div className="overflow-x-auto bg-transparent">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-muted-foreground text-[13px] font-medium border-b border-border/30">
                                    <th className="px-6 py-5 w-16 text-center">#</th>
                                    <th className="px-6 py-5 text-left">Builder</th>
                                    <th className="px-6 py-5 text-left">Streak</th>
                                    <th className="px-6 py-5 text-left hidden sm:table-cell">Last Update</th>
                                    <th className="px-6 py-5 text-left hidden md:table-cell">Best</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {[...Array(10)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-6 text-center">
                                            <div className="w-6 h-6 mx-auto bg-muted/20 rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted/20 animate-pulse flex-shrink-0" />
                                                <div className="space-y-2">
                                                    <div className="w-32 h-4 bg-muted/20 rounded-md animate-pulse" />
                                                    <div className="w-20 h-3 bg-muted/10 rounded-md animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="w-8 h-6 mx-auto bg-muted/20 rounded-md animate-pulse" />
                                        </td>
                                        <td className="px-6 py-6 text-center hidden sm:table-cell">
                                            <div className="w-20 h-4 mx-auto bg-muted/20 rounded-md animate-pulse" />
                                        </td>
                                        <td className="px-6 py-6 text-center hidden md:table-cell">
                                            <div className="w-12 h-6 bg-muted/20 rounded-full animate-pulse" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl shadow-sm relative">
                <div className="p-6 border-b border-border flex justify-between items-center bg-card/50 rounded-t-3xl">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Trophy className="text-yellow-500" size={24} />
                        Leaderboard
                    </h2>
                    <div className="flex items-center gap-3">
                        <div
                            className={`group/timer flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-help relative transition-colors ${timerClasses}`}
                        >
                            <Timer size={14} />
                            <span className="text-[11px] font-black font-mono">
                                {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70 ml-0.5">UTC</span>

                            {/* Hover Tooltip - Styled */}
                            <div className="absolute top-full right-0 mt-3 w-64 p-3 bg-zinc-900 border border-border rounded-2xl text-[11px] text-zinc-300 font-medium leading-relaxed opacity-0 invisible group-hover/timer:opacity-100 group-hover/timer:visible transition-all shadow-2xl z-50 pointer-events-none">
                                <p className="mb-1 text-white font-bold text-xs">Why the Timer?</p>
                                Streaks are calculated every 24h based on your 𝕏 updates. Submit your post before this deadline to keep your streak alive!
                                <div className="absolute bottom-full right-6 -mb-1 border-4 border-transparent border-b-zinc-900"></div>
                            </div>
                        </div>
                        {isMock && (
                            <span className="px-3 py-1.5 bg-border/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Examples
                            </span>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto bg-transparent rounded-b-3xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-muted-foreground text-[13px] font-medium border-b border-border/30">
                                <th className="px-6 py-5 w-16 text-center">#</th>
                                <th className="px-6 py-5 text-left">Builder</th>
                                <th className="px-6 py-5 text-left">Streak</th>
                                <th className="px-6 py-5 text-left hidden sm:table-cell">Last Update</th>
                                <th className="px-6 py-5 text-left hidden md:table-cell">Best</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.map((user, index) => (
                                <tr key={user.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                    <td className="px-6 py-6 text-center">
                                        {index === 0 && <span className="text-2xl">🥇</span>}
                                        {index === 1 && <span className="text-2xl">🥈</span>}
                                        {index === 2 && <span className="text-2xl">🥉</span>}
                                        {index > 2 && <span className="text-muted-foreground font-mono text-sm">{index + 1}</span>}
                                    </td>
                                    <td className="px-6 py-6">
                                        <Link href={`/${user.username}`} className="flex items-center gap-3 group/link">
                                            <div className="w-10 h-10 rounded-full bg-border flex-shrink-0 overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                                                <img
                                                    src={user.avatar_url || `https://api.dicebear.com/9.x/shapes/svg?seed=${user.username}`}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground group-hover/link:text-primary transition-colors">
                                                    {user.display_name || user.username}
                                                </div>
                                                <div className="text-xs text-muted-foreground">@{user.username}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl font-black text-foreground">{user.current_streak}</span>
                                            {user.current_streak > 0 && (
                                                <span className="flex items-center text-[10px] font-bold text-accent uppercase">
                                                    <TrendingUp size={10} className="mr-0.5" />
                                                    Up
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center hidden sm:table-cell">
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(user.last_streak_day_utc)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center hidden md:table-cell">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-border/30 rounded-full text-xs font-bold text-muted-foreground">
                                            <Hash size={12} />
                                            {user.longest_streak}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 px-8 py-4 bg-card border border-border rounded-2xl font-bold text-foreground hover:bg-border/20 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Loading...
                            </>
                        ) : (
                            <>
                                <ChevronDown size={20} />
                                Load More Builders
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
