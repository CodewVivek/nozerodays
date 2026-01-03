"use client";
import React from 'react';
import { Share, Twitter } from 'lucide-react';

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
            className="px-4 py-2 rounded-xl bg-[#1DA1F2] text-white font-bold text-sm hover:bg-[#1a8cd8] transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
        >
            <Twitter size={16} fill="currentColor" />
            Share Streak
        </button>
    );
};

export default ShareStreakButton;
