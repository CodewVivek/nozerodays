import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Rocket, Loader2, ArrowRight, X, AtSign, Check, CheckCircle2 } from 'lucide-react';

const SubmitModal = ({ isOpen, onClose }) => {
    // idle | loading | auth_required | confirming_profile | success | error 
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [userSession, setUserSession] = useState(null);
    const [isShimmed, setIsShimmed] = useState(false); // If we just logged in

    // User Data from Auth
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = 'unset';
            return;
        }
        document.body.style.overflow = 'hidden';
        checkSession();
    }, [isOpen]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            setUserSession(session);
            // Check if they have a public profile already
            checkPublicProfile(session.user.id, session.user);
        } else {
            setStatus('auth_required');
        }
    };

    const checkPublicProfile = async (userId, userMetadata) => {
        setStatus('loading');
        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId) // Assuming we sync Auth ID -> Public ID eventually
                .maybeSingle();

            if (profile) {
                // User exists -> Show "Ship" Form (TODO)
                // For now, let's just let them confirm/update details
                setStatus('confirming_profile');
                preparePreview(userMetadata);
            } else {
                // New User -> Show "Create Profile" Form
                setStatus('confirming_profile');
                preparePreview(userMetadata);
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const preparePreview = (user) => {
        // Extract data from X metadata
        const metadata = user.user_metadata || {};
        const handle = metadata.user_name || metadata.preferred_username || 'builder';
        const displayName = metadata.full_name || metadata.name || handle;
        const avatarUrl = metadata.avatar_url || metadata.picture;

        setPreviewData({
            handle,
            display_name: displayName,
            avatar_url: avatarUrl,
            bio: '', // X API usually returns description in metadata if available
            website: '',
            location: ''
        });
    };

    const handleLogin = async () => {
        setStatus('loading');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: window.location.origin, // Redirect back to home
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setStatus('auth_required');
        }
    };

    const handleConfirmProfile = async () => {
        if (!userSession || !previewData) return;
        setStatus('submitting');

        try {
            // Upsert User Profile
            const payload = {
                // We use the Auth ID as the Public ID to link them
                // But current schema uses random UUID. 
                // We will try to match by username for legacy, or create new.
                // ideally: id: userSession.user.id

                username: previewData.handle,
                display_name: previewData.display_name,
                avatar_url: previewData.avatar_url,
                status: 'pending', // Pending approval
                current_streak: 0,
                longest_streak: 0,
                total_ships: 0
            };

            // NOTE: Simplification for this step -> Just Insert
            // In reality, we need to handle "updates" if row exists
            // and handle the ID mismatch if we are transitioning from Manual -> Auth.

            // For now, let's just trust the username is unique constraint
            const { error } = await supabase.from('users').upsert(payload, { onConflict: 'username' });

            if (error) throw error;

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error('Submission error:', err);
            setErrorMsg(err.message || 'Failed to submit.');
            setStatus('confirming_profile');
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-muted/20 hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-10">
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="p-8 text-center">

                    {/* LOADING STATE */}
                    {status === 'loading' && (
                        <div className="py-12 flex flex-col items-center">
                            <Loader2 size={40} className="animate-spin text-primary mb-4" />
                            <p className="text-secondary font-medium">Connecting to X...</p>
                        </div>
                    )}

                    {/* AUTH REQUIRED STATE */}
                    {status === 'auth_required' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                            {/* Logo */}
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-foreground text-background rounded-3xl flex items-center justify-center shadow-2xl shadow-foreground/20 transform hover:scale-105 transition-transform duration-300">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10 fill-current">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tight">Verify Identity</h2>
                                <p className="text-muted-foreground text-base leading-relaxed max-w-[280px] mx-auto">
                                    Sign in to prove you own this handle and fetch your avatar instantly.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <button
                                    onClick={handleLogin}
                                    className="group w-full py-4 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl shadow-foreground/10 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                    Sign in with X
                                </button>

                                <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                    Read-only Access
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONFIRM PROFILE STATE */}
                    {status === 'confirming_profile' && previewData && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight mb-2">Confirm Identity</h2>
                                <p className="text-secondary text-sm">Is this you?</p>
                            </div>

                            <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl mb-4 overflow-hidden relative">
                                    <img
                                        src={previewData.avatar_url}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${previewData.handle}`}
                                    />
                                </div>
                                <h3 className="text-xl font-bold">@{previewData.handle}</h3>
                                <div className="text-sm text-secondary font-medium">{previewData.display_name}</div>
                            </div>

                            <button
                                onClick={handleConfirmProfile}
                                className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                Confirm & Join
                            </button>
                        </div>
                    )}

                    {/* SUCCESS STATE */}
                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 mb-6">
                                <Check size={40} strokeWidth={4} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight mb-2">You're In! 🚀</h2>
                            <p className="text-secondary font-medium">Profile pending verification.</p>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in slide-in-from-bottom-2">
                            {errorMsg}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SubmitModal;
