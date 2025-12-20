// Fix image records in the database
// 1. Update Athenian Tetradrachm filenames to match actual files
// 2. Delete extra image records (-2, -3, etc.) that don't exist
// 3. Find and download missing coin images from CoinTalk

import { db, Images, eq, and, like } from 'astro:db';

// Fix Athenian Tetradrachm filenames (DB has 'athenian-tetradrachm', files are 'athens-owl-tetradrachm')
const athenianImages = await db.select().from(Images).where(like(Images.filename, 'athenian-tetradrachm%'));
console.log(`Fixing ${athenianImages.length} Athenian Tetradrachm records...`);

for (const img of athenianImages) {
  const newFilename = img.filename.replace('athenian-tetradrachm', 'athens-owl-tetradrachm');
  await db.update(Images).set({ filename: newFilename }).where(eq(Images.id, img.id));
  console.log(`  Updated: ${img.filename} -> ${newFilename}`);
}

// Delete image records that reference non-existent files (the -2, -3, -4, -5 placeholders)
// These are from the original seed data that expected multiple images per coin
const deleteIds = [
  // Augustus Denarius -2 through -5
  2, 3, 4, 5,
  // Trajan Aureus -2 through -5
  7, 8, 9, 10,
  // Caesar Denarius -2 through -5
  12, 13, 14, 15,
  // Alexander Stater (all 5 - we don't have this coin's images yet, but keeping record for -1)
  22, 23, 24, 25,
  // Edward I Penny -2 through -5
  27, 28, 29, 30,
  // Charles I Penny -2 through -5
  32, 33, 34, 35,
  // Lincoln Double Clipped -2 through -5
  37, 38, 39, 40,
  // GB Predecimal Set -2 through -5 (keep -1 for now)
  42, 43, 44, 45,
  // Vijayanagara Gold Bele -2 through -5 (keep -1)
  47, 48, 49, 50,
  // Marcus Aurelius Sestertius -3 through -6 (we have -2)
  52, 53, 54, 55,
];

console.log(`\nDeleting ${deleteIds.length} placeholder image records...`);
for (const id of deleteIds) {
  await db.delete(Images).where(eq(Images.id, id));
}

console.log('\nImage records cleaned up successfully!');

// Summary of remaining missing images that need to be found:
console.log('\n=== Still Missing (need to find on CoinTalk) ===');
console.log('1. Alexander Stater (ID 21) - alexander-stater-1.jpg');
console.log('2. GB Predecimal Proof Set (ID 41) - gb-predecimal-set-1.jpg');
console.log('3. Vijayanagara Gold Bele (ID 46) - vijayanagara-bele-1.jpg');
console.log('4. Hadrian Sestertius (ID 67) - hadrian-sestertius-1.png');
console.log('5. Antoninus Pius Sestertius (ID 68) - antoninus-pius-sestertius-1.png');
console.log('6. Julian II Siliqua (ID 69) - julian-ii-siliqua-1.png');
