
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Rocket, Loader2, X, AtSign, Check } from 'lucide-react'

const SubmitModal = ({ isOpen, onClose }) => {
    // idle | loading | auth_required | submit_ship | success | error
    const [status, setStatus] = useState('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const [session, setSession] = useState(null)
    const [shipUrl, setShipUrl] = useState('')

    useEffect(() => {
        if (!isOpen) return

        document.body.style.overflow = 'hidden'

        const init = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                setSession(data.session)
                await syncProfile(data.session.user)
            } else {
                setStatus('auth_required')
            }
        }

        init()

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session) {
                    setSession(session)
                    await syncProfile(session.user)
                }
            }
        )

        return () => {
            listener.subscription.unsubscribe()
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const syncProfile = async (user) => {
        setStatus('loading')

        try {
            const meta = user.user_metadata || {}

            const payload = {
                id: user.id,
                username:
                    meta.user_name ||
                    meta.preferred_username ||
                    user.email?.split('@')[0] ||
                    'builder',
                display_name: meta.full_name || meta.name || 'Builder',
                avatar_url: meta.avatar_url || meta.picture || null,
                status: 'pending',
                current_streak: 0,
                longest_streak: 0,
                total_ships: 0,
            }

            const { error } = await supabase
                .from('users')
                .upsert(payload, { onConflict: 'id' })

            if (error) throw error

            setStatus('submit_ship')
        } catch (err) {
            console.error(err)
            setErrorMsg(err.message)
            setStatus('error')
        }
    }

    const handleLogin = async () => {
        setStatus('loading')

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'x',
            options: {
                redirectTo: window.location.origin,
                scopes: 'tweet.read users.read offline.access',
                queryParams: {
                    scope: 'tweet.read users.read offline.access'
                }
            },
        })

        if (error) {
            setErrorMsg(error.message)
            setStatus('auth_required')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!shipUrl || !session) return

        setStatus('loading')

        try {
            const { error } = await supabase.from('user_updates').insert({
                user_id: session.user.id,
                post_url: shipUrl,
                post_day_utc: new Date().toISOString().slice(0, 10),
                review_status: 'pending',
            })

            if (error) throw error

            setStatus('success')
            setTimeout(() => {
                setShipUrl('')
                onClose()
            }, 2000)
        } catch (err) {
            setErrorMsg(err.message)
            setStatus('submit_ship')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
            <div className="relative w-full max-w-md bg-card rounded-2xl p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground"
                >
                    <X />
                </button>

                {status === 'loading' && (
                    <div className="py-12 text-center">
                        <Loader2 className="mx-auto mb-4 animate-spin" size={40} />
                        Syncing…
                    </div>
                )}

                {status === 'auth_required' && (
                    <button
                        onClick={handleLogin}
                        className="w-full py-4 rounded-xl font-bold bg-black text-white"
                    >
                        Sign in with X
                    </button>
                )}

                {status === 'submit_ship' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="url"
                            required
                            placeholder="https://x.com/.../status/..."
                            className="w-full border p-4 rounded-xl"
                            value={shipUrl}
                            onChange={(e) => setShipUrl(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold"
                        >
                            <Rocket className="inline mr-2" />
                            Post Update
                        </button>
                    </form>
                )}

                {status === 'success' && (
                    <div className="text-center py-8">
                        <Check size={48} className="mx-auto mb-4 text-green-500" />
                        Submitted!
                    </div>
                )}

                {errorMsg && (
                    <p className="mt-4 text-red-500 text-sm">{errorMsg}</p>
                )}
            </div>
        </div>
    )
}

export default SubmitModal
