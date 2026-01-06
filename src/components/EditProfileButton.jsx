'use client'

import React, { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'

const EditProfileButton = ({ profileUserId }) => {
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user?.id === profileUserId) {
                    setIsOwner(true)
                }
            } catch (e) {
                // Error checking ownership
            } finally {
                setLoading(false)
            }
        }
        checkOwnership()
    }, [profileUserId])

    if (loading) return (
        <div className="w-20 h-10 rounded-xl bg-muted/20 animate-pulse" />
    )

    // Only show Edit button if it's the owner
    if (isOwner) {
        return (
            <div className="flex items-center gap-3">
                <a
                    href="/settings"
                    className="px-4 py-2 rounded-xl border-2 border-border hover:border-foreground/20 hover:bg-muted/50 text-foreground font-bold text-sm transition-all flex items-center gap-2"
                >
                    <Settings size={16} />
                    Edit
                </a>
            </div>
        )
    }

    return null
}

export default EditProfileButton
