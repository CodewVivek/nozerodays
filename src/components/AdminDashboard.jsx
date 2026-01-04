"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Save, Plus, ArrowUp, ArrowUpRight, Loader2, Check, X, Trash2 } from 'lucide-react';
import { ADMIN_HANDLES } from '../lib/constants';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUpdates, setPendingUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // userId or updateId
    const [selectedUsers, setSelectedUsers] = useState(new Set()); // Set of selected User IDs
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        setAuthLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const handle = session.user.user_metadata?.user_name || session.user.user_metadata?.preferred_username;
            if (ADMIN_HANDLES.includes(handle)) {
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
            provider: 'x',
            options: { redirectTo: window.location.href }
        });
    };

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([
            fetchUsers(),
            fetchSponsors(),
            fetchPendingUpdates()
        ]);
        setLoading(false);
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
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'approved',
                    current_streak: parseInt(initialStreak || 0),
                    longest_streak: parseInt(initialStreak || 0),
                    last_streak_day_utc: new Date().toISOString().split('T')[0]
                })
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
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
        const newLongest = Math.max(newStreak, user.longest_streak || 0);

        try {
            await supabase.from('users').update({
                current_streak: newStreak,
                longest_streak: newLongest,
                last_streak_day_utc: new Date().toISOString().split('T')[0]
            }).eq('id', user.id);
            await fetchUsers();
        } catch (e) { console.error(e); }
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

    if (authLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto mb-4" />Verifying Admin...</div>;

    if (!isAdmin) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto"><X size={32} /></div>
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">This dashboard is restricted to admins.</p>
                <button onClick={handleAdminLogin} className="bg-foreground text-background px-6 py-3 rounded-xl font-bold">Sign in with X</button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black italic tracking-tight">Admin Console</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search builders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* PENDING UPDATES */}
            {pendingUpdates.length > 0 && (
                <Section title={`Pending Ships (${pendingUpdates.length})`} color="bg-blue-500">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-border/50">
                            {pendingUpdates.map(update => (
                                <tr key={update.id} className="group hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={update.users?.avatar_url} className="w-8 h-8 rounded-full border border-border" />
                                            <div>
                                                <div className="font-bold text-sm tracking-tight">{update.users?.display_name || update.users?.username}</div>
                                                <a href={update.post_url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                                                    View Post <ArrowUpRight size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleRejectUpdate(update.id)} disabled={actionLoading === update.id} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><X size={18} /></button>
                                            <button onClick={() => handleApproveUpdate(update)} disabled={actionLoading === update.id} className="bg-primary text-background px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                                                {actionLoading === update.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            )}

            {/* PENDING BUILDERS */}
            {pendingUsers.length > 0 && (
                <Section title={`New Builders (${pendingUsers.length})`} color="bg-yellow-500">
                    <table className="w-full text-left border-collapse text-sm">
                        <tbody className="divide-y divide-border/50">
                            {pendingUsers.filter(filterFn).map(user => (
                                <tr key={user.id} className="group hover:bg-muted/30">
                                    <td className="px-6 py-4 font-bold tracking-tight">@{user.username}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ApproveUserRow user={user} onApprove={handleApproveUser} onReject={() => handleDeleteUser(user.id)} loading={actionLoading === user.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            )}

            {/* ACTIVE BUILDERS */}
            <Section title={`Active Leaderboard (${approvedUsers.length})`} color="bg-green-500">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border">
                            <th className="px-6 py-3">Builder</th>
                            <th className="px-6 py-3 text-center">Streak</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {approvedUsers.filter(filterFn).map(user => (
                            <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-border" />
                                    <span className="font-bold tracking-tight">{user.display_name || user.username}</span>
                                </td>
                                <td className="px-6 py-4 text-center font-black text-primary text-lg">{user.current_streak}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => handleUpdateStreak(user, -1)} disabled={actionLoading === user.id} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-lg"><ArrowUp size={16} className="rotate-180" /></button>
                                        <button onClick={() => handleUpdateStreak(user, 1)} disabled={actionLoading === user.id} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><ArrowUp size={16} /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} disabled={actionLoading === user.id} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg ml-2"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            {/* SPONSORS */}
            {sponsors.filter(s => s.status !== 'active').length > 0 && (
                <Section title="Sponsor Requests" color="bg-purple-500">
                    <table className="w-full text-left border-collapse text-sm">
                        <tbody className="divide-y divide-border/50">
                            {sponsors.filter(s => s.status !== 'active').map(s => (
                                <tr key={s.id} className="group hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{s.title}</div>
                                        <div className="text-xs text-muted-foreground">{s.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleSponsorApprove(s.id)} className="bg-primary text-background px-4 py-2 rounded-lg font-bold">Approve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            )}
        </div>
    );
};

// UI Components
const Section = ({ title, children, color }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            {title}
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">{children}</div>
    </div>
);

const ApproveUserRow = ({ user, onApprove, onReject, loading }) => {
    const [streak, setStreak] = useState('');
    return (
        <div className="flex items-center justify-end gap-3">
            <input type="number" placeholder="Initial Streak" className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-xs" value={streak} onChange={e => setStreak(e.target.value)} />
            <button onClick={() => onApprove(user.id, streak)} disabled={loading} className="bg-primary text-background px-4 py-2 rounded-lg font-bold text-xs">Approve</button>
            <button onClick={onReject} disabled={loading} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><X size={16} /></button>
        </div>
    );
};

export default AdminDashboard;
