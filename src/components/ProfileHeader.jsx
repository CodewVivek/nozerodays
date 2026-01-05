'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { VerifiedBadge, XIcon } from './Icons'
import { Trophy, TrendingUp, Github, Calendar } from 'lucide-react'
import Breadcrumbs from './Breadcrumbs'
import ShareStreakButton from './ShareStreakButton'
import EditProfileButton from './EditProfileButton'

export default function ProfileHeader({ initialProfile }) {
    const [profile, setProfile] = useState(initialProfile)
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkOwner = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const currentUserId = session?.user?.id

            if (currentUserId && currentUserId === initialProfile.id) {
                setIsOwner(true)
            }
            setLoading(false)
        }
        checkOwner()
    }, [initialProfile.id])

    // Use the profile state (which upgrades to Real if owner)
    const displayProfile = profile
    // Note: initialProfile comes with 'isIncognito' masking applied if needed.
    // If we updated 'profile' with real data, 'isIncognito' check for display might be irrelevant for the owner view,
    // because we want the owner to see their data.

    const rawAvatar = displayProfile.avatar_url;
    const avatarSource = rawAvatar ? rawAvatar.replace('_normal', '').replace('_bigger', '') : `https://api.dicebear.com/9.x/shapes/svg?seed=${displayProfile.username}`;

    return (
        <div>
            <Breadcrumbs items={[
                { label: 'profile', href: '/' },
                { label: displayProfile.username }
            ]} />

            <div className="flex flex-col md:flex-row gap-8 items-start mt-6">
                {/* Avatar */}
                <div className="relative group flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted/10">
                        <img
                            src={avatarSource}
                            alt={displayProfile.username}
                            className={`w-full h-full object-cover`}
                        />
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full" title="Active Builder"></div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                            {displayProfile.display_name || displayProfile.username}
                            {(displayProfile.is_verified || displayProfile.is_admin) && (
                                <div title="Verified User">
                                    <VerifiedBadge className="w-6 h-6 flex-shrink-0" />
                                </div>
                            )}
                        </h1>
                        {displayProfile.twitter_verified && !(displayProfile.is_verified || displayProfile.is_admin) && (
                            <VerifiedBadge className="w-6 h-6 flex-shrink-0" />
                        )}
                        <div className="w-full" />
                        <p className="text-lg text-muted-foreground font-medium -mt-4">@{displayProfile.username}</p>
                    </div>

                    {/* Bio: Show always (unless empty) */}
                    {(displayProfile.bio || displayProfile.twitter_bio) && (
                        <p className="text-muted-foreground leading-relaxed max-w-xl text-sm">
                            {displayProfile.bio || displayProfile.twitter_bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                        {/* Share Streak: ONLY FOR OWNER */}
                        {isOwner && (
                            <ShareStreakButton username={displayProfile.username} streak={displayProfile.current_streak} />
                        )}

                        {/* Socials: Show always */}
                        {(true) && (
                            <>
                                <a
                                    href={`https://x.com/${displayProfile.username}`}
                                    target="_blank"
                                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/10 text-foreground font-semibold text-sm transition-colors flex items-center gap-2"
                                >
                                    <XIcon className="w-4 h-4" />
                                    Checkout X
                                </a>

                                {displayProfile.github_username && (
                                    <a
                                        href={`https://github.com/${displayProfile.github_username}`}
                                        target="_blank"
                                        className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/10 text-foreground font-semibold text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Github size={16} />
                                        GitHub
                                    </a>
                                )}

                                {displayProfile.website_url && (
                                    <a
                                        href={displayProfile.website_url}
                                        target="_blank"
                                        className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/10 text-foreground font-semibold text-sm transition-colors flex items-center gap-2"
                                    >
                                        <TrendingUp size={16} />
                                        Website
                                    </a>
                                )}
                            </>
                        )}

                        <EditProfileButton
                            profileUserId={initialProfile.id} // Use initial ID to ensure button renders
                            isClaimed={displayProfile.is_claimed}
                            isAnonymous={displayProfile.is_anonymous}
                            isVerified={displayProfile.is_verified || displayProfile.twitter_verified || displayProfile.is_admin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
