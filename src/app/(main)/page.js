"use client";
import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import Leaderboard from "../../components/Leaderboard";
import SponsorCard from "../../components/SponsorCard";
import SubmitModal from "../../components/SubmitModal";

export default function Home() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="space-y-6 animate-in">
        <div className="text-center pb-8">
          <div className="space-y-4 mb-8">
            <h1
              className="text-4xl font-black tracking-tighter sm:text-7xl uppercase italic"
              style={{ color: 'var(--foreground)' }}
            >
              NoZeroDays
            </h1>
            <p
              className="text-lg sm:text-xl max-w-lg mx-auto leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              The most consistent builders on X. Ranked by discipline and daily execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Search Bar */}
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search builders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm"
              />
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('nozerodays-logo-spin'));
                setIsSubmitModalOpen(true);
              }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('nozerodays-logo-spin'))}
              className="group flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/5 dark:shadow-white/5 active:scale-95 whitespace-nowrap"
            >
              <PlusCircle size={18} fill="currentColor" />
              Submit Ship
            </button>
          </div>
        </div>

        <Leaderboard searchQuery={searchQuery} />

      </div>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
}
