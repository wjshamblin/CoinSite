import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

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

// Update Greek collection thumbnail
await client.execute({
  sql: "UPDATE Collections SET thumbnail = ? WHERE slug = ?",
  args: ['coins/athens-owl-tetradrachm-1.jpg', 'ancient-greek']
});

console.log('Updated Ancient Greek collection thumbnail to athens-owl-tetradrachm-1.jpg');

await client.close();
