"use client";
import React, { useState, useEffect } from 'react';
import SponsorCard from "../../components/SponsorCard";
import SponsorModal from "../../components/SponsorModal";
import { Volume2 } from "lucide-react";
import { supabase } from '../../lib/supabase';

export default function MainLayout({ children }) {
    // Dodo Payment Link - Replace with actual link
    const PAYMENT_LINK = "https://checkout.dodopayments.com/buy/pdt_0NVgu5QBmCLd5Ji8T1QGv?quantity=1";
    const [isSponsorModalOpen, setSponsorModalOpen] = useState(false);
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            const { data } = await supabase
                .from('sponsors')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });
            if (data) setSponsors(data.slice(0, 9)); // Limit to 9 active sponsors
        };
        fetchSponsors();
    }, []);

    // Split sponsors between left and right columns
    // Left Limit: 4 Dynamic (plus 1 static = 5 total)
    // Right Limit: 5 Dynamic
    const leftSponsors = [];
    const rightSponsors = [];

    sponsors.forEach((sponsor, index) => {
        // Alternate: Evens to Left, Odds to Right
        // BUT if Left is full (4), put in Right.
        if (leftSponsors.length < 4 && (index % 2 === 0 || rightSponsors.length >= 5)) {
            leftSponsors.push(sponsor);
        } else {
            rightSponsors.push(sponsor);
        }
    });

    const renderPlaceholder = (key) => (
        <SponsorCard
            key={key}
            title="Become a Sponsor"
            description="Get your product in front of 100+ builders."
            icon={Volume2}
            colorClass="bg-zinc-500/5 text-zinc-500 hover:bg-zinc-500/10 hover:text-foreground transition-all"
            badge="$4 / mo"
            onClick={() => setSponsorModalOpen(true)}
        />
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            <SponsorModal
                isOpen={isSponsorModalOpen}
                onClose={() => setSponsorModalOpen(false)}
                paymentLink={PAYMENT_LINK}
            />

            {/* Left Column (Main Sponsors) */}
            <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-32 self-start h-fit">
                <div className="px-1 flex justify-between items-center">
                </div>

                {/* First Card - Launchit (Static) */}
                <SponsorCard
                    title="Launchit"
                    description="Instantly launch projects, gain visibility, and Browse Launches."
                    imageUrl="/launchit-logo.png"
                    colorClass="bg-blue-500/10"
                    url="https://launchit.site"
                />

                {/* Dynamic Sponsors (Left) */}
                {leftSponsors.map(sponsor => (
                    <SponsorCard
                        key={sponsor.id}
                        title={sponsor.title}
                        description={sponsor.description}
                        imageUrl={sponsor.image_url}
                        colorClass="bg-card hover:bg-primary/5 transition-all"
                        url={sponsor.target_url}
                    />
                ))}

                {/* Placeholders (Fill up to 5 total items on left including Launchit) */}
                {Array.from({ length: Math.max(0, 4 - leftSponsors.length) }).map((_, i) =>
                    renderPlaceholder(`left-placeholder-${i}`)
                )}
            </aside>

            {/* Center Column (Main Content) */}
            <div className="col-span-1 lg:col-span-6 space-y-8">
                {children}
            </div>

            {/* Right Column (Sidebar) */}
            <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-32 self-start h-fit">
                <div className="px-1 flex justify-between items-center">
                </div>

                {/* Dynamic Sponsors (Right) */}
                {rightSponsors.map(sponsor => (
                    <SponsorCard
                        key={sponsor.id}
                        title={sponsor.title}
                        description={sponsor.description}
                        imageUrl={sponsor.image_url}
                        colorClass="bg-card hover:bg-primary/5 transition-all"
                        url={sponsor.target_url}
                    />
                ))}

                {/* Placeholders (Fill up to 5 total items on right) */}
                {Array.from({ length: Math.max(0, 5 - rightSponsors.length) }).map((_, i) =>
                    renderPlaceholder(`right-placeholder-${i}`)
                )}
            </aside>
        </div>
    );
}
