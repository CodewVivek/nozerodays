"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Save, Plus, ArrowUp, ArrowUpRight, Loader2, Check, X, Trash2, CheckCircle, LayoutDashboard, UserCheck, Users, Megaphone, Menu, ExternalLink, BarChart3, TrendingUp as TrendingUpIcon, Calendar, Clock, Eye, ViewOff } from 'lucide-react';
import { ADMIN_HANDLES, ADMIN_EMAIL } from '../lib/constants';
import { VerifiedBadge } from './Icons';

const TABS = {
    OVERVIEW: 'overview',
    APPROVALS: 'approvals',
    BUILDERS: 'builders',
    SPONSORS: 'sponsors'
};

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUpdates, setPendingUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // userId or updateId
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [sponsors, setSponsors] = useState([]);
    const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsersCount: 0,
        pendingUpdatesCount: 0,
        activeToday: 0,
        totalUpdates: 0,
        recentGrowth: 0
    });

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        setAuthLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const handle = session.user.user_metadata?.user_name || session.user.user_metadata?.preferred_username;
            const email = session.user.email || session.user.user_metadata?.email;

            if (ADMIN_HANDLES.includes(handle) || email === ADMIN_EMAIL) {
                setIsAdmin(true);
                fetchInitialData();
            } else {
                setIsAdmin(false);
            }
        }
        setAuthLoading(false);
    };

    const handleAdminLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: window.location.origin
            }
        });
    };

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([
            fetchUsers(),
            fetchSponsors(),
            fetchPendingUpdates(),
            calculateStats()
        ]);
        setLoading(false);
    };

    const calculateStats = async () => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();

        const [usersReq, pendingUpdatesReq, activeTodayReq, totalUpdatesReq, recentUsersReq] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('user_updates').select('*', { count: 'exact', head: true }).eq('review_status', 'pending'),
            supabase.from('user_updates').select('user_id', { count: 'exact', head: false }).eq('review_status', 'approved').gt('created_at', twentyFourHoursAgo),
            supabase.from('user_updates').select('*', { count: 'exact', head: true }).eq('review_status', 'approved'),
            supabase.from('users').select('*', { count: 'exact', head: true }).gt('created_at', sevenDaysAgo)
        ]);

        // Count unique active users today
        const uniqueActive = new Set(activeTodayReq.data?.map(u => u.user_id)).size;




        setStats({
            totalUsers: usersReq.count || 0,
            pendingUpdatesCount: pendingUpdatesReq.count || 0,
            activeToday: uniqueActive,
            totalUpdates: totalUpdatesReq.count || 0,
            recentGrowth: recentUsersReq.count || 0
        });
    };


    const fetchSponsors = async () => {
        const { data } = await supabase
            .from('sponsors')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setSponsors(data);
    };

    const fetchPendingUpdates = async () => {
        const { data } = await supabase
            .from('user_updates')
            .select('*, users(username, avatar_url, display_name)')
            .eq('review_status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setPendingUpdates(data);
    };

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setPendingUsers(data.filter(u => u.status === 'pending'));
            setApprovedUsers(data.filter(u => u.status === 'approved'));
        }
    };

    // --- Actions ---

    const handleApproveUser = async (userId, initialStreak) => {
        setActionLoading(userId);
        try {
            // Try secure RPC first
            const { error: rpcError } = await supabase.rpc('approve_user', {
                target_user_id: userId,
                initial_streak: parseInt(initialStreak || 0)
            });

            if (rpcError) throw rpcError;

            // Update local state
            const user = pendingUsers.find(u => u.id === userId);
            if (user) {
                setPendingUsers(prev => prev.filter(u => u.id !== userId));
                setApprovedUsers(prev => [{ ...user, status: 'approved', current_streak: initialStreak }, ...prev]);
                // Assuming showToast is defined elsewhere, if not, this will cause an error.
                // For now, we'll just log.
                console.log(`User approved! Streak set to ${initialStreak}`);
            }
        } catch (error) {
            console.error("Approval error:", error);
            // Assuming showToast is defined elsewhere.
            // For now, we'll just log.
            console.error(`Failed to approve: ${error.message}`);
        } finally { setActionLoading(null); }
    };

    const handleApproveUpdate = async (update) => {
        setActionLoading(update.id);
        try {
            // 1. Mark update as approved
            const { error: updateError } = await supabase
                .from('user_updates')
                .update({ review_status: 'approved', reviewed_at: new Date().toISOString() })
                .eq('id', update.id);
            if (updateError) throw updateError;

            // 2. Increment streak
            const user = [...approvedUsers, ...pendingUsers].find(u => u.id === update.user_id);
            if (user) {
                const newStreak = (user.current_streak || 0) + 1;
                const newLongest = Math.max(newStreak, user.longest_streak || 0);

                await supabase.from('users').update({
                    current_streak: newStreak,
                    longest_streak: newLongest,
                    last_streak_day_utc: update.post_day_utc
                }).eq('id', user.id);
            }
            await fetchInitialData();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleRejectUpdate = async (id) => {
        setActionLoading(id);
        try {
            await supabase.from('user_updates').update({ review_status: 'rejected' }).eq('id', id);
            await fetchPendingUpdates();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleUpdateStreak = async (user, change) => {
        setActionLoading(user.id);
        const newStreak = Math.max(0, (user.current_streak || 0) + change);

        try {
            // Try secure RPC first
            const { error: rpcError } = await supabase.rpc('update_streak', {
                target_user_id: user.id,
                new_streak: newStreak
            });

            if (rpcError) {
                console.warn("RPC update_streak failed, falling back to direct update:", rpcError);
                // Fallback: Direct Update (Might fail if RLS is strict, but better than nothing)
                const newLongest = Math.max(newStreak, user.longest_streak || 0);
                const { error: directError } = await supabase.from('users').update({
                    current_streak: newStreak,
                    longest_streak: newLongest,
                    last_streak_day_utc: new Date().toISOString().split('T')[0]
                }).eq('id', user.id);

                if (directError) throw directError;
            }

            await fetchUsers();
        } catch (e) {
            console.error(e);
            alert("Failed to update streak. Make sure you have run the database-migrations.sql in Supabase!");
        }
        finally { setActionLoading(null); }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Delete user?")) return;
        setActionLoading(userId);
        try {
            await supabase.from('users').delete().eq('id', userId);
            await fetchUsers();
        } finally { setActionLoading(null); }
    };

    const handleToggleVerification = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            const { error } = await supabase.rpc('toggle_verification', {
                target_user_id: userId,
                new_status: !currentStatus
            });
            if (error) throw error;
            await fetchUsers();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleToggleHidden = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            // Optimistic update
            const { error } = await supabase.from('users').update({ is_hidden: !currentStatus }).eq('id', userId);
            if (error) throw error;
            await fetchUsers();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleSponsorReject = async (id) => {
        setActionLoading(id);
        try {
            await supabase.from('sponsors').update({ status: 'rejected' }).eq('id', id);
            await fetchSponsors();
        } finally { setActionLoading(null); }
    };

    const handleSponsorDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this sponsor request completely?")) return;
        setActionLoading(id);
        try {
            await supabase.from('sponsors').delete().eq('id', id);
            await fetchSponsors();
        } finally { setActionLoading(null); }
    };

    const handleSponsorApprove = async (id) => {
        setActionLoading(id);
        try {
            await supabase.from('sponsors').update({ status: 'active' }).eq('id', id);
            await fetchSponsors();
        } finally { setActionLoading(null); }
    };

    // --- UI Helpers ---
    const toggleSelectUser = (id) => {
        const next = new Set(selectedUsers);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedUsers(next);
    };

    const filterFn = u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.display_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (authLoading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Verifying Authority...</p>
            </div>
        </div>
    );

    if (!isAdmin) {
        return (
            <div className="max-w-md mx-auto py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto rotate-12 transition-transform hover:rotate-0">
                    <X size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Access Denied</h1>
                    <p className="text-muted-foreground font-medium">This territory is restricted to NoZeroDays Admins.</p>
                </div>
                <button
                    onClick={handleAdminLogin}
                    className="group relative px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Sign in with X <ArrowUpRight size={18} />
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>
        );
    }

    const navigation = [
        { id: TABS.OVERVIEW, label: 'Overview', icon: LayoutDashboard },
        { id: TABS.APPROVALS, label: 'Approvals', icon: UserCheck, count: pendingUsers.length + pendingUpdates.length },
        { id: TABS.BUILDERS, label: 'Builders', icon: Users },
        { id: TABS.SPONSORS, label: 'Sponsors', icon: Megaphone, count: sponsors.filter(s => s.status === 'pending_payment').length }
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50">
                <h1 className="text-xl font-black italic">NZD Admin</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-xl">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-0 z-40 lg:relative lg:z-auto transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-72 bg-card border-r border-border p-6 flex flex-col gap-8
            `}>
                <div className="hidden lg:block space-y-1">
                    <h1 className="text-2xl font-black italic tracking-tighter">Admin Console</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground opacity-50">v2.0 Premium Hub</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`
                                w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 font-bold
                                ${activeTab === item.id
                                    ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </div>
                            {item.count > 0 && (
                                <span className={`
                                    px-2 py-0.5 rounded-lg text-[10px] font-black
                                    ${activeTab === item.id ? 'bg-background/20 text-background' : 'bg-primary/10 text-primary'}
                                `}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Logged in as</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30" />
                        <span className="text-sm font-bold truncate">Admin Hub</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-h-[calc(100vh-64px)] lg:max-h-screen">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header with Search */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight">{navigation.find(n => n.id === activeTab).label}</h2>
                            <p className="text-muted-foreground font-medium mt-1">Manage and monitor NoZeroDays ecosystem.</p>
                        </div>
                        {activeTab === TABS.BUILDERS && (
                            <div className="relative w-full sm:w-80 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or @handle..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Views */}
                    {activeTab === TABS.OVERVIEW && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <StatCard label="Total Builders" value={stats.totalUsers} icon={Users} trend={stats.recentGrowth} suffix="new this week" color="text-blue-500" />
                                <StatCard label="Active Today" value={stats.activeToday} icon={BarChart3} trend={Math.round((stats.activeToday / (stats.totalUsers || 1)) * 100)} suffix="% engagement" color="text-green-500" />
                                <StatCard label="Total Progress" value={stats.totalUpdates} icon={CheckCircle} color="text-purple-500" />
                                <StatCard label="Queue" value={pendingUsers.length + pendingUpdates.length} icon={Clock} color="text-orange-500" />
                            </div>

                            {/* Recent Activity / Charts Placeholder */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="p-8 bg-card border border-border rounded-3xl shadow-sm space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2 italic">
                                        <TrendingUpIcon size={20} className="text-primary" />
                                        Platform Growth
                                    </h3>
                                    <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-border pb-2">
                                        {[40, 65, 45, 90, 85, 60, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary/20 rounded-t-xl transition-all hover:bg-primary/40 relative group cursor-pointer" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded-md text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {h}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>

                                <div className="p-8 bg-card border border-border rounded-3xl shadow-sm space-y-6 flex flex-col justify-center text-center">
                                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Megaphone size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black italic tracking-tight uppercase">Premium Ready</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">Your platform is scaling. Monitor streaks and social power from this centralized hub.</p>
                                    <div className="pt-6 flex gap-4 justify-center">
                                        <button onClick={() => setActiveTab(TABS.APPROVALS)} className="px-6 py-3 bg-foreground text-background rounded-xl font-bold text-sm">Review Queue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === TABS.APPROVALS && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                            {pendingUpdates.length > 0 && (
                                <Section title="Pending Proof of Work" color="bg-blue-500">
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-border/50">
                                            {pendingUpdates.map(update => (
                                                <tr key={update.id} className="group hover:bg-muted/30">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={update.users?.avatar_url} className="w-10 h-10 rounded-full border border-border shadow-sm" />
                                                            <div>
                                                                <div className="font-bold text-sm tracking-tight">{update.users?.display_name || update.users?.username}</div>
                                                                <a href={update.post_url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 group/link font-bold">
                                                                    View 𝕏 Update <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-3 font-bold">
                                                            <button onClick={() => handleRejectUpdate(update.id)} disabled={actionLoading === update.id} className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm">Reject</button>
                                                            <button onClick={() => handleApproveUpdate(update)} disabled={actionLoading === update.id} className="bg-primary text-background px-6 py-2 rounded-xl font-black shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 text-sm">
                                                                {actionLoading === update.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />} Approve
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {pendingUsers.length > 0 && (
                                <Section title="New Builder Requests" color="bg-yellow-500">
                                    <div className="divide-y divide-border/50">
                                        {pendingUsers.filter(filterFn).map(user => (
                                            <div key={user.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <img src={user.avatar_url} className="w-12 h-12 rounded-2xl border-2 border-border shadow-sm" />
                                                    <div>
                                                        <h4 className="font-black text-lg">@{user.username}</h4>
                                                        <a href={`https://x.com/${user.username}`} target="_blank" className="text-xs text-primary flex items-center gap-1 font-bold hover:underline">
                                                            Verify 𝕏 Profile <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                                <ApproveUserRow user={user} onApprove={handleApproveUser} onReject={() => handleDeleteUser(user.id)} loading={actionLoading === user.id} />
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {pendingUpdates.length === 0 && pendingUsers.length === 0 && (
                                <div className="py-20 text-center space-y-4 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto"><CheckCircle size={32} /></div>
                                    <p className="text-lg font-black italic tracking-tight opacity-50">Nothing to review right now.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === TABS.BUILDERS && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                            <Section title={`Verified Builders (${approvedUsers.length})`} color="bg-green-500">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                                <th className="px-8 py-4">Builder</th>
                                                <th className="px-8 py-4 text-center">Streak</th>
                                                <th className="px-8 py-4 text-right">Controls</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {approvedUsers.filter(filterFn).map(user => (
                                                <tr key={user.id} className="group hover:bg-muted/20 transition-colors">
                                                    <td className="px-8 py-5 flex items-center gap-4">
                                                        <img src={user.avatar_url} className="w-10 h-10 rounded-full border border-border shadow-sm group-hover:border-primary/50 transition-colors" />
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-black tracking-tight">{user.display_name || user.username}</span>
                                                                {(user.is_verified || user.is_admin) && <VerifiedBadge className="w-4 h-4" />}
                                                            </div>
                                                            <a href={`https://x.com/${user.username}`} target="_blank" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                                                                @{user.username} <ArrowUpRight size={10} />
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className="text-xl font-black text-primary group-hover:scale-110 inline-block transition-transform">{user.current_streak}</span>
                                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Days</p>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleToggleHidden(user.id, user.is_hidden)} className={`p-2 rounded-xl transition-all ${user.is_hidden ? 'bg-zinc-800 text-zinc-400' : 'bg-muted text-muted-foreground hover:text-foreground'}`} title={user.is_hidden ? "Unhide User" : "Hide from Leaderboard"}>
                                                                {user.is_hidden ? <ViewOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                            <button onClick={() => handleToggleVerification(user.id, user.is_verified)} className={`p-2 rounded-xl transition-all ${user.is_verified ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground hover:text-blue-500'}`} title="Toggle Verified Badge"><VerifiedBadge className="w-5 h-5" /></button>
                                                            <button onClick={() => handleUpdateStreak(user, -1)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-xl"><ArrowUp size={18} className="rotate-180" /></button>
                                                            <button onClick={() => handleUpdateStreak(user, 1)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl"><ArrowUp size={18} /></button>
                                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Section>
                        </div>
                    )}

                    {activeTab === TABS.SPONSORS && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                            {/* Pending Requests */}
                            <Section title="New Requests (Check Payment)" color="bg-yellow-500">
                                <div className="divide-y divide-border/50">
                                    {sponsors.filter(s => s.status === 'pending_payment').map(s => (
                                        <div key={s.id} className="p-8 flex items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                {s.image_url && <img src={s.image_url} className="w-16 h-16 rounded-xl object-cover border border-border" />}
                                                <div className="space-y-1">
                                                    <h4 className="text-xl font-black italic tracking-tight">{s.title}</h4>
                                                    <a href={s.target_url} target="_blank" className="text-xs text-primary hover:underline">{s.target_url}</a>
                                                    <p className="text-sm text-muted-foreground max-w-lg mt-2">{s.description}</p>
                                                    <div className="text-[10px] font-bold uppercase text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded inline-block">Pending Dodo Check</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleSponsorDelete(s.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"><Trash2 size={20} /></button>
                                                <button onClick={() => handleSponsorReject(s.id)} className="px-6 py-4 text-red-500 border border-red-500/20 hover:bg-red-500/5 rounded-2xl font-bold uppercase text-sm">Reject</button>
                                                <button onClick={() => handleSponsorApprove(s.id)} className="px-8 py-4 bg-primary text-background rounded-2xl font-black tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">Activate (Paid)</button>
                                            </div>
                                        </div>
                                    ))}
                                    {sponsors.filter(s => s.status === 'pending_payment').length === 0 && (
                                        <div className="p-12 text-center opacity-40 italic font-medium">No pending requests.</div>
                                    )}
                                </div>
                            </Section>

                            {/* Active Sponsors */}
                            <Section title="Active Campaigns" color="bg-purple-500">
                                <div className="divide-y divide-border/50">
                                    {sponsors.filter(s => s.status === 'active').map(s => (
                                        <div key={s.id} className="p-8 flex items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                {s.image_url && <img src={s.image_url} className="w-16 h-16 rounded-xl object-cover border border-border" />}
                                                <div className="space-y-1">
                                                    <h4 className="text-xl font-black italic tracking-tight">{s.title}</h4>
                                                    <p className="text-sm text-muted-foreground max-w-lg">{s.description}</p>
                                                    <div className="text-[10px] font-bold uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded inline-block">Live on Site</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleSponsorDelete(s.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors" title="Delete"><Trash2 size={20} /></button>
                                                <button onClick={() => handleSponsorReject(s.id)} className="px-6 py-4 border border-border hover:bg-muted rounded-2xl font-bold uppercase text-xs text-muted-foreground">Deactivate</button>
                                            </div>
                                        </div>
                                    ))}
                                    {sponsors.filter(s => s.status === 'active').length === 0 && (
                                        <div className="p-12 text-center opacity-40 italic font-medium">No active sponsors.</div>
                                    )}
                                </div>
                            </Section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// UI Components
const Section = ({ title, children, color }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 italic uppercase">
            <span className={`w-1.5 h-8 rounded-full ${color}`}></span>
            {title}
        </h2>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-foreground/5">{children}</div>
    </div>
);

const StatCard = ({ label, value, icon: Icon, trend, suffix, color }) => (
    <div className="p-8 bg-card border border-border rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
        <div className="relative z-10 space-y-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-current/10 border border-current/20`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-4xl font-black tracking-tighter">{value}</h4>
                    {trend !== undefined && (
                        <span className="text-[10px] font-black text-green-500 flex items-center bg-green-500/10 px-1.5 py-0.5 rounded-lg">
                            +{trend}{suffix && <span className="ml-1 opacity-60 normal-case font-medium">{suffix}</span>}
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const ApproveUserRow = ({ user, onApprove, onReject, loading }) => {
    const [streak, setStreak] = useState('');
    return (
        <div className="flex items-center justify-end gap-3">
            <input type="number" placeholder="Initial Streak" className="w-[120px] bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold placeholder:font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all" value={streak} onChange={e => setStreak(e.target.value)} />
            <button onClick={() => onApprove(user.id, streak)} disabled={loading} className="bg-primary text-background px-6 py-2.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">Approve</button>
            <button onClick={onReject} disabled={loading} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><X size={20} /></button>
        </div>
    );
};

export default AdminDashboard;
