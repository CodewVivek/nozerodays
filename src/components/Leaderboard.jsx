"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { Trophy, TrendingUp, Calendar, Hash, ChevronDown, Loader2, Timer, CheckCircle } from 'lucide-react';
import { XIcon, VerifiedBadge } from './Icons';
import { SkeletonLeaderboard } from './Skeleton';

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
    const [searching, setSearching] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isMock, setIsMock] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Reset page and fetch when search query changes
        setPage(0);
        fetchLeaderboard(0, true);
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

    const fetchLeaderboard = async (pageNum, isSearch = false) => {
        if (pageNum === 0 && !isSearch) setLoading(true);
        if (isSearch) setSearching(true);
        if (pageNum > 0) setLoadingMore(true);

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
            setSearching(false);
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
        if (totalMinutes < 30) return "text-red-600 bg-red-600/10 border-red-600/30";
        if (totalMinutes < 120) return "text-amber-600 bg-amber-600/10 border-amber-600/30";
        return "text-foreground/90 bg-muted/50 border-border/60 shadow-sm";
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

    if (loading) return <SkeletonLeaderboard />;

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl shadow-sm relative">
                <div className="p-6 border-b border-border flex justify-between items-center bg-card/50 rounded-t-3xl">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Trophy className="text-yellow-500" size={24} />
                        Leaderboard
                        {searching && <Loader2 className="animate-spin text-primary ml-2" size={18} />}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div
                            className={`group/timer flex items-center gap-2 px-4 py-2 rounded-full border shadow-md transition-all duration-500 cursor-help relative hover:scale-105 ${timerClasses}`}
                        >
                            <div className="flex items-center gap-1.5">
                                <div className="relative flex items-center justify-center">
                                    <Timer size={14} className="animate-spin-slow" />
                                </div>
                                <span className="text-xs font-black font-mono tracking-wider">
                                    {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
                                </span>
                            </div>

                            {/* Hover Tooltip - Definitive contrast fix */}
                            <div className="absolute top-full right-0 mt-3 w-64 p-5 bg-white dark:bg-[#1d2126] border border-slate-200 dark:border-slate-800 rounded-2xl text-[12px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed opacity-0 invisible group-hover/timer:opacity-100 group-hover/timer:visible transition-all shadow-2xl z-[100] pointer-events-none translate-y-2 group-hover/timer:translate-y-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                                        <XIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-tight">Sync Deadline</p>
                                </div>
                                <p>Streaks are calculated on a rolling 24h UTC cycle. You have a 12-hour grace period after midnight to keep your streak alive!</p>
                                <div className="absolute bottom-full right-8 -mb-1 border-[6px] border-transparent border-b-white dark:border-b-[#1d2126]"></div>
                            </div>
                        </div>
                        {isMock && (
                            <span className="px-3 py-1.5 bg-border/40 text-muted-foreground/60 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-border/20">
                                Samples
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
                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border transition-colors bg-border border-border group-hover:border-primary/50`}>
                                                <img
                                                    src={user.avatar_url?.replace('_normal', '').replace('_bigger', '') || `https://api.dicebear.com/9.x/shapes/svg?seed=${user.username}`}
                                                    alt={user.username}
                                                    className={`w-full h-full object-cover`}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground group-hover/link:text-primary transition-colors flex items-center gap-1">
                                                    {user.display_name || user.username}
                                                    {(user.is_verified || user.is_admin || user.status === 'approved') && (
                                                        <div title="Verified User">
                                                            <VerifiedBadge className="w-3.5 h-3.5 flex-shrink-0" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    @{user.username}
                                                </div>
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
