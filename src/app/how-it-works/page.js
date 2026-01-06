"use client";

import Link from "next/link";
import { Twitter, Rocket, Trophy, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto space-y-24">

                {/* Header */}
                <header className="text-center space-y-8">
                    <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter">
                        How It Works
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-bold">
                        NoZeroDays is a <span className="text-foreground">daily discipline system</span> for builders who build in public.
                        <br className="hidden sm:block" />
                        Simple rules. Hard mode. Real streaks.
                    </p>
                </header>

                {/* The Core Loop */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card
                        icon={Twitter}
                        color="text-blue-500"
                        title="1. Connect X"
                        desc="Link your X (Twitter) account. We read your public profile to verify you are real."
                    />
                    <Card
                        icon={Rocket}
                        color="text-orange-500"
                        title="2. Post Daily"
                        desc="Post exactly one update on X about what you built. No hashtags required, but #NoZeroDays is recommended."
                    />
                    <Card
                        icon={Trophy}
                        color="text-yellow-500"
                        title="3. Streak Grows"
                        desc="Our engine scans your profile at midnight UTC. If you posted, your streak goes up. If not, it dies."
                    />
                </section>

                {/* Detailed Rules */}
                <div className="space-y-16">
                    <SectionHeader title="The Rules of the Game" />

                    <div className="grid gap-8 md:grid-cols-2">
                        <RuleBox
                            icon={CheckCircle}
                            color="text-green-500"
                            title="What Counts"
                            items={[
                                "Building a feature",
                                "Fixing a bug",
                                "Writing documentation",
                                "Designing a UI",
                                "Marketing/Launch updates"
                            ]}
                        />

                        <RuleBox
                            icon={XCircle}
                            color="text-red-500"
                            title="What Doesn't Count"
                            items={[
                                "Random memes or engagement bait",
                                "Political rants",
                                "Motivational quotes with no work",
                                "Replies to other people"
                            ]}
                        />
                    </div>
                </div>

                {/* Technical Mechanics */}
                <div className="space-y-8 bg-card border border-border rounded-3xl p-8 sm:p-12">
                    <div className="text-center space-y-4">
                        <Clock className="w-12 h-12 mx-auto text-primary animate-pulse" />
                        <h3 className="text-2xl font-black uppercase italic">The 24h UTC Cycle</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The game runs on <strong>Coordinated Universal Time (UTC)</strong>.
                                A new day starts at 00:00 UTC. You must post your update before the clock resets.
                            </p>
                            <p>
                                <strong>The Grace Period:</strong> We understand life happens.
                                If you miss the midnight deadline, you have a <span className="text-foreground font-bold">12-hour grace period</span> (until 12:00 PM UTC) to get your post in.
                            </p>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 font-mono text-sm space-y-3">
                            <div className="flex justify-between">
                                <span>Day Starts:</span>
                                <span className="font-bold text-green-500">00:00 UTC</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Deadline:</span>
                                <span className="font-bold text-orange-500">23:59 UTC</span>
                            </div>
                            <div className="flex justify-between border-t border-border/50 pt-2">
                                <span>Hard Reset:</span>
                                <span className="font-bold text-red-500">12:00 PM UTC (Next Day)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Philosophy (What it is NOT) */}
                <div className="text-center space-y-8 py-12 border-y border-border/50">
                    <SectionHeader title="Who is this for?" />
                    <p className="text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        This is for the <strong>obsessed</strong>. The builders who ship on weekends. The indie hackers who don't need a boss to tell them to work.
                        <br /><br />
                        NoZeroDays is not a "habit tracker". It is a public ledger of your consistency.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center pb-20">
                    <Link
                        href="/"
                        className="px-12 py-6 bg-foreground text-background text-xl font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-2xl hover:shadow-primary/20"
                    >
                        Join the Arena
                    </Link>
                </div>

            </div>
        </main>
    );
}

function Card({ icon: Icon, color, title, desc }) {
    return (
        <div className="bg-card border border-border p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-colors group">
            <div className={`w-14 h-14 rounded-2xl ${color} bg-current/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-black uppercase italic">{title}</h3>
            <p className="text-muted-foreground leading-relaxed font-medium">{desc}</p>
        </div>
    )
}

function SectionHeader({ title }) {
    return (
        <div className="flex items-center gap-4 justify-center">
            <span className="h-px w-12 bg-border"></span>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">{title}</h2>
            <span className="h-px w-12 bg-border"></span>
        </div>
    )
}

function RuleBox({ icon: Icon, color, title, items }) {
    return (
        <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
                <Icon className={color} size={24} />
                <h3 className="font-black uppercase tracking-tight text-lg">{title}</h3>
            </div>
            <ul className="p-6 space-y-4">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 ${color.replace('text-', 'bg-')}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
