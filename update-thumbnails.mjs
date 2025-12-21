import { createClient } from '@libsql/client';
import { readFileSync, existsSync, copyFileSync } from 'fs';

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

// Define the best representative coin image for each collection
const collectionThumbnails = {
  'ancient-greek': 'coins/athenian-tetradrachm-1.jpg',
  'ancient-roman': 'coins/augustus-denarius-1.jpg',
  'ancient-indian-gold': 'coins/vijayanagara-bele-1.jpg',
  'medieval-english-hammered': 'coins/edward-i-penny-1.jpg',
  'world-coins': 'coins/australia-parliament-florin-1927-1.jpg',
  'error-coins-varieties': 'coins/lincoln-double-clipped-1.jpg',
};

console.log('=== Updating Collection Thumbnails ===\n');

for (const [slug, thumbnail] of Object.entries(collectionThumbnails)) {
  // Check if image exists
  const imagePath = './public/images/' + thumbnail;
  if (!existsSync(imagePath)) {
    console.log('SKIP: ' + slug + ' - Image not found: ' + thumbnail);
    continue;
  }

  // Update database
  await client.execute({
    sql: 'UPDATE Collections SET thumbnail = ? WHERE slug = ?',
    args: [thumbnail, slug]
  });
  console.log('Updated: ' + slug + ' -> ' + thumbnail);
}

// Show final state
console.log('\n=== Final Collection Thumbnails ===\n');
const collections = await client.execute('SELECT name, slug, thumbnail FROM Collections ORDER BY name');
for (const c of collections.rows) {
  console.log(c.name + ': ' + c.thumbnail);
}

await client.close();
console.log('\nDone!');
