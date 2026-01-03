"use client";
import React from 'react';
import { ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ShipFeed = ({ updates = [] }) => {
    if (updates.length === 0) {
        return (
            <div className="py-12 text-center border rounded-2xl bg-card/50 border-dashed border-border">
                <p className="text-secondary font-medium">No ships recorded yet.</p>
            </div>
        );
    }

    // Sort descending just in case
    const sortedUpdates = [...updates].sort((a, b) => new Date(b.post_day_utc) - new Date(a.post_day_utc));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary" />
                Ship History ({updates.length})
            </h3>

            <div className="relative border-l border-border ml-3.5 space-y-8 pl-8 py-2">
                {sortedUpdates.map((update) => (
                    <div key={update.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-border group-hover:border-primary group-hover:scale-110 transition-all z-10" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-background border border-border text-secondary">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">
                                        {new Date(update.post_day_utc).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-secondary font-mono">
                                        UTC: {update.post_day_utc}
                                    </div>
                                </div>
                            </div>

                            {update.post_url ? (
                                <Link
                                    href={update.post_url}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
                                >
                                    <span>View on 𝕏</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            ) : (
                                <span className="text-xs text-muted-foreground italic px-4">No link provided</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShipFeed;
