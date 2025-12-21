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
  // Check all tables
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Current tables:', tables.rows.map(r => r.name));

  // Check if there's an Astro DB snapshot table
  const snapshot = tables.rows.find(r => r.name.includes('snapshot') || r.name.includes('_astro'));
  if (snapshot) {
    const data = await client.execute(`SELECT * FROM "${snapshot.name}"`);
    console.log('Snapshot data:', data.rows);
  }

  // Check BlogPosts schema
  const schema = await client.execute("PRAGMA table_info(BlogPosts)");
  console.log('BlogPosts columns:', schema.rows.map(r => r.name));
}

main().then(() => client.close()).catch(console.error);
