const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'imagenes', 'pth');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imagesToDownload = [
  {
    name: 'mas-azul.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/01/MAS-AZUL-1024x663.jpg'
  },
  {
    name: 'mas-parques.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/01/MAS-PARQUES-PATAGONIA-1-1024x664.jpg'
  },
  {
    name: 'mas-personas-mayores.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/02/MAS-PERSONAS-MAYORES-1024x663.jpg'
  },
  {
    name: 'mas-turismo.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/01/MAS-TURISMO-1024x663.jpg'
  },
  {
    name: 'mas-sinergia.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/01/MAS-SINERGIA-1024x663.jpg'
  },
  {
    name: 'banner-pth.jpg',
    url: 'https://cdn.uss.cl/vcm/2025/01/PTH-1024x682.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  for (const item of imagesToDownload) {
    const dest = path.join(targetDir, item.name);
    try {
      console.log(`Downloading ${item.url} -> ${item.name}...`);
      await download(item.url, dest);
    } catch (e) {
      console.error(`Error with ${item.name}:`, e.message);
    }
  }
}

start();
