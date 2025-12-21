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

// Get the statements from dry-run and execute them with FK off
const statements = [
  "PRAGMA foreign_keys = OFF",
  "CREATE TABLE \"Collections_new\" (\"id\" integer PRIMARY KEY, \"name\" text NOT NULL UNIQUE, \"slug\" text NOT NULL UNIQUE, \"description\" text NOT NULL, \"thumbnail\" text NOT NULL, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"Collections_new\" (\"id\", \"name\", \"slug\", \"description\", \"thumbnail\", \"createdAt\") SELECT \"id\", \"name\", \"slug\", \"description\", \"thumbnail\", \"createdAt\" FROM \"Collections\"",
  "DROP TABLE \"Collections\"",
  "ALTER TABLE \"Collections_new\" RENAME TO \"Collections\"",
  "CREATE TABLE \"Coins_new\" (\"id\" integer PRIMARY KEY, \"collectionId\" integer NOT NULL REFERENCES \"Collections\" (\"id\"), \"name\" text NOT NULL, \"slug\" text NOT NULL, \"description\" text, \"year\" integer, \"mintage\" text, \"condition\" text, \"primaryImage\" text NOT NULL, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"Coins_new\" (\"id\", \"collectionId\", \"name\", \"slug\", \"description\", \"year\", \"mintage\", \"condition\", \"primaryImage\", \"createdAt\") SELECT \"id\", \"collectionId\", \"name\", \"slug\", \"description\", \"year\", \"mintage\", \"condition\", \"primaryImage\", \"createdAt\" FROM \"Coins\"",
  "DROP TABLE \"Coins\"",
  "ALTER TABLE \"Coins_new\" RENAME TO \"Coins\"",
  "CREATE UNIQUE INDEX \"collectionSlugIdx\" ON \"Coins\" (\"collectionId\", \"slug\")",
  "CREATE TABLE \"Images_new\" (\"id\" integer PRIMARY KEY, \"coinId\" integer NOT NULL REFERENCES \"Coins\" (\"id\"), \"filename\" text NOT NULL, \"title\" text NOT NULL, \"alt\" text NOT NULL, \"description\" text, \"isPrimary\" integer NOT NULL DEFAULT FALSE, \"sortOrder\" integer NOT NULL DEFAULT 1, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"Images_new\" (\"id\", \"coinId\", \"filename\", \"title\", \"alt\", \"description\", \"isPrimary\", \"sortOrder\", \"createdAt\") SELECT \"id\", \"coinId\", \"filename\", \"title\", \"alt\", \"description\", \"isPrimary\", \"sortOrder\", \"createdAt\" FROM \"Images\"",
  "DROP TABLE \"Images\"",
  "ALTER TABLE \"Images_new\" RENAME TO \"Images\"",
  "CREATE INDEX \"coinIdIdx\" ON \"Images\" (\"coinId\")",
  "CREATE INDEX \"primaryIdx\" ON \"Images\" (\"coinId\", \"isPrimary\")",
  "CREATE TABLE \"AdminUsers_new\" (\"id\" integer PRIMARY KEY, \"username\" text NOT NULL UNIQUE, \"passwordHash\" text NOT NULL, \"email\" text, \"isActive\" integer NOT NULL DEFAULT TRUE, \"lastLogin\" text, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"AdminUsers_new\" (\"id\", \"username\", \"passwordHash\", \"email\", \"isActive\", \"lastLogin\", \"createdAt\") SELECT \"id\", \"username\", \"passwordHash\", \"email\", \"isActive\", \"lastLogin\", \"createdAt\" FROM \"AdminUsers\"",
  "DROP TABLE \"AdminUsers\"",
  "ALTER TABLE \"AdminUsers_new\" RENAME TO \"AdminUsers\"",
  "CREATE UNIQUE INDEX \"usernameIdx\" ON \"AdminUsers\" (\"username\")",
  "CREATE TABLE \"AdminSessions_new\" (\"id\" text PRIMARY KEY, \"userId\" integer NOT NULL REFERENCES \"AdminUsers\" (\"id\"), \"expiresAt\" text NOT NULL, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"AdminSessions_new\" (\"id\", \"userId\", \"expiresAt\", \"createdAt\") SELECT \"id\", \"userId\", \"expiresAt\", \"createdAt\" FROM \"AdminSessions\"",
  "DROP TABLE \"AdminSessions\"",
  "ALTER TABLE \"AdminSessions_new\" RENAME TO \"AdminSessions\"",
  "CREATE INDEX \"userIdIdx\" ON \"AdminSessions\" (\"userId\")",
  "CREATE INDEX \"expiresIdx\" ON \"AdminSessions\" (\"expiresAt\")",
  "CREATE TABLE \"BlogPosts_new\" (\"id\" integer PRIMARY KEY, \"slug\" text NOT NULL UNIQUE, \"title\" text NOT NULL, \"description\" text NOT NULL, \"content\" text NOT NULL, \"heroImage\" text, \"pubDate\" text NOT NULL, \"updatedDate\" text, \"createdAt\" text NOT NULL DEFAULT '2025-12-21T10:24:36.947Z')",
  "INSERT INTO \"BlogPosts_new\" (\"id\", \"slug\", \"title\", \"description\", \"content\", \"heroImage\", \"pubDate\", \"updatedDate\", \"createdAt\") SELECT \"id\", \"slug\", \"title\", \"description\", \"content\", \"heroImage\", \"pubDate\", \"updatedDate\", \"createdAt\" FROM \"BlogPosts\"",
  "DROP TABLE \"BlogPosts\"",
  "ALTER TABLE \"BlogPosts_new\" RENAME TO \"BlogPosts\"",
  "CREATE UNIQUE INDEX \"slugIdx\" ON \"BlogPosts\" (\"slug\")",
  "CREATE INDEX \"pubDateIdx\" ON \"BlogPosts\" (\"pubDate\")",
  "PRAGMA foreign_keys = ON"
];

async function main() {
  console.log('Executing schema migration with FK disabled...');

  for (const stmt of statements) {
    try {
      console.log('Running:', stmt.substring(0, 60) + '...');
      await client.execute(stmt);
    } catch (err) {
      console.error('Error on:', stmt);
      console.error(err.message);
      throw err;
    }
  }

  console.log('Migration complete!');
}

main().then(() => client.close()).catch(err => {
  console.error(err);
  client.close();
  process.exit(1);
});
