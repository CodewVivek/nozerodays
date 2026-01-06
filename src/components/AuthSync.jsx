'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { ADMIN_HANDLES, ADMIN_EMAIL } from '../lib/constants'

export default function AuthSync() {
    const syncing = useRef(false)

    useEffect(() => {
        const syncUser = async () => {
            if (syncing.current) return
            syncing.current = true

            const { data: { session }, error } = await supabase.auth.getSession()
            if (error || !session?.user) return

            await performSync(session.user)
        }

        syncUser()
    }, [])

    const performSync = async (user) => {
        const identity = user.identities?.find(i => i.provider === 'twitter')
        const raw = identity?.identity_data || {}

        const username =
            user.user_metadata?.user_name ||
            raw?.username ||
            raw?.screen_name ||
            user.user_metadata?.preferred_username ||
            null

        if (!username) return

        const email = user.email ?? null

        let avatarUrl =
            user.user_metadata?.avatar_url ||
            raw?.profile_image_url_https ||
            null

        if (avatarUrl) avatarUrl = avatarUrl.replace('_normal', '')

        const { data: existingUser } = await supabase
            .from('users')
            .select(`
              twitter_followers,
              twitter_tweets,
              twitter_bio,
              website_url,
              is_admin,
              status
            `)
            .eq('id', user.id)
            .single()

        const isAdmin =
            ADMIN_HANDLES.includes(username) ||
            email === ADMIN_EMAIL ||
            existingUser?.is_admin

        // ✅ Correct fetch condition: check for null/undefined, not just falsy (0 is valid)
        const SHOULD_FETCH_TWITTER =
            existingUser?.twitter_followers == null ||
            existingUser?.twitter_tweets == null ||
            (existingUser?.twitter_followers === 0 && existingUser?.twitter_tweets === 0) // Retry if it failed previously

        let stats = null
        if (SHOULD_FETCH_TWITTER) {
            try {
                const res = await fetch('/api/twitter-stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username }),
                })

                if (res.ok) {
                    const json = await res.json()
                    stats = json.data ?? json
                }
            } catch {
                // Silent fail
            }
        }

        await supabase.from('users').upsert({
            id: user.id,
            username,
            display_name: user.user_metadata?.name ?? raw?.name ?? null,
            email,
            avatar_url: avatarUrl,

            status: isAdmin ? 'approved' : existingUser?.status ?? 'approved',
            is_admin: isAdmin,
            is_claimed: true,
            // is_anonymous removed

            twitter_bio:
                stats?.description ??
                raw?.description ??
                existingUser?.twitter_bio ??
                null,

            twitter_followers:
                stats?.public_metrics?.followers_count ??
                existingUser?.twitter_followers ??
                0,

            twitter_tweets:
                stats?.public_metrics?.tweet_count ??
                existingUser?.twitter_tweets ??
                0,

            website_url:
                stats?.entities?.url?.urls?.[0]?.expanded_url ??
                stats?.url ??
                existingUser?.website_url ??
                null,
        })
    }

    return null
}
