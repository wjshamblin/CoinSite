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

console.log('Creating BlogPosts table...\n');

// Create the BlogPosts table
await client.execute(`
  CREATE TABLE IF NOT EXISTS BlogPosts (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    heroImage TEXT,
    pubDate INTEGER NOT NULL,
    updatedDate INTEGER,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )
`);

// Create indexes
await client.execute(`CREATE INDEX IF NOT EXISTS BlogPosts_slug_idx ON BlogPosts(slug)`);
await client.execute(`CREATE INDEX IF NOT EXISTS BlogPosts_pubDate_idx ON BlogPosts(pubDate)`);

console.log('BlogPosts table created successfully!');

await client.close();
