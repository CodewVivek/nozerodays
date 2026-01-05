"use client";
import React from 'react';

export const Skeleton = ({ className = "", variant = "rect" }) => {
    const variants = {
        rect: "rounded-lg",
        circle: "rounded-full",
        text: "rounded-md h-4 w-full"
    };

    return (
        <div
            className={`animate-pulse bg-muted/40 ${variants[variant]} ${className}`}
            aria-hidden="true"
        />
    );
};

export const SkeletonProfile = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-center gap-8 py-10 border-b border-border/50">
            <Skeleton variant="circle" className="w-32 h-32 md:w-40 md:h-40 shrink-0" />
            <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-4 pt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
        </div>
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-2xl" />
        </div>
    </div>
);

export const SkeletonLeaderboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="divide-y divide-border/50">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton variant="circle" className="h-12 w-12" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-24 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const SkeletonSettings = () => (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64 uppercase italic font-black" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border border-border rounded-3xl">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-8">
                    <Skeleton className="w-24 h-24 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    </div>
);
