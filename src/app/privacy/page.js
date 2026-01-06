export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-12">
                <header className="space-y-6 pb-8 border-b border-border/40">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Last Updated: January 6, 2026
                    </p>
                </header>

                <section className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
                    <div>
                        <p>
                            At NoZeroDays ("we", "us", "our"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">1. Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Authentication Data:</strong> When you log in via X (formerly Twitter), we collect your public profile information (username, display name, profile image URL). We store your unique X user ID to maintain your session.</li>
                            <li><strong>Public Activity Data:</strong> The core function of our platform is to aggregate and display publicly available information from X. We collect data related to your posts (timestamps, content snippets) to verify and calculate your "streaks". This information is already public by nature.</li>
                            <li><strong>Payment Information:</strong> If you purchase a sponsorship, your billing information is processed by our Merchant of Record, Dodo Payments. We do not store full credit card numbers on our servers; we only retain transaction identifiers and status.</li>
                            <li><strong>Usage Data:</strong> We may collect anonymous analytical data (e.g., page views, feature usage) to improve platform performance.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">2. How We Use Your Information</h3>
                        <p>We use the collected data for the following purposes:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>To provide and maintain the Service (e.g., calculating streaks, updating leaderboards).</li>
                            <li>To process payments and manage sponsorship slots.</li>
                            <li>To detect and prevent fraud or abuse (e.g., identifying bot activity).</li>
                            <li>To communicate with you regarding your account or critical system updates.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">3. Data Sharing and Disclosure</h3>
                        <p>
                            We do not sell your personal data. We may share information with trusted third-party service providers solely for the purpose of operating the Platform:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Supabase:</strong> For database hosting and authentication services.</li>
                            <li><strong>Vercel:</strong> For web hosting and infrastructure.</li>
                            <li><strong>Dodo Payments:</strong> For payment processing.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">4. Data Retention</h3>
                        <p>
                            We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Account Data:</strong> Retained as long as your account is active.</li>
                            <li><strong>Transaction Data:</strong> Retained for tax and accounting purposes as required by law.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">5. Your Rights (GDPR & CCPA)</h3>
                        <p>Depending on your location, you may have the following rights:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>The right to access:</strong> You can request copies of your personal data.</li>
                            <li><strong>The right to rectification:</strong> You can request correction of inaccurate data.</li>
                            <li><strong>The right to erasure ("Right to be Forgotten"):</strong> You can request that we delete your account and associated data.</li>
                            <li><strong>The right to restrict processing:</strong> You can object to our processing of your data.</li>
                        </ul>
                        <p className="mt-2">
                            To exercise these rights, please contact us at support@nozerodays.com.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">6. Security</h3>
                        <p>
                            We prioritize the security of your data using industry-standard encryption (SSL/TLS) during transmission and secure storage practices. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">7. International Data Transfers</h3>
                        <p>
                            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ (e.g., servers in the United States). By using the service, you consent to this transfer.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">8. Changes to This Privacy Policy</h3>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-border/40">
                        <p className="text-sm">
                            <strong>Contact Us:</strong> If you have any questions about this Privacy Policy, please contact us at support@nozerodays.com.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
