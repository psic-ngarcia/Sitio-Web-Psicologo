async function getPodcastData() {
  try {
    const response = await fetch('https://anchor.fm/s/1106186fc/podcast/rss');
    const text = await response.text();
    const items = text.split('<item>');
    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1];
      const url = item.match(/<enclosure url="(.*?)"/)?.[1];
      if (title && title.toLowerCase().includes('ansiedad')) {
        console.log(`TITLE: ${title}`);
        console.log(`URL: ${url}`);
        return;
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getPodcastData();
