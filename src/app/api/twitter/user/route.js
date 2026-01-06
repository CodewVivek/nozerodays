import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { username } = await req.json()

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 })
        }

        const bearerToken = process.env.TWITTER_BEARER_TOKEN

        if (!bearerToken) {
            // console.error('TWITTER_BEARER_TOKEN is not set')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const res = await fetch(
            `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,public_metrics,created_at,description,name,verified`,
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
                cache: 'no-store',
            }
        )

        if (!res.ok) {
            const errorData = await res.json()
            // console.error('Twitter API error:', errorData)
            return NextResponse.json({ error: 'Twitter API failed' }, { status: res.status })
        }

        const data = await res.json()

        if (!data.data) {
            return NextResponse.json({ error: 'User not found on Twitter' }, { status: 404 })
        }

        const user = data.data

        return NextResponse.json({
            name: user.name,
            avatar: user.profile_image_url.replace('_normal', ''),
            bio: user.description,
            followers: user.public_metrics.followers_count,
            tweets: user.public_metrics.tweet_count,
            account_created_at: user.created_at,
            verified: user.verified,
        })
    } catch (err) {
        // console.error('Server error in Twitter API route:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
