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
  // Get current snapshot
  const result = await client.execute("SELECT * FROM _astro_db_snapshot WHERE id = 1");
  const currentSnapshot = JSON.parse(result.rows[0].snapshot);

  console.log('Current tables in snapshot:', Object.keys(currentSnapshot.schema));

  // Add BlogPosts to schema
  currentSnapshot.schema.BlogPosts = {
    columns: {
      id: {
        type: "number",
        schema: { unique: false, deprecated: false, name: "id", collection: "BlogPosts", primaryKey: true }
      },
      slug: {
        type: "text",
        schema: { unique: true, deprecated: false, name: "slug", collection: "BlogPosts", primaryKey: false, optional: false }
      },
      title: {
        type: "text",
        schema: { unique: false, deprecated: false, name: "title", collection: "BlogPosts", primaryKey: false, optional: false }
      },
      description: {
        type: "text",
        schema: { unique: false, deprecated: false, name: "description", collection: "BlogPosts", primaryKey: false, optional: false }
      },
      content: {
        type: "text",
        schema: { unique: false, deprecated: false, name: "content", collection: "BlogPosts", primaryKey: false, optional: false }
      },
      heroImage: {
        type: "text",
        schema: { unique: false, deprecated: false, name: "heroImage", collection: "BlogPosts", primaryKey: false, optional: true }
      },
      pubDate: {
        type: "date",
        schema: { optional: false, unique: false, deprecated: false, name: "pubDate", collection: "BlogPosts" }
      },
      updatedDate: {
        type: "date",
        schema: { optional: true, unique: false, deprecated: false, name: "updatedDate", collection: "BlogPosts" }
      },
      createdAt: {
        type: "date",
        schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "BlogPosts", default: "2025-12-21T00:00:00.000Z" }
      }
    },
    deprecated: false,
    indexes: {
      slugIdx: { on: ["slug"], unique: true },
      pubDateIdx: { on: ["pubDate"] }
    }
  };

  const newSnapshotStr = JSON.stringify(currentSnapshot);

  // Update the snapshot
  await client.execute({
    sql: "UPDATE _astro_db_snapshot SET snapshot = ? WHERE id = 1",
    args: [newSnapshotStr]
  });

  console.log('Updated tables in snapshot:', Object.keys(currentSnapshot.schema));
  console.log('Schema snapshot updated successfully!');
}

main().then(() => client.close()).catch(err => {
  console.error(err);
  client.close();
});
