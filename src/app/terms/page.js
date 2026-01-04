export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </header>

                <section className="space-y-8 text-muted-foreground leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing NoZeroDays, you agree to be bound by these Terms of Service.
                            If you do not agree, please do not use the platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground">2. The 100 Day Challenge</h2>
                        <p>
                            NoZeroDays is a social accountability platform. By joining, you authorize us to
                            display your progress and X profile information publicly on our leaderboard.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground">3. User Conduct</h2>
                        <p>
                            Users are expected to ship genuine updates. We reserve the right to remove any
                            profile that engages in:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Spam or fraudulent activity.</li>
                            <li>Impersonation of other builders.</li>
                            <li>Harassment or offensive content.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground">4. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate access to our service at any time,
                            without prior notice, for conduct that we believe violates these Terms.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground">5. Disclaimer</h2>
                        <p>
                            The service is provided "as is". We are not responsible for any data loss
                            or issues originating from X (Twitter) API changes.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-border">
                    <a href="/" className="text-sm font-bold text-primary hover:underline">
                        ← Back to Leaderboard
                    </a>
                </footer>
            </div>
        </main>
    );
}
