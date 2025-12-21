import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';

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

// Map collections to unique coin images
const thumbnails = {
  'ancient-greek': 'coins/alexander-stater-1.png',
  'ancient-roman': 'coins/antoninus-pius-sestertius-1.jpg',
  'ancient-indian-gold': 'coins/vijayanagara-bele-1.jpg',
  'medieval-english-hammered': 'coins/james-i-laurel-1623-1.png',
  'world-coins': 'coins/australia-parliament-florin-1927-1.jpg',
  'error-coins-varieties': 'coins/peru-10-centavos-1879-1.png', // Temporary - this collection needs real error coin
};

console.log('=== Updating Collection Thumbnails ===\n');

for (const [slug, thumbnail] of Object.entries(thumbnails)) {
  const imagePath = './public/images/' + thumbnail;
  if (!existsSync(imagePath)) {
    console.log('SKIP ' + slug + ' - Image not found: ' + thumbnail);
    continue;
  }

  await client.execute({
    sql: 'UPDATE Collections SET thumbnail = ? WHERE slug = ?',
    args: [thumbnail, slug]
  });
  console.log('Updated: ' + slug + ' -> ' + thumbnail);
}

// Verify
console.log('\n=== Final Thumbnails ===\n');
const collections = await client.execute('SELECT name, slug, thumbnail FROM Collections ORDER BY name');
for (const c of collections.rows) {
  console.log(c.slug + ': ' + c.thumbnail);
}

await client.close();
