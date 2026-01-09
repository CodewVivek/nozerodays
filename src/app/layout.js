import "./globals.css";
import Navbar from "../components/Navbar";
import SponsorCard from "../components/SponsorCard";
import AuthSync from "../components/AuthSync";
import { ThemeProvider } from "../components/ThemeProvider";
import { ToastProvider } from "../components/Toast";
import {
  Plus,
  Zap,
  MessageSquare,
  TrendingUp,
  Users,
  Megaphone,
  Volume2
} from "lucide-react";
import { XIcon } from "../components/Icons";



export const metadata = {
  metadataBase: new URL("https://nozerodays.com"),
  title: {
    default: "NoZeroDays | Daily Build-in-Public Leaderboard",
    template: "%s | NoZeroDays"
  },
  description: "The leaderboard for consistent builders who ship daily. Maintain your discipline, build your product, have NoZeroDays.",
  keywords: ["build in public", "indie hacker", "startup", "leaderboard", "consistency", "no zero days", "shipping"],
  authors: [{ name: "NoZeroDays Team" }],
  creator: "NoZeroDays",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nozerodays.com",
    title: "NoZeroDays | Daily Build-in-Public Leaderboard",
    description: "Ranked by discipline and daily execution. Join the most consistent builders.",
    siteName: "NoZeroDays",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoZeroDays Leaderboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoZeroDays | Daily Build-in-Public Leaderboard",
    description: "The leaderboard for consistent builders who ship daily.",
    images: ["/og-image.png"],
    creator: "@nozerodays",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import ReviewPendingModal from "../components/ReviewPendingModal";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

// ... (other imports)

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <Script
          defer
          src="https://datalaunch.vercel.app/track.js"
          data-site-id="ba842eb5-ca56-4da3-a40a-654a43a58c0d"
        />
            <script
  defer
  data-website-id="dfid_hCeGxDcT3UBugCapYMRG1"
  data-domain="nozerodays.vercel.app"
  src="https://datafa.st/js/script.js">
</script>
        <ToastProvider>
          <AuthSync />
          <ReviewPendingModal />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                {children}
              </main>

              <footer className="py-20 border-t border-border bg-card/20 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center">
                          <div className="w-1 h-5 bg-primary rotate-[35deg] rounded-full" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">NoZeroDays</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                        The accountability engine for builders. Track your streak, focus on the work, and build something meaningful. Every day is a day to ship.
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Platform</h4>
                      <ul className="space-y-3 text-sm font-medium">
                        <li><a href="/" className="hover:text-primary transition-colors text-muted-foreground">Leaderboard</a></li>
                        <li><a href="/how-it-works" className="hover:text-primary transition-colors text-muted-foreground">How It Works</a></li>
                        <li><a href="/settings" className="hover:text-primary transition-colors text-muted-foreground">Settings</a></li>
                      </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Legal</h4>
                      <ul className="space-y-3 text-sm font-medium">
                        <li><a href="/privacy" className="hover:text-primary transition-colors text-muted-foreground">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-primary transition-colors text-muted-foreground">Terms of Service</a></li>
                        <li>
                          <a
                            href="https://x.com/vweekk_"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                            @vweekk_
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    <div>&copy; 2026 NoZeroDays Engine. All rights reserved.</div>
                    <div className="flex items-center gap-2 text-primary">
                      Built for the 𝕏 generation
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
