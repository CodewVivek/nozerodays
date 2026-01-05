"use client";
import React from 'react';
import { Share } from 'lucide-react';
import { XIcon } from './Icons';

const ShareStreakButton = ({ username, streak }) => {

    const handleShare = () => {
        const text = `I just hit a ${streak}-day streak on @nozerodays. Shipping daily. 🚀`;
        const url = `https://nozerodays.com/${username}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    return (
        <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5 active:scale-95"
        >
            <XIcon className="w-4 h-4" />
            Share Streak
        </button>
    );
};

export default ShareStreakButton;
