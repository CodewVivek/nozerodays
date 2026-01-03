"use client";
import React, { useMemo } from 'react';
import { Info } from 'lucide-react';

const ActivityHeatmap = ({ userUpdates = [] }) => {
    // Generate GitHub-style grid data (53 weeks x 7 days)
    const { weeksData, totalActiveDays } = useMemo(() => {
        const weeks = [];
        const today = new Date();

        // 364 days back = 52 weeks ago
        const endDate = new Date(today);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 364);

        // Align to Sunday
        const dayOffset = startDate.getDay();
        const gridStartDate = new Date(startDate);
        gridStartDate.setDate(gridStartDate.getDate() - dayOffset);

        let current = new Date(gridStartDate);

        // Generate weeks
        while (current <= endDate || weeks.length < 53) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const dateStr = current.toISOString().split('T')[0];
                const isFuture = current > today;

                // Active check
                const isActive = userUpdates.some(u => u.post_day_utc === dateStr);

                week.push({
                    date: dateStr,
                    active: isActive,
                    isFuture
                });

                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }

        const uniqueActiveDays = new Set(userUpdates.map(u => u.post_day_utc)).size;

        return { weeksData: weeks, totalActiveDays: uniqueActiveDays };
    }, [userUpdates]);

    return (
        <div className="w-full space-y-4">
            {/* Header: Stats + Tooltip */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-foreground font-semibold">
                    {totalActiveDays} contributions in the last year
                </div>

                <div className="relative group z-50">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                        How it works <Info size={12} />
                    </button>

                    {/* Tooltip Content - Positioned Bottom Right to prevent top clipping */}
                    <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-xl bg-popover border border-border shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-left z-50">
                        <h4 className="font-bold text-foreground text-sm">Activity Heatmap</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This grid visualizes your daily consistency. Each square is a day.
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                            <li><span className="text-primary font-bold">Green squares</span>: You shipped an update.</li>
                            <li><strong>Rows</strong>: Days of the week (Sun-Sat).</li>
                            <li><strong>Columns</strong>: Weeks of the year.</li>
                        </ul>
                    </div>
                    {/* Triangle Arrow */}
                    <div className="absolute top-[-5px] right-6 w-3 h-3 bg-popover border-t border-l border-border rotate-45"></div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-[2px] min-w-max">
                    {weeksData.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[2px]">
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    title={`${day.date}${day.active ? ': Shipped!' : ''}`}
                                    className={`
                                        w-[10px] h-[10px] rounded-[2px] transition-colors
                                        ${day.active
                                            ? 'bg-primary border border-primary/50' // Active: Solid Primary
                                            : day.isFuture
                                                ? 'opacity-0'
                                                : 'bg-neutral-200 dark:bg-[#161b22] hover:bg-neutral-300 dark:hover:bg-[#2d333b]' // Adaptive Light/Dark
                                        }
                                    `}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-neutral-200 dark:bg-[#161b22] rounded-[1px]"></span> Inactive
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-[1px]"></span> Shipped
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ActivityHeatmap;
