const https = require('https');

function searchCdn(query) {
  return new Promise((resolve) => {
    https.get('https://vcm.uss.cl/?s=' + encodeURIComponent(query), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...new Set(data.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [])];
        console.log('Query:', query, 'Matches:', matches.length);
        matches.filter(m => m.includes('cdn.uss.cl') || m.includes('wp-content')).forEach(m => console.log('  ', m));
        resolve();
      });
    }).on('error', (e) => {
      console.error(e);
      resolve();
    });
  });
}

async function start() {
  await searchCdn('bomberos');
  await searchCdn('pamuss');
  await searchCdn('cet concepcion');
  await searchCdn('adolescentes');
}
start();
