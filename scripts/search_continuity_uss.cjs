const https = require('https');

function searchGoogleOrUss(q) {
  return new Promise((resolve) => {
    https.get('https://www.uss.cl/?s=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...new Set(data.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [])];
        console.log('Query:', q, 'Matches:', matches.length);
        matches.filter(m => m.includes('uploads')).forEach(m => console.log('  ', m));
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function start() {
  await searchGoogleOrUss('bomberos');
  await searchGoogleOrUss('pamuss');
  await searchGoogleOrUss('cet concepcion');
  await searchGoogleOrUss('liceo tajamar');
}
start();
