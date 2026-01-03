import "./globals.css";
import Navbar from "../components/Navbar";
import SponsorCard from "../components/SponsorCard";
import { ThemeProvider } from "../components/ThemeProvider";
import {
  Plus,
  Zap,
  MessageSquare,
  TrendingUp,
  Users,
  Megaphone,
  Volume2
} from "lucide-react";

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-8">
              {children}
            </main>

            <footer className="py-12 border-t border-border mt-auto">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-secondary text-xs font-medium">
                <div>&copy; 2026 NoZeroDays. All rights reserved.</div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                  <a href="#" className="hover:text-foreground transition-colors">X</a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
