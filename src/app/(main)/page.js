"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, HelpCircle } from "lucide-react";
import Leaderboard from "../../components/Leaderboard";
import SubmitModal from "../../components/SubmitModal";
import HowItWorksModal from "../../components/HowItWorksModal";
import { MovingBorderButton } from "../../components/ui/moving-border-button";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="space-y-6 animate-in">
        {/* HERO */}
        <div className="text-center pb-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter sm:text-7xl uppercase italic">
              NoZeroDays
            </h1>

            <h2 className="text-lg sm:text-lg font-bold uppercase tracking-wide max-w-xl mx-auto text-muted-foreground">
              Connect your X account — we’ll automatically track your daily building in public updates.
            </h2>
          </div>

          {/* SEARCH + JOIN */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
              <div className="relative w-full sm:w-[420px]">
                <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-sm">
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

              {!user && (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                  <PlusCircle size={20} />
                  Join
                </button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Track real builders shipping every day
            </p>
          </div>

          {/* HOW IT WORKS */}
          <div className="flex justify-center pt-2">
            <MovingBorderButton
              borderRadius="1.75rem"
              className="bg-background text-foreground border-neutral-200 dark:border-slate-800"
              onClick={() => setIsHowItWorksOpen(true)}
            >
              <div className="px-8 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                <HelpCircle size={18} className="text-primary" />
                <span>How It Works</span>
              </div>
            </MovingBorderButton>
          </div>
        </div>

        {/* LEADERBOARD */}
        <Leaderboard searchQuery={searchQuery} />
      </div>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onJoin={() => {
          setIsHowItWorksOpen(false);
          setIsSubmitModalOpen(true);
        }}
      />
    </>
  );
}
