async function listAll() {
  try {
    const r = await fetch('https://anchor.fm/s/1106186fc/podcast/rss');
    const t = await r.text();
    const items = t.split('<item>');
    for (let i = 1; i < items.length; i++) {
        const item = items[i];
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
        const urlMatch = item.match(/<enclosure url="(.*?)"/);
        if (titleMatch && urlMatch) {
            console.log(`${titleMatch[1]} | ${urlMatch[1]}`);
        }
    }
  } catch (e) {
    console.error(e);
  }
}
listAll();
