import { createClient } from '@libsql/client';
import { existsSync, readFileSync } from 'fs';

// Load .env manually
const envFile = readFileSync('.env', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
}

const client = createClient({
  url: env.ASTRO_DB_REMOTE_URL,
  authToken: env.ASTRO_DB_APP_TOKEN,
});

// Get all coins with their image info
const coins = await client.execute(`
  SELECT c.id, c.name, c.slug, col.slug as collection_slug,
         (SELECT COUNT(*) FROM Images WHERE coinId = c.id) as image_count,
         (SELECT filename FROM Images WHERE coinId = c.id LIMIT 1) as first_image
  FROM Coins c
  JOIN Collections col ON c.collectionId = col.id
  ORDER BY col.name, c.name
`);

console.log('=== Coins and Image Status ===\n');
let missing = [];
let hasImages = [];
let brokenImages = [];

for (const coin of coins.rows) {
  const url = `/collections/${coin.collection_slug}/${coin.slug}`;
  if (coin.image_count === 0) {
    missing.push({ name: coin.name, url, slug: coin.slug });
  } else {
    const path = `./public/images/coins/${coin.first_image}`;
    const exists = existsSync(path);
    if (exists) {
      hasImages.push({ name: coin.name, url, filename: coin.first_image });
    } else {
      brokenImages.push({ name: coin.name, url, filename: coin.first_image });
    }
  }
}

console.log('=== MISSING IMAGES (no record in DB) ===');
for (const coin of missing) {
  console.log(`  ${coin.name}`);
  console.log(`    URL: ${coin.url}`);
}

console.log('\n=== BROKEN IMAGES (DB record but file missing) ===');
for (const coin of brokenImages) {
  console.log(`  ${coin.name}`);
  console.log(`    Expected: ${coin.filename}`);
  console.log(`    URL: ${coin.url}`);
}

console.log('\n=== Summary ===');
console.log(`Total coins: ${coins.rows.length}`);
console.log(`Working images: ${hasImages.length}`);
console.log(`No image record: ${missing.length}`);
console.log(`Broken (file missing): ${brokenImages.length}`);

await client.close();
