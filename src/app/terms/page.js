export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-16">
                <header className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight uppercase italic">
                        Terms of Service
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="w-12 h-px bg-border"></span>
                        Last updated: January 2026
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border/40 pt-12">
                    <aside className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                            The Contract
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            NoZeroDays is a platform for disciplined builders. We provide the tools; you provide the work.
                            By using the platform, you agree to play fair.
                        </p>
                    </aside>

                    <section className="md:col-span-2 space-y-12 text-muted-foreground leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                1. Acceptance of Terms
                            </h3>
                            <p>
                                By accessing NoZeroDays, you agree to these Terms. If you disobey them, your account may be suspended or banned.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                2. Acceptable Use
                            </h3>
                            <p>
                                You agree <strong>NOT</strong> to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Use automated scripts to generate fake streaks or activity.</li>
                                <li>Post illegal, hateful, or explicit content.</li>
                                <li>Harass other builders or attempt to compromise user accounts.</li>
                                <li>Reverse engineer the API or infrastructure.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                3. Sponsorships & Payments
                            </h3>
                            <p>
                                <strong>Purchases:</strong> Sponsorship slots are purchased via our secure payment provider. All sales are final once the sponsorship period begins.
                            </p>
                            <p>
                                <strong>Approval Process:</strong> All sponsorships are subject to manual admin approval. We reserve the right to <strong>reject</strong> any sponsor for any reason (e.g., gambling, adult content, scams).
                            </p>
                            <p>
                                <strong>Refunds:</strong> If your sponsorship is rejected <em>before</em> it goes live, you will be refunded. If you are removed for violating terms <em>during</em> your active period, no refund will be issued.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                4. Content Ownership
                            </h3>
                            <p>
                                You own your data. By posting updates, you grant us a license to display them on the leaderboard. We do not claim copyright over your personal projects or "ships".
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                5. Termination
                            </h3>
                            <p>
                                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including limitation if you breach the Terms.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                6. Limitation of Liability
                            </h3>
                            <p>
                                NoZeroDays is provided "AS IS". We are not liable for any data loss, streak resets due to bugs, or downtime. We urge you to keep your own backups of critical data.
                            </p>
                        </div>

                        <div className="space-y-4 text-foreground font-medium italic border-l-2 border-primary pl-6">
                            “Build daily. Ship often. Play nice.”
                        </div>
                    </section>
                </div>

                <footer className="pt-16 border-t border-border/40">
                    <a
                        href="/"
                        className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        Back to Cockpit
                    </a>
                </footer>
            </div>
        </main>
    );
}
