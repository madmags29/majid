const fs = require('fs');
const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
}

async function main() {
  const content = fs.readFileSync('frontend/lib/destinations.ts', 'utf-8');
  const urls = [];
  const regex = /image:\s*['"](https?:\/\/[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  
  const contentPage = fs.readFileSync('frontend/app/page.tsx', 'utf-8');
  const regexPage = /image:\s*['"](https?:\/\/[^'"]+)['"]/g;
  while ((match = regexPage.exec(contentPage)) !== null) {
    if (!urls.includes(match[1])) {
      urls.push(match[1]);
    }
  }

  console.log(`Checking ${urls.length} unique images...`);
  
  // Batch requests to avoid overwhelming the server
  const broken = [];
  for (let i = 0; i < urls.length; i += 10) {
    const batch = urls.slice(i, i + 10);
    const results = await Promise.all(batch.map(checkUrl));
    for (const res of results) {
      if (res.status >= 400 || res.error) {
        broken.push(res);
      }
    }
  }
  
  console.log('Broken images:');
  console.log(JSON.stringify(broken, null, 2));
}

main();
