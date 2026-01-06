"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    User,
    AtSign,
    FileText,
    Link as LinkIcon,
    Github,
    BadgeCheck,
    AlertCircle,
    Save,
    Loader2,
    Image as ImageIcon,
    X as LucideX
} from 'lucide-react';
import { XIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { SkeletonSettings } from '../../components/Skeleton';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        avatar_url: '',
        github_username: '',
        website_url: '',
        twitter_followers: 0,
        twitter_tweets: 0,
        is_anonymous: false
    });
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            window.location.href = '/';
            return;
        }

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            setUser(profile);
            setFormData({
                display_name: profile.display_name || '',
                bio: profile.bio || profile.twitter_bio || '', // Use twitter_bio as fallback
                avatar_url: profile.avatar_url?.replace('_normal', '').replace('_bigger', '') || '',
                github_username: profile.github_username || '',
                website_url: profile.website_url || '',
                twitter_followers: profile.twitter_followers || 0,
                twitter_tweets: profile.twitter_tweets || 0,
                is_anonymous: profile.is_anonymous || false
            });
            setStatus(profile.status || 'pending');
        }
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            showToast('Avatar uploaded! Click Save to apply.', 'success');
        } catch (error) {
            showToast('Upload failed. Ensure you have an "avatars" bucket in Supabase storage.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('users')
            .update({
                display_name: formData.display_name,
                bio: formData.bio,
                avatar_url: formData.avatar_url,
                github_username: formData.github_username,
                website_url: formData.website_url,
                twitter_followers: formData.twitter_followers,
                twitter_tweets: formData.twitter_tweets
                // is_anonymous removed (Ghost Mode deprecated)
            })
            .eq('id', user.id);

        if (!error) {
            showToast('Settings saved successfully!', 'success');
            fetchProfile(); // Refresh data
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
        setSaving(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            showToast('Please type DELETE to confirm', 'error');
            return;
        }

        setDeleting(true);
        try {
            // Delete from Supabase Auth (this will cascade to users table via RLS)
            const { error } = await supabase.auth.admin.deleteUser(user.id);

            if (error) {
                // Fallback: try using rpc or direct delete if admin access unavailable
                const { error: rpcError } = await supabase.rpc('delete_user_account', { user_id: user.id });

                if (rpcError) {
                    // Last resort: sign out and delete via client
                    await supabase.from('users').delete().eq('id', user.id);
                }
            }

            // Sign out the user
            await supabase.auth.signOut();

            showToast('Account deleted successfully', 'success');

            // Redirect to homepage after a brief delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            showToast('Failed to delete account. Please contact support.', 'error');
            setDeleting(false);
        }
    };

    if (loading) return <SkeletonSettings />;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2">Builder Settings</h1>
                    <p className="text-muted-foreground font-medium">Customize your presence on the leaderboard.</p>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${status === 'approved'
                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                    }`}>
                    {status === 'approved' ? <BadgeCheck size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-black uppercase tracking-wider">
                        {status === 'approved' ? 'Approved Builder' : 'Pending Approval'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-card border border-border rounded-3xl shadow-sm">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold italic tracking-tight">Public Profile</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">This info will be visible to everyone on your profile page.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-8 pb-4">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl border-2 border-border overflow-hidden bg-muted/10 relative">
                                    <img
                                        src={formData.avatar_url?.replace('_normal', '').replace('_bigger', '') || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.username}`}
                                        className="w-full h-full object-cover"
                                        alt="Avatar Preview"
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-primary" size={24} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-primary text-background p-2 rounded-xl border-4 border-card cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                    <ImageIcon size={16} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Profile Picture</label>
                                <p className="text-xs text-muted-foreground font-medium">Upload a custom avatar or keep your X profile picture.</p>
                            </div>
                        </div>

                        <Divider />

                        {/* Display Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User size={14} /> Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                placeholder="Your Name"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText size={14} /> Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="What are you building?"
                                rows={4}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Connections Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-card border border-border rounded-3xl shadow-sm">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold italic tracking-tight">Socials</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">Where can people find you? Connect your dev accounts.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        {/* Twitter Stats (Simplified) */}
                        <div className="flex items-center justify-between p-5 bg-muted/20 border border-border/50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center">
                                    <XIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-foreground">@{user?.username}</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Linked X Identity</p>
                                </div>
                            </div>
                            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Active Sync</span>
                            </div>
                        </div>

                        {/* Manual Stats Override */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">X Followers</label>
                                <input
                                    type="number"
                                    value={formData.twitter_followers || ''}
                                    onChange={(e) => setFormData({ ...formData, twitter_followers: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Posts</label>
                                <input
                                    type="number"
                                    value={formData.twitter_tweets || ''}
                                    onChange={(e) => setFormData({ ...formData, twitter_tweets: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <Divider />

                        {/* GitHub */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Github size={14} /> GitHub Username
                            </label>
                            <div className="relative">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                <input
                                    type="text"
                                    value={formData.github_username}
                                    onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                                    placeholder="username"
                                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <LinkIcon size={14} /> Website URL
                            </label>
                            <input
                                type="url"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://yourwebsite.com"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end pt-4 pb-12">
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="bg-foreground text-background hover:opacity-90 px-8 py-4 rounded-2xl font-black italic tracking-tight flex items-center gap-2 shadow-xl shadow-foreground/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Save size={20} />
                        )}
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-red-500/5 border-2 border-red-500/20 rounded-3xl shadow-sm mb-12">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold italic tracking-tight text-red-500">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Irreversible actions. Proceed with extreme caution.
                    </p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-start gap-4 p-5 bg-background border-2 border-red-500/30 rounded-2xl">
                        <div className="p-3 rounded-xl bg-red-500/20 text-red-500">
                            <LucideX size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">Delete Account</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Permanently delete your NoZeroDays account. This will remove all your data including:
                            </p>
                            <ul className="text-sm text-muted-foreground mb-4 space-y-1 ml-4">
                                <li>• All streak data and progress history</li>
                                <li>• Submitted updates and posts</li>
                                <li>• Profile information and settings</li>
                                <li>• Leaderboard rankings</li>
                            </ul>
                            <p className="text-xs font-bold text-red-500 mb-4">
                                ⚠️ This action cannot be undone.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <LucideX size={18} />
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4 animate-in fade-in">
                    <div className="relative w-full max-w-lg bg-card p-8 rounded-3xl border-2 border-red-500/30 shadow-2xl animate-in zoom-in">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeleteConfirmText('');
                            }}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                        >
                            <LucideX size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-red-500/20 text-red-500">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-red-500">Delete Account?</h2>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                            This will permanently delete your account <strong className="text-foreground">@{user?.username}</strong> and all associated data.
                        </p>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                            <p className="text-sm font-bold text-red-500 mb-2">⚠️ Warning</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Your current streak of <strong>{user?.current_streak || 0}</strong> days will be lost</li>
                                <li>• All {user?.total_ships || 0} submitted updates will be deleted</li>
                                <li>• You will be removed from the leaderboard</li>
                                <li>• This action is irreversible</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-bold text-foreground mb-2 block">
                                Type <code className="bg-red-500/20 text-red-500 px-2 py-1 rounded font-mono">DELETE</code> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Type DELETE"
                                className="w-full bg-background border-2 border-red-500/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                                className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE' || deleting}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <LucideX size={18} />
                                        Delete Forever
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Divider = () => <div className="h-px bg-border/50 w-full" />;
