"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
    Trophy,
    Settings,
    X,
    Sun,
    Moon,
    Zap,
    ChevronDown
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { ADMIN_HANDLES, ADMIN_EMAIL } from "../lib/constants";

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) hydrateUser(data.session.user);
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            if (session) hydrateUser(session.user);
            else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const hydrateUser = (u) => {
        setUser(u);
        const handle = u.user_metadata?.user_name;
        const email = u.email;
        setIsAdmin(ADMIN_HANDLES.includes(handle) || email === ADMIN_EMAIL);
    };

    useEffect(() => {
        setMounted(true);
        const close = (e) =>
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target) &&
            setOpen(false);
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    // Use original HD image by removing size suffixes
    const avatar =
        user?.user_metadata?.avatar_url?.replace('_normal', '').replace('_bigger', '') ||
        user?.user_metadata?.picture?.replace('_normal', '').replace('_bigger', '') ||
        `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.id}`;

    const dropdownItem =
        "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl hover:bg-muted transition";

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur border-b border-border">
            <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9 flex items-center justify-center transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-[360deg] group-active:scale-95 flex-shrink-0">
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


                <div className="flex items-center gap-2">
                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-1.5 rounded-xl hover:bg-card transition border border-transparent hover:border-border"
                            >
                                <img
                                    src={avatar}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-lg border border-border object-cover"
                                />
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
                                    {/* User Info Header */}
                                    <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1.5 border-b border-border">
                                        <img
                                            src={avatar}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-lg border-2 border-border object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-foreground truncate">
                                                {user.user_metadata?.full_name || user.user_metadata?.name || 'Builder'}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                @{user.user_metadata?.user_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <Link
                                        href={`/${user.user_metadata?.user_name}`}
                                        className={dropdownItem}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Trophy size={16} /> My Profile
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className={dropdownItem}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Settings size={16} /> Settings
                                    </Link>

                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className={`${dropdownItem} text-primary`}
                                            onClick={() => setOpen(false)}
                                        >
                                            <Zap size={16} /> Admin
                                        </Link>
                                    )}

                                    <div className="h-px my-2 bg-border" />

                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            location.href = "/";
                                        }}
                                        className={`${dropdownItem} text-red-500 w-full`}
                                    >
                                        <X size={16} /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() =>
                            setTheme(resolvedTheme === "dark" ? "light" : "dark")
                        }
                        className="p-2 rounded-xl hover:bg-card transition"
                    >
                        {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
