"use client";

import { X, Twitter, Rocket, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function HowItWorksModal({
    isOpen,
    onClose,
    onJoin,
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="relative p-8 text-center border-b border-border/50">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-3xl font-black uppercase italic">
                            A Daily Discipline Game for Builders on X
                        </h2>

                        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                            NoZeroDays tracks whether you post a{" "}
                            <strong>daily build update</strong> on X.
                            <br />
                            Miss a day, your streak resets.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10">
                        {/* RULE */}
                        <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                            <p className="font-black text-lg">The only rule</p>
                            <p className="mt-2 text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">
                                    Post on X once per day about what you worked on or built.
                                </strong>
                                <br />
                                Random tweets, memes, and promos do not count.
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">
                                We detect your most recent public build-related post each day.
                            </p>
                        </div>

                        {/* STEPS */}
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="p-6 rounded-2xl border border-border">
                                <Twitter className="mx-auto mb-3 text-blue-500" />
                                <h3 className="font-black">1. Connect X</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    We track your public build updates.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border">
                                <Rocket className="mx-auto mb-3 text-orange-500" />
                                <h3 className="font-black">2. Share Today’s Work</h3>
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                    “Day 22 — shipped onboarding, fixed auth bugs.”
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border">
                                <Trophy className="mx-auto mb-3 text-green-500" />
                                <h3 className="font-black">3. Build Your Streak</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    One valid update per day keeps it alive.
                                </p>
                            </div>
                        </div>

                        {/* TRUTH */}
                        <div className="text-center pt-6 border-t border-border">
                            <h4 className="font-black uppercase">
                                No tools. No reminders. No excuses.
                            </h4>
                            <p className="text-muted-foreground mt-2">
                                Show your work daily — or your streak breaks.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="p-6 border-t border-border text-center">
                        <button
                            onClick={onJoin}
                            className="px-10 py-4 bg-foreground text-background font-black rounded-xl hover:opacity-90"
                        >
                            Start Your Streak
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
