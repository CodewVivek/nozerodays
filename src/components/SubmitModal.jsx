"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { X, Loader2, AtSign, Ghost } from "lucide-react";
import { XIcon } from "./Icons";
import { useToast } from "./Toast";

const SubmitModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => (document.body.style.overflow = "unset");
    }, [isOpen]);

    const loginWithX = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: "twitter",
            options: { redirectTo: window.location.origin },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4 animate-in fade-in">
            <div className="relative w-full max-w-sm bg-card p-6 rounded-3xl border border-border shadow-2xl animate-in zoom-in-95">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                >
                    <X />
                </button>

                <h2 className="text-3xl font-black text-center mb-2">
                    Join NoZeroDays
                </h2>

                <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
                    Track your daily progress and get ranked among the most disciplined builders.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={loginWithX}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <XIcon className="w-5 h-5 fill-white" />
                        <span>Continue with X</span>
                    </button>

                    <p className="text-xs text-center text-muted-foreground px-4 leading-relaxed">
                        By continuing, you agree to our <a href="/terms" className="underline hover:text-foreground">Terms</a> & <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubmitModal;
