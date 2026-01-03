
async function checkSyndication(username) {
    try {
        const url = `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${username}`;
        console.log(`Fetching ${url}...`);

        const res = await fetch(url);
        if (!res.ok) {
            console.log('Status:', res.status);
            return;
        }

        const data = await res.json();
        console.log('--- DATA ---');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

checkSyndication('elonmusk');
