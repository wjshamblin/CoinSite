// Remove placeholder coins that aren't in the lordmarcovan collection
import { db, Coins, eq } from 'astro:db';

const placeholderSlugs = [
  'edward-noble',
  'frederick-augustalis',
  'louis-denier',
  'aurelius-sestertius',
  'nero-aureus',
];

console.log('=== Removing Placeholder Coins ===\n');

for (const slug of placeholderSlugs) {
  const coins = await db.select().from(Coins).where(eq(Coins.slug, slug));
  if (coins.length > 0) {
    await db.delete(Coins).where(eq(Coins.slug, slug));
    console.log(`Deleted: ${coins[0].name} (${slug})`);
  }
}

console.log('\nDone! Removed placeholder coins that had no images.');
