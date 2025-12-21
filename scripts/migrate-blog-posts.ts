// Migrate blog posts from markdown files to database
import { db, BlogPosts } from 'astro:db';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const blogDir = join(process.cwd(), 'src', 'content', 'blog');

console.log('=== Migrating Blog Posts to Database ===\n');

const files = await readdir(blogDir);
const mdFiles = files.filter(f => f.endsWith('.md'));

let nextId = 1;

for (const file of mdFiles) {
  const slug = file.replace('.md', '');
  const filePath = join(blogDir, file);
  const content = await readFile(filePath, 'utf-8');

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${file} - no frontmatter found`);
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
  const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();
  const heroImage = heroImageMatch ? heroImageMatch[1] : null;

  // Insert into database
  await db.insert(BlogPosts).values({
    id: nextId++,
    slug,
    title,
    description,
    content: markdownContent,
    heroImage,
    pubDate,
    createdAt: new Date(),
  });

  console.log(`Migrated: ${title} (${slug})`);
}

console.log(`\n=== Migration Complete: ${nextId - 1} posts migrated ===`);
