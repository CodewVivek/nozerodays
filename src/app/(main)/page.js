"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import Leaderboard from "../../components/Leaderboard";
import SubmitModal from "../../components/SubmitModal";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="space-y-6 animate-in">
        <div className="text-center pb-8">
          <div className="space-y-4 mb-8">
            <h1
              className="text-4xl font-black tracking-tighter sm:text-7xl uppercase italic"
              style={{ color: "var(--foreground)" }}
            >
              NoZeroDays
            </h1>

            <p
              className="text-lg sm:text-xl max-w-lg mx-auto leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              The most consistent builders on X. Ranked by discipline and daily execution.
            </p>
          </div>

          {/* Search + Join */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            {/* Premium Search */}
            <div className="relative group w-full sm:w-[420px]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-cyan-500/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition" />
              <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-sm group-focus-within:ring-4 group-focus-within:ring-primary/10">
                <Search
                  className="absolute left-4 text-muted-foreground"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Find a builder by username…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-transparent outline-none font-medium text-center sm:text-left"
                />
              </div>
            </div>

            {/* JOIN BUTTON - Only show if user is not logged in */}
            {!user && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background hover:opacity-90 font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg border border-border"
              >
                <PlusCircle size={20} />
                Join
              </button>
            )}
          </div>
        </div>

        <Leaderboard searchQuery={searchQuery} />
      </div>

      {/* JOIN / LOGIN MODAL */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
}
