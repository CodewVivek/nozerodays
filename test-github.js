
const https = require('https');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                json: () => JSON.parse(data)
            }));
        }).on('error', reject);
    });
}

async function testGitHubFetch(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        if (!response.ok) {
            console.error(`Failed: ${response.status}`);
            return;
        }

        const events = await response.json();
        const startDate = new Date('2026-01-01T00:00:00Z');

        console.log(`Fetched ${events.length} events for ${username}`);

        let commitCount = 0;
        let pushEvents = 0;

        events.forEach(event => {
            if (event.type === 'PushEvent') {
                pushEvents++;
                const eventDate = new Date(event.created_at);
                const isCounted = eventDate >= startDate;
                console.log(`PushEvent on ${event.created_at} (${isCounted ? 'Counted' : 'Skipped'}) - Commits: ${event.payload.commits ? event.payload.commits.length : 0}`);

                if (isCounted) {
                    commitCount += event.payload.commits ? event.payload.commits.length : 0;
                }
            }
        });

        console.log(`\n--- SUMMARY for ${username} ---`);
        console.log(`Total PushEvents (Last 90 days): ${pushEvents}`);
        console.log(`Total Commits (since 2026-01-01): ${commitCount}`);

        if (commitCount === 0 && pushEvents > 0) {
            console.log("WARN: PushEvents exist but were filtered out by date.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

// Ensure we test with someone who definitely has activity
testGitHubFetch('leerob');
// testGitHubFetch('your_username'); // You can replace this
