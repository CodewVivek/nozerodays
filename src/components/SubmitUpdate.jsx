"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Link, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SubmitUpdate = ({ onSubmitted }) => {
    const [username, setUsername] = useState('');
    const [postUrl, setPostUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('username', username.replace('@', ''))
                .single();

            if (userError && userError.code === 'PGRST116') {
                const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert({ username: username.replace('@', ''), display_name: username })
                    .select('id')
                    .single();
                if (createError) throw createError;
                user = newUser;
            } else if (userError) throw userError;

            const todayUtc = new Date().toISOString().split('T')[0];
            const { error: updateError } = await supabase
                .from('user_updates')
                .insert({
                    user_id: user.id,
                    post_day_utc: todayUtc,
                    post_url: postUrl,
                    review_status: 'pending'
                });

            if (updateError) {
                if (updateError.code === '23505') setError('You already submitted an update for today (UTC)!');
                else throw updateError;
            } else {
                setSuccess(true);
                setUsername('');
                setPostUrl('');
                if (onSubmitted) onSubmitted();
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-card border border-border rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-300 shadow-xl">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Update Submitted!</h2>
                <p className="text-secondary mb-6 font-medium">Your update is now pending review. Check the leaderboard soon!</p>
                <button
                    onClick={() => { setSuccess(false); router.push('/'); }}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    View Leaderboard
                </button>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Send size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Submit Your Progress</h2>
                    <p className="text-sm text-secondary font-medium">Keep your streak alive for today (UTC).</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2.5 px-1">X Username</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-foreground transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </div>
                        <input
                            type="text" required placeholder="e.g. janesmith"
                            className="w-full bg-background border border-border focus:border-primary outline-none rounded-2xl py-4 pl-12 pr-4 transition-all text-foreground placeholder:text-zinc-500 shadow-inner"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2.5 px-1">Post Link (Optional)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                            <Link size={18} />
                        </div>
                        <input
                            type="url" placeholder="https://x.com/..."
                            className="w-full bg-background border border-border focus:border-primary outline-none rounded-2xl py-4 pl-12 pr-4 transition-all text-foreground placeholder:text-zinc-500 shadow-inner"
                            value={postUrl} onChange={(e) => setPostUrl(e.target.value)}
                        />
                    </div>
                </div>
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center gap-2 font-medium animate-shake"><AlertCircle size={18} />{error}</div>}
                <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} />Submit Update</>}
                </button>
            </form>
        </div>
    );
};

export default SubmitUpdate;
