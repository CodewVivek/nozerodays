export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </header>

                <section className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To provide our streak tracking service, we utilize "Sign in with X" (formerly Twitter).
                            When you authenticate, we collect the following public information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>X Handle (Username)</li>
                            <li>Display Name</li>
                            <li>Profile Picture (Avatar)</li>
                            <li>Bio (Description)</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">2. How We Use Your Data</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is used exclusively to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Verify your identity as a builder.</li>
                            <li>Create and display your public leaderboard profile.</li>
                            <li>Track and validate your 100-day shipping streak.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">3. Data Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                            Your profile information is public on the leaderboard, as is the nature of the challenge.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">4. Read-Only Access</h2>
                        <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
                            We only request read-only access to your X profile. We will never post on your behalf or access your direct messages.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">5. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions regarding this privacy policy, you may contact us via X.
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
