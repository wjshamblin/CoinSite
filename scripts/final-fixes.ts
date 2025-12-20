// Final image fixes:
// 1. Update Alexander Stater from .jpg to .png (we downloaded .png)
// 2. Delete GB Predecimal Set coin and image (not in lordmarcovan collection - just placeholder)
import { db, Images, Coins, eq } from 'astro:db';

console.log('=== Final Image Fixes ===\n');

// Fix Alexander Stater extension
console.log('1. Fixing Alexander Stater extension...');
await db.update(Images).set({ filename: 'alexander-stater-1.png' }).where(eq(Images.id, 21));
console.log('   Updated: alexander-stater-1.jpg -> alexander-stater-1.png');

// Delete GB Predecimal Set image and coin (placeholder data)
console.log('\n2. Removing placeholder GB Predecimal Set...');
await db.delete(Images).where(eq(Images.id, 41));
console.log('   Deleted image record ID 41');

// Find and delete the coin
const gbCoins = await db.select().from(Coins).where(eq(Coins.slug, 'gb-predecimal-proof-1970'));
if (gbCoins.length > 0) {
  await db.delete(Coins).where(eq(Coins.id, gbCoins[0].id));
  console.log(`   Deleted coin: ${gbCoins[0].name} (ID ${gbCoins[0].id})`);
}

console.log('\nDone! All images should now be working.');
