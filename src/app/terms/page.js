export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-12">
                <header className="space-y-6 pb-8 border-b border-border/40">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Last Updated: January 6, 2026
                    </p>
                </header>

                <section className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">1. Agreement to Terms</h3>
                        <p>
                            By accessing or using NoZeroDays ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Platform.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">2. Description of Service</h3>
                        <p>
                            NoZeroDays is a gamified accountability platform for software developers and creators ("Builders"). We track public activity on X (formerly Twitter) to generate "streaks" and leaderboards. Use of the Platform is strictly for tracking legitimate building activity.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">3. User Accounts & Fairness</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Authentication:</strong> You must log in using a valid X account. You are responsible for safeguarding your account credentials.</li>
                            <li><strong>Fair Play:</strong> You agree not to use automated scripts, bots, or unauthorized APIs to manipulate streaks, leaderboards, or engagement metrics.</li>
                            <li><strong>Prohibited Content:</strong> You may not use the Platform to promote illegal activities, hate speech, harassment, or explicit content. We reserve the right to ban any user at our sole discretion.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">4. Sponsorships & Payments</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Purchases:</strong> Sponsorship slots are sold on a subscription basis via our third-party payment provider, Dodo Payments.</li>
                            <li><strong>Approval:</strong> All sponsorships are subject to approval. We reserve the right to reject or remove any advertisement that conflicts with our brand values (e.g., scams, gambling, adult content).</li>
                            <li><strong>Refund Policy:</strong>
                                <ul className="list-circle pl-5 pt-2 space-y-1">
                                    <li>If we reject your sponsorship application <em>before</em> it goes live, you will be fully refunded.</li>
                                    <li>If we terminate your sponsorship due to a violation of these Terms <em>during</em> the active period, no refund will be provided.</li>
                                    <li>All other sales are final.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">5. Intellectual Property</h3>
                        <p>
                            The Platform and its original content, features, and functionality are owned by NoZeroDays. However, you retain full ownership of the content you post on X and the projects you build. We claim no ownership over your intellectual property.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">6. Limitation of Liability</h3>
                        <p>
                            In no event shall NoZeroDays, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Platform.
                        </p>
                        <p className="mt-2">
                            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the Service will be uninterrupted or error-free.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">7. Governing Law</h3>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">8. Changes to Terms</h3>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-border/40">
                        <p className="text-sm">
                            <strong>Contact Us:</strong> If you have any questions about these Terms, please contact us at support@nozerodays.com or via X at @nozerodays.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
