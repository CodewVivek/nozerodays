"use client";
import React, { useMemo } from 'react';
import { Info, Zap } from 'lucide-react';

const ActivityHeatmap = ({ userUpdates = [] }) => {
    // Generate GitHub-style grid data (53 weeks x 7 days)
    const { weeksData, totalActiveDays, monthLabels } = useMemo(() => {
        // Step 1: Pre-normalize updates for O(1) lookup and consistent date format
        const activeDaysSet = new Set(
            userUpdates.map(u => {
                // Handle potential different date formats safely
                try {
                    const d = new Date(u.post_day_utc);
                    // Ensure valid date before ISO slicing
                    return !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null;
                } catch (e) {
                    return null;
                }
            }).filter(Boolean)
        );

        const weeks = [];
        const today = new Date();
        const endDate = new Date(today);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 364); // 52 weeks ago

        // Align to Sunday
        const dayOffset = startDate.getDay();
        const gridStartDate = new Date(startDate);
        gridStartDate.setDate(gridStartDate.getDate() - dayOffset);

        let current = new Date(gridStartDate);
        const months = [];

        // Generate exactly 53 weeks (GitHub standard)
        for (let w = 0; w < 53; w++) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const dateStr = current.toISOString().slice(0, 10);
                const isFuture = current > today; // Simple future check

                // Optimized O(1) Lookup
                const isActive = activeDaysSet.has(dateStr);

                // Track Month Changes for Labels
                // Only show label if it's the 1st of the month to avoid "Starting partial month" duplicate
                if (current.getDate() === 1) {
                    const monthName = current.toLocaleDateString('en-US', { month: 'short' });
                    if (months.length === 0 || months[months.length - 1].name !== monthName) {
                        months.push({ name: monthName, weekIndex: w });
                    }
                }

                week.push({
                    date: dateStr,
                    active: isActive,
                    isFuture,
                    dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
                    formattedDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                });

                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }

        const uniqueActiveDays = activeDaysSet.size; // Accurate count of unique approved days based on set

        return { weeksData: weeks, totalActiveDays: uniqueActiveDays, monthLabels: months };
    }, [userUpdates]);

    return (
        <div className="w-full space-y-6 group/grid">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <Zap size={20} className="fill-current" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic tracking-tight uppercase leading-none">Execution History</h3>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                            {totalActiveDays} days of approved shipping in the last year
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="relative p-6 bg-card border border-border/50 rounded-3xl overflow-hidden">
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                    {/* Month Labels */}
                    <div className="flex text-[10px] font-bold text-muted-foreground mb-2 relative h-4">
                        {monthLabels.map((month, i) => (
                            <span
                                key={i}
                                style={{
                                    left: `${month.weekIndex * (14 + 3)}px`, // 14px width + 3px gap (approx)
                                    position: 'absolute'
                                }}
                            >
                                {month.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-[3px] min-w-max">
                        {/* Day Labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col gap-[3px] pr-2 justify-between text-[9px] font-bold text-muted-foreground/60 py-[1px] relative -mt-5 pt-7">
                            <span className="h-[12px] sm:h-[13px]"></span>
                            <span className="h-[12px] sm:h-[13px] flex items-center">Mon</span>
                            <span className="h-[12px] sm:h-[13px]"></span>
                            <span className="h-[12px] sm:h-[13px] flex items-center">Wed</span>
                            <span className="h-[12px] sm:h-[13px]"></span>
                            <span className="h-[12px] sm:h-[13px] flex items-center">Fri</span>
                            <span className="h-[12px] sm:h-[13px]"></span>
                        </div>

                        {weeksData.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dIndex) => (
                                    <div
                                        key={day.date}
                                        title={`${day.active ? 'Approved' : 'No activity'} on ${day.formattedDate}`}
                                        className={`
                                            w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] rounded-[2px] 
                                            transition-all duration-200
                                            ${day.active
                                                ? 'bg-green-500 dark:bg-green-600 shadow-sm' // Active (Green)
                                                : day.isFuture
                                                    ? 'opacity-0'
                                                    : 'bg-neutral-200 dark:bg-neutral-800' // Empty (Solid Gray)
                                            }
                                        `}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Legend */}
            <div className="flex items-center justify-end gap-3 text-[10px] text-muted-foreground">
                <span>Inactive</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-[2px] bg-neutral-200 dark:bg-neutral-800" />
                    <div className="w-3 h-3 rounded-[2px] bg-green-500 dark:bg-green-600" />
                </div>
                <span>Active</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
