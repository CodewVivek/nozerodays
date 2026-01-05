import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const bearerToken = process.env.TWITTER_BEARER_TOKEN;

        console.log(`[API] Fetching stats for user: ${username}`);
        console.log(`[API] Bearer Token Present: ${!!bearerToken}`);

        if (!bearerToken) {
            console.error('TWITTER_BEARER_TOKEN is not defined in env');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Twitter API V2 Endpoint
        const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description,url,location,profile_image_url`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Twitter API Error:', response.status, errorText);
            return NextResponse.json({ error: `Twitter API Error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();

        if (data.errors) {
            console.error('Twitter API Data Errors:', data.errors);
            return NextResponse.json({ error: 'User not found or suspended' }, { status: 404 });
        }

        return NextResponse.json(data.data);

    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
