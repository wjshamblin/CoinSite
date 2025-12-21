import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const envFile = readFileSync('/Users/wjs/Documents/Programming/CoinSite/.env', 'utf-8');
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

// Get collections
const collections = await client.execute('SELECT id, name, slug, thumbnail FROM Collections ORDER BY name');
console.log('=== Collections ===\n');
for (const c of collections.rows) {
  // Get a representative coin from each collection
  const coins = await client.execute(`
    SELECT c.id, c.name, c.primaryImage,
           (SELECT filename FROM Images WHERE coinId = c.id AND isPrimary = 1 LIMIT 1) as primaryImageFile
    FROM Coins c
    WHERE c.collectionId = ${c.id}
    LIMIT 3
  `);
  console.log(c.name + ' (' + c.slug + ')');
  console.log('  Current thumbnail: ' + c.thumbnail);
  console.log('  Sample coins:');
  for (const coin of coins.rows) {
    console.log('    - ' + coin.name + ': ' + (coin.primaryImage || coin.primaryImageFile || 'no image'));
  }
  console.log('');
}

await client.close();
