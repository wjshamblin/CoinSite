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

// This schema exactly matches db/config.ts
const newSnapshot = {
  version: "2024-03-12",
  schema: {
    Collections: {
      columns: {
        id: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "Collections", primaryKey: true } },
        name: { type: "text", schema: { unique: true, deprecated: false, name: "name", collection: "Collections", primaryKey: false, optional: false } },
        slug: { type: "text", schema: { unique: true, deprecated: false, name: "slug", collection: "Collections", primaryKey: false, optional: false } },
        description: { type: "text", schema: { unique: false, deprecated: false, name: "description", collection: "Collections", primaryKey: false, optional: false } },
        thumbnail: { type: "text", schema: { unique: false, deprecated: false, name: "thumbnail", collection: "Collections", primaryKey: false, optional: false } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "Collections", default: "NOW" } }
      },
      deprecated: false,
      indexes: {}
    },
    Coins: {
      columns: {
        id: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "Coins", primaryKey: true } },
        collectionId: { type: "number", schema: { unique: false, deprecated: false, name: "collectionId", collection: "Coins", primaryKey: false, optional: false, references: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "Collections", primaryKey: true } } } },
        name: { type: "text", schema: { unique: false, deprecated: false, name: "name", collection: "Coins", primaryKey: false, optional: false } },
        slug: { type: "text", schema: { unique: false, deprecated: false, name: "slug", collection: "Coins", primaryKey: false, optional: false } },
        description: { type: "text", schema: { unique: false, deprecated: false, name: "description", collection: "Coins", primaryKey: false, optional: true } },
        year: { type: "number", schema: { unique: false, deprecated: false, name: "year", collection: "Coins", primaryKey: false, optional: true } },
        mintage: { type: "text", schema: { unique: false, deprecated: false, name: "mintage", collection: "Coins", primaryKey: false, optional: true } },
        condition: { type: "text", schema: { unique: false, deprecated: false, name: "condition", collection: "Coins", primaryKey: false, optional: true } },
        primaryImage: { type: "text", schema: { unique: false, deprecated: false, name: "primaryImage", collection: "Coins", primaryKey: false, optional: false } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "Coins", default: "NOW" } }
      },
      indexes: { collectionSlugIdx: { on: ["collectionId", "slug"], unique: true } },
      deprecated: false
    },
    Images: {
      columns: {
        id: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "Images", primaryKey: true } },
        coinId: { type: "number", schema: { unique: false, deprecated: false, name: "coinId", collection: "Images", primaryKey: false, optional: false, references: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "Coins", primaryKey: true } } } },
        filename: { type: "text", schema: { unique: false, deprecated: false, name: "filename", collection: "Images", primaryKey: false, optional: false } },
        title: { type: "text", schema: { unique: false, deprecated: false, name: "title", collection: "Images", primaryKey: false, optional: false } },
        alt: { type: "text", schema: { unique: false, deprecated: false, name: "alt", collection: "Images", primaryKey: false, optional: false } },
        description: { type: "text", schema: { unique: false, deprecated: false, name: "description", collection: "Images", primaryKey: false, optional: true } },
        isPrimary: { type: "boolean", schema: { optional: false, unique: false, deprecated: false, name: "isPrimary", collection: "Images", default: false } },
        sortOrder: { type: "number", schema: { unique: false, deprecated: false, name: "sortOrder", collection: "Images", primaryKey: false, optional: false, default: 1 } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "Images", default: "NOW" } }
      },
      indexes: { coinIdIdx: { on: ["coinId"] }, primaryIdx: { on: ["coinId", "isPrimary"] } },
      deprecated: false
    },
    AdminUsers: {
      columns: {
        id: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "AdminUsers", primaryKey: true } },
        username: { type: "text", schema: { unique: true, deprecated: false, name: "username", collection: "AdminUsers", primaryKey: false, optional: false } },
        passwordHash: { type: "text", schema: { unique: false, deprecated: false, name: "passwordHash", collection: "AdminUsers", primaryKey: false, optional: false } },
        email: { type: "text", schema: { unique: false, deprecated: false, name: "email", collection: "AdminUsers", primaryKey: false, optional: true } },
        isActive: { type: "boolean", schema: { optional: false, unique: false, deprecated: false, name: "isActive", collection: "AdminUsers", default: true } },
        lastLogin: { type: "date", schema: { optional: true, unique: false, deprecated: false, name: "lastLogin", collection: "AdminUsers" } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "AdminUsers", default: "NOW" } }
      },
      indexes: { usernameIdx: { on: ["username"], unique: true } },
      deprecated: false
    },
    AdminSessions: {
      columns: {
        id: { type: "text", schema: { unique: false, deprecated: false, name: "id", collection: "AdminSessions", primaryKey: true } },
        userId: { type: "number", schema: { unique: false, deprecated: false, name: "userId", collection: "AdminSessions", primaryKey: false, optional: false, references: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "AdminUsers", primaryKey: true } } } },
        expiresAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "expiresAt", collection: "AdminSessions" } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "AdminSessions", default: "NOW" } }
      },
      indexes: { userIdIdx: { on: ["userId"] }, expiresIdx: { on: ["expiresAt"] } },
      deprecated: false
    },
    BlogPosts: {
      columns: {
        id: { type: "number", schema: { unique: false, deprecated: false, name: "id", collection: "BlogPosts", primaryKey: true } },
        slug: { type: "text", schema: { unique: true, deprecated: false, name: "slug", collection: "BlogPosts", primaryKey: false, optional: false } },
        title: { type: "text", schema: { unique: false, deprecated: false, name: "title", collection: "BlogPosts", primaryKey: false, optional: false } },
        description: { type: "text", schema: { unique: false, deprecated: false, name: "description", collection: "BlogPosts", primaryKey: false, optional: false } },
        content: { type: "text", schema: { unique: false, deprecated: false, name: "content", collection: "BlogPosts", primaryKey: false, optional: false } },
        heroImage: { type: "text", schema: { unique: false, deprecated: false, name: "heroImage", collection: "BlogPosts", primaryKey: false, optional: true } },
        pubDate: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "pubDate", collection: "BlogPosts" } },
        updatedDate: { type: "date", schema: { optional: true, unique: false, deprecated: false, name: "updatedDate", collection: "BlogPosts" } },
        createdAt: { type: "date", schema: { optional: false, unique: false, deprecated: false, name: "createdAt", collection: "BlogPosts", default: "NOW" } }
      },
      indexes: { slugIdx: { on: ["slug"], unique: true }, pubDateIdx: { on: ["pubDate"] } },
      deprecated: false
    }
  }
};

async function main() {
  const snapshotStr = JSON.stringify(newSnapshot);

  await client.execute({
    sql: "UPDATE _astro_db_snapshot SET snapshot = ? WHERE id = 1",
    args: [snapshotStr]
  });

  console.log('Snapshot updated to match local config!');

  // Verify
  const result = await client.execute("SELECT snapshot FROM _astro_db_snapshot WHERE id = 1");
  const verified = JSON.parse(result.rows[0].snapshot);
  console.log('Tables in snapshot:', Object.keys(verified.schema));
}

main().then(() => client.close()).catch(err => {
  console.error(err);
  client.close();
});
