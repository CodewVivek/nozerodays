export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-16">
                <header className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight uppercase italic">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="w-12 h-px bg-border"></span>
                        Last updated: January 2026
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border/40 pt-12">
                    <aside className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                            Data Philosophy
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We build in public. Our privacy policy reflects that transparency.
                            We protect your private credentials while showcasing your public achievements.
                        </p>
                    </aside>

                    <section className="md:col-span-2 space-y-12 text-muted-foreground leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                1. Information We Collect
                            </h3>
                            <p>
                                <strong>Account Info:</strong> When you sign in via X (Twitter), we collect your username, display name, profile image, and public bio.
                            </p>
                            <p>
                                <strong>Activity Data:</strong> We track your streaks, "ships" (updates), and engagement metrics. This data is public by default—that is the core purpose of the platform.
                            </p>
                            <p>
                                <strong>Payment Info:</strong> If you purchase a sponsorship, your payment is processed by our secure merchant of record (Dodo Payments). We <strong>do not</strong> store your credit card numbers. We only retain transaction status and sponsorship details.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                2. How We Use Your Data
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To verify your identity and prevent fraud.</li>
                                <li>To display your progress on public leaderboards.</li>
                                <li>To process sponsorship transactions and display ads.</li>
                                <li>To improve platform stability and fix bugs.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                3. Public Visibility
                            </h3>
                            <p>
                                <strong>By using NoZeroDays, you acknowledge that your profile and streaks are public.</strong>
                                Anyone on the internet can view your consistency graph. Do not post private or sensitive information in your daily updates.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                4. Third-Party Services
                            </h3>
                            <p>
                                We utilize trusted third-party vendors:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Supabase:</strong> Database and Authentication services.</li>
                                <li><strong>Dodo Payments:</strong> Payment processing and merchant of record.</li>
                                <li><strong>Vercel:</strong> Hosting and infrastructure.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                5. Cookies & Tracking
                            </h3>
                            <p>
                                We use essential cookies to maintain your login session. We do not use third-party ad-tracking cookies. Analytics are privacy-preserving and aggregated.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                6. Your Rights
                            </h3>
                            <p>
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Access:</strong> View all data we hold about you.</li>
                                <li><strong>Rectify:</strong> Correct inaccurate information.</li>
                                <li><strong>Delete:</strong> Request complete account deletion. This will remove your streaks and history permanently.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                7. Contact Us
                            </h3>
                            <p>
                                For privacy concerns or deletion requests, please contact the admin directly via X (Twitter) or email support.
                            </p>
                        </div>

                        <div className="space-y-4 text-foreground font-medium italic border-l-2 border-primary pl-6">
                            “Your trust is our most valuable asset. We treat it with respect.”
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
