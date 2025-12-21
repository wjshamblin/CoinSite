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

async function main() {
  const result = await client.execute('SELECT id, slug, pubDate, typeof(pubDate) as pubDateType, createdAt, typeof(createdAt) as createdAtType FROM BlogPosts LIMIT 3');
  console.log('Blog post dates:');
  for (const row of result.rows) {
    console.log(row);
  }
}

main().then(() => client.close()).catch(console.error);
