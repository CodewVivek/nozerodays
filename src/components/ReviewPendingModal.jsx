"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { X, Clock, ShieldCheck, UserCheck } from "lucide-react";

export default function ReviewPendingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            // 1. Check local storage first to avoid annoying user every refresh
            const hasSeen = sessionStorage.getItem("nzd_pending_seen");
            if (hasSeen) {
                setLoading(false);
                return;
            }

            // 2. Get User
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            // 3. Fetch Status from DB
            const { data: user } = await supabase
                .from('users')
                .select('status')
                .eq('id', session.user.id)
                .single();

            if (user && user.status === 'pending') {
                setIsOpen(true);
                sessionStorage.setItem("nzd_pending_seen", "true");
            }
            setLoading(false);
        };

        checkStatus();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                        <UserCheck size={40} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black italic tracking-tight uppercase">Profile Under Review</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to the arena! Your profile is currently in the <strong>approval queue</strong>.
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-5 text-sm text-left space-y-3 border border-border/50">
                        <div className="flex gap-3">
                            <ShieldCheck className="text-primary flex-shrink-0" size={18} />
                            <span className="text-muted-foreground">
                                <strong className="text-foreground">Human Verified:</strong> Admins review every builder manually to ensure quality.
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Clock className="text-primary flex-shrink-0" size={18} />
                            <span className="text-muted-foreground">
                                <strong className="text-foreground">Live Soon:</strong> Once verified, your streaks will appear on the global leaderboard.
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-4 bg-foreground text-background rounded-xl font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                        Checkout Leaderboard
                    </button>
                </div>

            </div>
        </div>
    );
}
