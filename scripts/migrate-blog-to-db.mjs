import { createClient } from '@libsql/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

const blogDir = './src/content/blog';

console.log('=== Migrating Blog Posts to Database ===\n');

const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));

let nextId = 1;

for (const file of files) {
  const slug = file.replace('.md', '');
  const filePath = join(blogDir, file);
  const content = readFileSync(filePath, 'utf-8');

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log('Skipping ' + file + ' - no frontmatter found');
    continue;
  }

  const frontmatter = frontmatterMatch[1];
  const markdownContent = frontmatterMatch[2].trim();

  // Extract values from frontmatter
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
  const descriptionMatch = frontmatter.match(/description:\s*["'](.+?)["']/);
  const pubDateMatch = frontmatter.match(/pubDate:\s*["'](.+?)["']/);
  const heroImageMatch = frontmatter.match(/heroImage:\s*["'](.+?)["']/);

  const title = titleMatch ? titleMatch[1] : slug;
  const description = descriptionMatch ? descriptionMatch[1] : '';
  const pubDateStr = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
  const pubDate = new Date(pubDateStr).getTime();
  const heroImage = heroImageMatch ? heroImageMatch[1] : null;
  const createdAt = Date.now();

  // Insert into database
  await client.execute({
    sql: `INSERT OR REPLACE INTO BlogPosts (id, slug, title, description, content, heroImage, pubDate, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [nextId++, slug, title, description, markdownContent, heroImage, pubDate, createdAt]
  });

  console.log('Migrated: ' + title + ' (' + slug + ')');
}

console.log('\n=== Migration Complete: ' + (nextId - 1) + ' posts migrated ===');

await client.close();
