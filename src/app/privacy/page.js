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
                            Our Promise
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We collect the minimum data required to operate a public
                            accountability platform. No tracking. No selling. No dark
                            patterns.
                        </p>
                    </aside>

                    <section className="md:col-span-2 space-y-12 text-muted-foreground leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                1. Information We Collect
                            </h3>
                            <p>
                                When you sign in using 𝕏 (formerly Twitter), we collect basic
                                public profile information including your username, display
                                name, profile image, bio, and public engagement metadata.
                            </p>
                            <p>
                                If you voluntarily add links (GitHub, website) or upload a
                                custom avatar, we store only what you explicitly provide.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                2. Authentication & Permissions
                            </h3>
                            <p>
                                NoZeroDays requests <strong>read-only access</strong> to your
                                𝕏 profile. We do not post tweets, send messages, or perform any
                                actions on your behalf.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                3. Data Storage & Security
                            </h3>
                            <p>
                                All data is securely stored using Supabase infrastructure. We
                                apply industry-standard access controls and encryption. We do
                                not store passwords.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                4. Public Visibility
                            </h3>
                            <p>
                                NoZeroDays is a public leaderboard. Your username, streak
                                count, and submitted updates are visible to other users by
                                design.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                5. Data Retention & Deletion
                            </h3>
                            <p>
                                You may request deletion of your account and associated data
                                at any time. We retain data only as long as necessary to
                                operate the platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">
                                6. No Sale of Data
                            </h3>
                            <p>
                                We do not sell, rent, or trade your personal data. Ever.
                            </p>
                        </div>

                        <div className="space-y-4 text-foreground font-medium italic border-l-2 border-primary pl-6">
                            “Your data exists to track discipline — not to be exploited.”
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
