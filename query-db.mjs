import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.ASTRO_DB_REMOTE_URL,
  authToken: process.env.ASTRO_DB_APP_TOKEN,
});

const collections = await client.execute('SELECT id, name, slug FROM Collections ORDER BY id');
console.log('=== COLLECTIONS ===');
console.log(JSON.stringify(collections.rows, null, 2));

const coins = await client.execute('SELECT id, collectionId, name, slug, year, condition FROM Coins ORDER BY collectionId, id');
console.log('\n=== COINS ===');
console.log(JSON.stringify(coins.rows, null, 2));

process.exit(0);
