"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Save, Plus, ArrowUp, ArrowUpRight, Loader2, Check, X, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // userId
    const [selectedUsers, setSelectedUsers] = useState(new Set()); // Set of selected User IDs
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        const { data, error } = await supabase
            .from('sponsors')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setSponsors(data);
    };

    const handleSponsorApprove = async (id) => {
        setActionLoading(id);
        try {
            const { error } = await supabase.from('sponsors').update({ status: 'active' }).eq('id', id);
            if (error) throw error;
            await fetchSponsors();
        } catch (e) { console.error(e); alert("Details in console"); }
        finally { setActionLoading(null); }
    };

    const handleSponsorDelete = async (id) => {
        if (!confirm("Delete this sponsor request?")) return;
        setActionLoading(id);
        try {
            const { error } = await supabase.from('sponsors').delete().eq('id', id);
            if (error) throw error;
            await fetchSponsors();
        } catch (e) { console.error(e); alert("Error deleting"); }
        finally { setActionLoading(null); }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPendingUsers(data.filter(u => u.status === 'pending') || []);
            setApprovedUsers(data.filter(u => u.status === 'approved') || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Bulk Selection Logic
    const toggleSelectUser = (id) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUsers(newSelected);
    };

    const toggleSelectAll = (users) => {
        if (selectedUsers.size === users.length && users.length > 0) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(u => u.id)));
        }
    };

    // Bulk Actions
    const handleBulkAction = async (action) => {
        if (selectedUsers.size === 0) return;
        const count = selectedUsers.size;
        let confirmMsg = "";

        if (action === 'increment') confirmMsg = `Increase streak for ${count} users?`;
        if (action === 'decrement') confirmMsg = `Decrease streak for ${count} users?`;
        if (action === 'delete') confirmMsg = `DELETE ${count} users? This cannot be undone.`;

        if (!confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const usersList = [...approvedUsers, ...pendingUsers];
            const updates = [];
            const removals = [];

            for (const userId of selectedUsers) {
                const user = usersList.find(u => u.id === userId);
                if (!user) continue;

                if (action === 'delete') {
                    removals.push(userId);
                } else {
                    let newStreak = user.current_streak || 0;
                    if (action === 'increment') newStreak++;
                    if (action === 'decrement') newStreak = Math.max(0, newStreak - 1);

                    const newLongest = Math.max(newStreak, user.longest_streak || 0);

                    updates.push(
                        supabase.from('users').update({
                            current_streak: newStreak,
                            longest_streak: newLongest,
                            last_streak_day_utc: new Date().toISOString().split('T')[0]
                        }).eq('id', userId)
                    );
                }
            }

            if (action === 'delete' && removals.length > 0) {
                await supabase.from('users').delete().in('id', removals);
            } else if (updates.length > 0) {
                await Promise.all(updates);
            }

            await fetchUsers();
            setSelectedUsers(new Set()); // Clear selection

        } catch (error) {
            console.error("Bulk action failed", error);
            alert("Bulk action failed");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId, initialStreak) => {
        if (!initialStreak && initialStreak !== 0) {
            alert("Please set an initial streak before approving.");
            return;
        }

        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'approved',
                    current_streak: parseInt(initialStreak),
                    longest_streak: parseInt(initialStreak),
                    last_streak_day_utc: new Date().toISOString().split('T')[0]
                })
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers(); // Refresh lists
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Failed to approve user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        if (!confirm("Are you sure you want to REJECT this user? This will set status to 'rejected'.")) return;

        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('users')
                .update({ status: 'rejected' })
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            console.error('Error rejecting user:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to DELETE this user? This cannot be undone.")) return;

        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStreak = async (user, change) => {
        setActionLoading(user.id);
        let newStreak = (user.current_streak || 0) + change;
        newStreak = Math.max(0, newStreak); // No negative logic
        const newLongest = Math.max(newStreak, user.longest_streak || 0);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    current_streak: newStreak,
                    longest_streak: newLongest,
                    last_streak_day_utc: new Date().toISOString().split('T')[0]
                })
                .eq('id', user.id);

            if (error) throw error;

            // Optimistic update
            setApprovedUsers(approvedUsers.map(u =>
                u.id === user.id ? { ...u, current_streak: newStreak, longest_streak: newLongest } : u
            ));
        } catch (error) {
            console.error('Failed to update streak:', error);
        } finally {
            setActionLoading(null);
        }
    };

    // Filter logic
    const filterFn = user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const filteredPending = pendingUsers.filter(filterFn);
    const filteredApproved = approvedUsers.filter(filterFn);

    return (
        <div className="space-y-12 pb-24">
            {/* Header / Search */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search builders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* SPONSOR REQUESTS */}
            {sponsors.filter(s => s.status !== 'active').length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        Sponsorship Requests ({sponsors.filter(s => s.status !== 'active').length})
                    </h2>
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Sponsor Details</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {sponsors.filter(s => s.status !== 'active').map(sponsor => (
                                        <tr key={sponsor.id} className="group hover:bg-foreground/[0.02]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                                                        {sponsor.image_url && <img src={sponsor.image_url} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{sponsor.title}</div>
                                                        <div className="text-xs text-muted-foreground max-w-md truncate">{sponsor.description}</div>
                                                        <a href={sponsor.target_url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                                                            {sponsor.target_url} <ArrowUpRight size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleSponsorDelete(sponsor.id)} disabled={actionLoading === sponsor.id} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" title='Delete Request'>
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleSponsorApprove(sponsor.id)} disabled={actionLoading === sponsor.id} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm flex items-center gap-2">
                                                        {actionLoading === sponsor.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                        Approve
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* APPROVED / ACTIVE USERS */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Active Builders ({filteredApproved.length})
                    </h2>
                    {filteredApproved.length > 0 && (
                        <button
                            onClick={() => toggleSelectAll(filteredApproved)}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            {selectedUsers.size === filteredApproved.length ? "Deselect All" : "Select All"}
                        </button>
                    )}
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                                    <th className="w-8 px-6 py-4">
                                        <div className="w-4 h-4 border border-border rounded"></div>
                                    </th>
                                    <th className="px-1 py-4 font-medium">Builder</th>
                                    <th className="px-6 py-4 font-medium text-center">Streak</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {loading && approvedUsers.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-12"><Loader2 className="animate-spin mx-auto" /></td></tr>
                                ) : filteredApproved.map((user) => (
                                    <tr key={user.id} className={`group ${selectedUsers.has(user.id) ? 'bg-primary/5' : 'hover:bg-foreground/[0.02]'}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => toggleSelectUser(user.id)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-1 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-border overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-xs font-bold">
                                                            {user.username?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {user.display_name || user.username}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex gap-2">
                                                        <span>@{user.username}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xl font-black text-primary">{user.current_streak}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Downvote */}
                                                <button
                                                    onClick={() => handleUpdateStreak(user, -1)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
                                                    title="Decrease Streak (-1)"
                                                >
                                                    <ArrowUp size={18} className="rotate-180" strokeWidth={3} />
                                                </button>

                                                {/* Upvote */}
                                                <button
                                                    onClick={() => handleUpdateStreak(user, 1)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                                    title="Increase Streak (+1)"
                                                >
                                                    <ArrowUp size={18} strokeWidth={3} />
                                                </button>

                                                <div className="h-6 w-px bg-border mx-1"></div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PENDING APPROVALS */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Pending Approvals ({filteredPending.length})
                </h2>

                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Builder</th>
                                    <th className="px-6 py-4 font-medium min-w-[300px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredPending.length === 0 ? (
                                    <tr><td colSpan="2" className="text-center py-8 text-muted-foreground">No pending approvals.</td></tr>
                                ) : (
                                    filteredPending.map(user => (
                                        <tr key={user.id} className="group hover:bg-foreground/[0.02]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">{user.username}</span>
                                                    <a href={`https://x.com/${user.username}`} target="_blank" className="text-muted-foreground hover:text-foreground">
                                                        <ArrowUpRight size={14} />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                    <ApproveInput
                                                        loading={actionLoading === user.id}
                                                        onSave={(val) => handleApprove(user.id, val)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FLOATING BULK ACTION BAR */}
            {selectedUsers.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50">
                    <span className="font-bold text-sm tracking-wide">{selectedUsers.size} Selected</span>
                    <div className="h-6 w-px bg-background/20"></div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkAction('decrement')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ArrowUp size={16} className="rotate-180" />
                            <span className="text-xs font-bold">Downvote</span>
                        </button>
                        <button
                            onClick={() => handleBulkAction('increment')}
                            className="bg-primary text-foreground px-4 py-2 rounded-lg font-bold text-xs hover:bg-white transition-colors flex items-center gap-2"
                        >
                            <ArrowUp size={16} />
                            Upvote All
                        </button>
                    </div>

                    <div className="h-6 w-px bg-background/20"></div>

                    <button
                        onClick={() => handleBulkAction('delete')}
                        className="p-2 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
                        title="Bulk Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

// Component for the "Set Streak" + "Approve" combination
const ApproveInput = ({ onSave, loading }) => {
    const [streak, setStreak] = useState('');

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                placeholder="Streak"
                className="w-20 bg-background border border-border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                value={streak}
                onChange={e => setStreak(e.target.value)}
            />
            <button
                onClick={() => onSave(streak)}
                disabled={loading || streak === ''}
                className="bg-primary text-background px-4 py-2 rounded text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Approve
            </button>
        </div>
    );
}

export default AdminDashboard;
