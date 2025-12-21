import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';

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

// Get all images with coin info
const images = await client.execute(`
  SELECT i.*, c.name as coinName, c.slug as coinSlug
  FROM Images i
  JOIN Coins c ON i.coinId = c.id
  ORDER BY c.name, i.sortOrder
`);

console.log('=== Current Image Records ===\n');
const missing = [];
const existing = [];

for (const img of images.rows) {
  const path = `./public/images/coins/${img.filename}`;
  const fileExists = existsSync(path);
  if (fileExists) {
    existing.push(img);
  } else {
    missing.push(img);
    console.log(`❌ MISSING: ${img.coinName}`);
    console.log(`   File: ${img.filename}`);
    console.log(`   ID: ${img.id}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total image records: ${images.rows.length}`);
console.log(`Existing files: ${existing.length}`);
console.log(`Missing files: ${missing.length}`);

await client.close();
