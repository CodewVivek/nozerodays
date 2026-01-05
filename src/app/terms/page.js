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
                            The Agreement
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            By using NoZeroDays, you agree to these terms and acknowledge the
                            public nature of the platform.
                        </p>
                    </aside>

                    <section className="md:col-span-2 space-y-12 text-muted-foreground leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                1. Acceptance of Terms
                            </h3>
                            <p>
                                By accessing or using NoZeroDays, you agree to be bound by
                                these Terms of Service and all applicable laws.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                2. Platform Purpose
                            </h3>
                            <p>
                                NoZeroDays exists to track public building consistency. It is
                                not a private journal. Participation implies consent to public
                                display of progress.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                3. User Conduct
                            </h3>
                            <p>
                                You agree not to misuse the platform, submit false activity,
                                automate streaks, harass others, or publish harmful content.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                4. Content Ownership
                            </h3>
                            <p>
                                You retain ownership of all content you submit. By posting,
                                you grant NoZeroDays a non-exclusive license to display and
                                promote your activity within the platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                5. Account Termination
                            </h3>
                            <p>
                                We reserve the right to suspend or remove accounts that
                                violate these terms or compromise the integrity of the
                                leaderboard.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                6. Disclaimer
                            </h3>
                            <p>
                                The platform is provided “as-is” without warranties of any
                                kind. Streaks reset. Data reflects activity, not intent.
                            </p>
                        </div>

                        <div className="space-y-4 text-foreground font-medium italic border-l-2 border-primary pl-6">
                            “Consistency is the contract. The system only reflects what you
                            ship.”
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
