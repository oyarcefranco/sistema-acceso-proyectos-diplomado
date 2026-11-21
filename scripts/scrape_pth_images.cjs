const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchUrl('https://vcm.uss.cl');
  const regex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;
  const matches = [...new Set(html.match(regex) || [])];
  console.log('Images on vcm.uss.cl:');
  matches.forEach(img => {
    if (img.toLowerCase().includes('pth') || img.toLowerCase().includes('hito') || img.toLowerCase().includes('programa') || img.toLowerCase().includes('azul') || img.toLowerCase().includes('parque') || img.toLowerCase().includes('mayor') || img.toLowerCase().includes('turismo') || img.toLowerCase().includes('sinergia') || img.toLowerCase().includes('banner') || img.toLowerCase().includes('fondo') || img.toLowerCase().includes('territorial')) {
      console.log('MATCH:', img);
    }
  });

  console.log('\nAll images on vcm.uss.cl (sample):');
  matches.slice(0, 30).forEach(img => console.log('IMG:', img));
}

run();
