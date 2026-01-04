"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Trophy, PlusCircle, Settings, Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ADMIN_HANDLES } from '../lib/constants';

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const handle = session.user.user_metadata?.user_name || session.user.user_metadata?.preferred_username;
                if (ADMIN_HANDLES.includes(handle)) {
                    setIsAdmin(true);
                }
            }
        };
        checkAdmin();
    }, []);

    useEffect(() => {
        setMounted(true);

        // Trigger initial spin
        const trigger = () => {
            setIsSpinning(true);
            setTimeout(() => setIsSpinning(false), 1200);
        };

        trigger();

        const handleExternalSpin = () => {
            // Reset if already spinning to allow re-trigger
            setIsSpinning(false);
            setTimeout(trigger, 10);
        };

        window.addEventListener('nozerodays-logo-spin', handleExternalSpin);
        return () => window.removeEventListener('nozerodays-logo-spin', handleExternalSpin);
    }, []);

    const currentTheme = mounted ? resolvedTheme : 'dark';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Left Side: Branding */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={`relative w-9 h-9 flex items-center justify-center transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-[360deg] group-active:scale-95 flex-shrink-0 ${isSpinning ? 'animate-spin-once' : ''}`}>
                            {/* The "0" - Explicitly Black in Light, White in Dark */}
                            <div className="absolute inset-0 border-[3.5px] border-[#111111] dark:border-white rounded-full transition-colors" />
                            {/* The "/" - Brand Blue */}
                            <div className="absolute w-[3.5px] h-10 bg-[#00A3FF] rotate-[35deg] rounded-full" />
                        </div>
                        <span
                            className="font-black text-xl tracking-tighter group-hover:text-[#00A3FF] transition-colors"
                            style={{ color: 'var(--foreground)' }}
                        >
                            NoZeroDays
                        </span>
                    </Link>

                    {/* Right Side: Utilities */}
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`p-2.5 rounded-xl transition-all border border-transparent ${pathname === '/admin' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                title="Admin Dashboard"
                            >
                                <Settings size={20} />
                            </Link>
                        )}

                        <button
                            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-all"
                            aria-label="Toggle Theme"
                        >
                            {!mounted ? (
                                <div className="w-5 h-5" />
                            ) : currentTheme === 'dark' ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
