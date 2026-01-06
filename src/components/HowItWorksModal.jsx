"use client";

import { X, Twitter, Rocket, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function HowItWorksModal({ isOpen, onClose }) {
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
                    className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative p-8 text-center border-b border-border/50 bg-muted/20">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-3xl font-black tracking-tight uppercase italic">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground mt-2 font-medium">
                            The loop to shipping consistency.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="p-8 grid gap-8 md:grid-cols-3">
                        {/* Step 1 */}
                        <div className="text-center space-y-4 group">
                            <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Twitter size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">1. Join</h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    Sign in with your 𝕏 account. No new passwords to remember.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center space-y-4 group">
                            <div className="mx-auto w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Rocket size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">2. Ship</h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    Post on 𝕏 with <span className="font-bold text-foreground">#NoZeroDays</span> or tag us to log your progress.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center space-y-4 group">
                            <div className="mx-auto w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Trophy size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">3. Streak</h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    We track your daily consistency. Don't break the chain.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Call to Action */}
                    <div className="p-6 bg-muted/20 border-t border-border/50 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Got it, let's build!
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
