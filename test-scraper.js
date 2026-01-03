
// Native fetch is available in Node 18+
async function scrape(username) {
    try {
        const cleanUsername = username.replace('@', '').trim();
        console.log(`Fetching https://unavatar.io/twitter/${cleanUsername}?json...`);

        // Unavatar JSON endpoint
        const response = await fetch(`https://unavatar.io/twitter/${cleanUsername}?json`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            return;
        }

        const html = await response.text();
        console.log('--- BODY ---');
        console.log(html);
        console.log('--- END BODY ---');

        // const titleMatch = html.match(...);

        console.log(`Fetched ${html.length} bytes`);

        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
        const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);

        console.log('--- RESULTS ---');
        console.log('Title Match:', titleMatch ? titleMatch[1] : 'NULL');
        console.log('Image Match:', imageMatch ? imageMatch[1] : 'NULL');

    } catch (error) {
        console.error('Error:', error);
    }
}

scrape('elonmusk');
