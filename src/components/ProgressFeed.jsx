"use client";
import React from 'react';
import { ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ProgressFeed = ({ updates = [] }) => {
    if (updates.length === 0) {
        return null;
    }

    // Sort descending just in case
    const sortedUpdates = [...updates].sort((a, b) => new Date(b.post_day_utc) - new Date(a.post_day_utc));

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black italic tracking-tight flex items-center gap-2">
                <CheckCircle2 size={24} className="text-primary" />
                Update History ({updates.length})
            </h3>

            <div className="relative border-l-2 border-border ml-4 space-y-10 pl-8 py-4">
                {sortedUpdates.map((update) => (
                    <div key={update.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-background border-4 border-border group-hover:border-primary group-hover:scale-125 transition-all z-10 shadow-sm" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-primary shadow-inner">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-lg text-foreground tracking-tight">
                                        {new Date(update.post_day_utc).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                        Verified on {update.post_day_utc}
                                    </div>
                                </div>
                            </div>

                            {update.post_url ? (
                                <Link
                                    href={update.post_url}
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/10"
                                >
                                    <span>View on 𝕏</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            ) : (
                                <span className="text-xs text-muted-foreground font-bold italic px-4 bg-muted/20 py-2 rounded-xl border border-border/50">Manual Verification</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressFeed;
