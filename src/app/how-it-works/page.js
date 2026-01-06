"use client";

import Link from "next/link";
import { Twitter, Rocket, Trophy, CheckCircle, XCircle, Clock, ShieldAlert, Zap, Globe, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-5xl mx-auto space-y-32">

                {/* Header */}
                <header className="text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                        <BookOpen size={12} /> The Manual
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter">
                        How It Works
                    </h1>
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-bold">
                        NoZeroDays is an automated discipline engine.
                        <br />
                        It tracks one thing: <span className="text-foreground underline decoration-primary decoration-4 underline-offset-4">Did you ship today?</span>
                    </p>
                </header>

                {/* 1. The Core Loop */}
                <section className="space-y-12">
                    <SectionHeader title="The Core Loop" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card
                            icon={Twitter}
                            color="text-blue-500"
                            title="1. Connect Identity"
                            desc="Link your X (Twitter) account. We verify you are a real human builder. No read-only permissions are required beyond public profile data."
                        />
                        <Card
                            icon={Rocket}
                            color="text-orange-500"
                            title="2. Ship & Post"
                            desc="Post exactly one update on X about what you built. Typically a screenshot, a code snippet, or a launch announcement."
                        />
                        <Card
                            icon={Trophy}
                            color="text-yellow-500"
                            title="3. Engine Checks"
                            desc="Our system scans the X API automatically. If a valid post is found within the 24h window, your streak increments."
                        />
                    </div>
                </section>

                {/* 2. The Time System */}
                <section className="space-y-12 bg-card border border-border/60 rounded-[3rem] p-8 sm:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Clock size={300} />
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">The Time System</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                This is the most critical part of the game. We run on a strict global clock.
                                There are no timezones. There is only UTC.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Globe size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Midnight UTC</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            The "Day" resets exactly at 00:00:00 Coordinated Universal Time.
                                            This is the finish line. You must get your daily post in before this moment.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 flex-shrink-0">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">The 12-Hour Grace Period</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            If you miss the midnight deadline, your streak enters a "Danger State".
                                            You have exactly <strong>12 hours</strong> (until 12:00 PM UTC) to post a retroactive update.
                                        </p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mt-2">
                                            Use this only for emergencies.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 border border-border rounded-3xl p-8 space-y-6 font-mono text-sm">
                                <h4 className="font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-4">System Timeline</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-50">00:00 UTC</span>
                                        <span className="font-bold text-green-500">New Day Starts</span>
                                    </div>
                                    <div className="flex items-center justify-between pl-4 border-l-2 border-green-500/20 py-2">
                                        <span className="opacity-50">...</span>
                                        <span className="text-muted-foreground">Building Period</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-50">23:59 UTC</span>
                                        <span className="font-bold text-yellow-500">Standard Deadline</span>
                                    </div>
                                    <div className="flex items-center justify-between pl-4 border-l-2 border-red-500/20 py-2">
                                        <span className="opacity-50">+12 Hours</span>
                                        <span className="text-orange-500">Grace Period (Late Post)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-50">12:00 UTC</span>
                                        <span className="font-black text-red-500 bg-red-500/10 px-2 py-1 rounded">STREAK DEATH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. The Constitution */}
                <section className="space-y-12">
                    <SectionHeader title="The Constitution" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <RuleCard
                            title="What Counts (Valid)"
                            icon={CheckCircle}
                            color="text-green-500"
                            items={[
                                "Screenshots of code or IDE",
                                "Video demos of features",
                                "Design mocks/Figma exports",
                                "Marketing result updates (real numbers)",
                                "Writing documentation/blogs",
                                "Fixing bugs (explain the fix)"
                            ]}
                        />
                        <RuleCard
                            title="What Fails (Invalid)"
                            icon={XCircle}
                            color="text-red-500"
                            items={[
                                "Motivational quotes without work",
                                "Engagement bait questions",
                                "Political takes or rants",
                                "Memes that aren't about your build",
                                "Replies to other accounts",
                                "Retweets/Quote Tweets only"
                            ]}
                        />
                    </div>

                    <div className="bg-muted/20 border border-border p-8 rounded-2xl text-center space-y-4 max-w-2xl mx-auto">
                        <h4 className="font-bold text-foreground">The "Proof of Work" Standard</h4>
                        <p className="text-muted-foreground">
                            If an admin looks at your post, can they <strong>see</strong> that you advanced your project?
                            If yes, you are safe. If no, you risk a manual reset.
                        </p>
                    </div>
                </section>

                {/* 4. Verification & Legends */}
                <section className="space-y-12">
                    <SectionHeader title="Ranks & Badges" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-black italic uppercase">The Verified Badge</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The blue checkmark on NoZeroDays is earned, not bought.
                                It is manually awarded by admins to builders who:
                            </p>
                            <ul className="space-y-3">
                                {["Have a consistent streak (7+ days)", "Post high-quality visual updates", "Are clearly human (not automated spam)"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-medium">
                                        <Zap size={16} className="text-yellow-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-card border border-border p-8 rounded-3xl flex items-center justify-center">
                            {/* Visual mockup of badge */}
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                    <span className="font-black text-lg">@username</span>
                                    <div className="bg-blue-500 text-white rounded-full p-1"><CheckCircle size={14} /></div>
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Verified Builder</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. FAQ */}
                <section className="space-y-12 pb-20 border-t border-border pt-12">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">Frequently Asked Questions</h2>

                    <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        <FAQItem
                            q="Does a thread count?"
                            a="Yes. As long as the first tweet in the thread serves as your update, it counts. We strip replies, so make sure the main post has the juice."
                        />
                        <FAQItem
                            q="Do I need to use the hashtag?"
                            a="Not strictly, but it helps us find you if the API hiccups. We recommend adding #NoZeroDays or #BuildInPublic."
                        />
                        <FAQItem
                            q="Can I build on weekends?"
                            a="You MUST build on weekends. There are no zero days. That includes Saturdays, Sundays, and Holidays."
                        />
                        <FAQItem
                            q="What if I forget to post?"
                            a="Then you start over at Day 1. The pain of losing a streak is the best teacher."
                        />
                    </div>
                </section>

                {/* CTA */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background text-lg font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-2xl hover:shadow-primary/20 hover:ring-4 ring-primary/20"
                    >
                        Start Day 1
                        <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
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
            <p className="text-muted-foreground leading-relaxed font-medium text-sm">{desc}</p>
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

function RuleCard({ title, icon: Icon, color, items }) {
    return (
        <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
                <Icon className={color} size={24} />
                <h3 className="font-black uppercase tracking-tight text-lg">{title}</h3>
            </div>
            <ul className="p-6 space-y-4">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 ${color.replace('text-', 'bg-')}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function FAQItem({ q, a }) {
    return (
        <div className="space-y-2">
            <h4 className="font-bold text-foreground text-lg">{q}</h4>
            <p className="text-muted-foreground leading-relaxed">{a}</p>
        </div>
    )
}
