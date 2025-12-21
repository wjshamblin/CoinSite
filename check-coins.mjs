import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

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

// Get all coins with their image count
const coins = await client.execute(`
  SELECT c.id, c.name, c.slug, col.name as collectionName,
         (SELECT COUNT(*) FROM Images WHERE coinId = c.id) as imageCount
  FROM Coins c
  JOIN Collections col ON c.collectionId = col.id
  ORDER BY c.name
`);

console.log('=== Coins Without Images ===\n');
let noImages = 0;
let withImages = 0;

for (const coin of coins.rows) {
  if (coin.imageCount === 0) {
    noImages++;
    console.log(`❌ ${coin.name}`);
    console.log(`   Collection: ${coin.collectionName}`);
    console.log(`   Slug: ${coin.slug}`);
  } else {
    withImages++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total coins: ${coins.rows.length}`);
console.log(`With images: ${withImages}`);
console.log(`Without images: ${noImages}`);

await client.close();
