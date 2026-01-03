
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

async function debugUser() {
    try {
        console.log("Fetching events for 'CodewVivek'...");
        const response = await fetch(`https://api.github.com/users/CodewVivek/events?per_page=100`);

        if (!response.ok) {
            console.error(`Failed: ${response.status}`);
            return;
        }

        const events = await response.json();
        console.log(`Total Events Fetched: ${events.length}`);

        events.forEach(event => {
            console.log(`[${event.type}] Date: ${event.created_at}`);
            if (event.type === 'PushEvent') {
                console.log(` - Repo: ${event.repo.name}`);
                console.log(` - Payload size: ${event.payload.size}`);
                console.log(` - Commits array length: ${event.payload.commits ? event.payload.commits.length : 'undefined'}`);
                if (event.payload.commits) {
                    event.payload.commits.forEach(c => console.log(`   - ${c.message}`));
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

debugUser();
