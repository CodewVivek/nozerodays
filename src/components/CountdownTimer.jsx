"use client";
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nowUtc = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );

            const endOfDayUtc = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + 1,
                0, 0, 0
            );

            const difference = endOfDayUtc - nowUtc;

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num) => num.toString().padStart(2, '0');

    return (
        <div className="bg-card border border-border rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                    <Timer size={24} />
                </div>
                <div>
                    <h3 className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-0.5">Time Remaining (UTC)</h3>
                    <p className="text-sm font-bold text-foreground">Until Today's Deadline</p>
                </div>
            </div>
            <div className="flex gap-2">
                {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, idx) => (
                    <React.Fragment key={idx}>
                        <div className="bg-background border border-border rounded-xl px-4 py-3 min-w-[64px] text-center shadow-inner">
                            <span className="text-2xl font-black font-mono text-foreground leading-none">
                                {formatNumber(value)}
                            </span>
                            <span className="block text-[8px] font-bold uppercase text-secondary mt-1 tracking-tighter">
                                {idx === 0 ? 'Hours' : idx === 1 ? 'Mins' : 'Secs'}
                            </span>
                        </div>
                        {idx < 2 && (
                            <div className="flex items-center font-black text-secondary text-xl pt-1">:</div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;
