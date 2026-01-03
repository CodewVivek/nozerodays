
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

async function debugRepo() {
    try {
        console.log("Checking Repo: CodewVivek/launchit ...");

        // 1. Check Repo Details (Visibility)
        const repoRes = await fetch('https://api.github.com/repos/CodewVivek/launchit');
        if (repoRes.ok) {
            const repo = await repoRes.json();
            console.log(`\n[Repo Details]`);
            console.log(`Name: ${repo.full_name}`);
            console.log(`Private: ${repo.private}`);
            console.log(`Visibility: ${repo.visibility}`);
            console.log(`Last Push: ${repo.pushed_at}`);
        } else {
            console.log(`\n[Repo Error] Status: ${repoRes.status}`);
            if (repoRes.status === 404) console.log("Repo not found (or private and hidden).");
        }

        // 2. Check Commits
        const commitsRes = await fetch('https://api.github.com/repos/CodewVivek/launchit/commits?per_page=5');
        if (commitsRes.ok) {
            const commits = await commitsRes.json();
            console.log(`\n[Recent Commits]`);
            commits.forEach(c => {
                console.log(`- ${c.commit.author.date} | ${c.commit.message}`);
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

debugRepo();
