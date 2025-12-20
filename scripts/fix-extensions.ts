// Fix image file extensions in database to match actual downloaded files
import { db, Images, eq } from 'astro:db';

// Update Hadrian and Antoninus Pius from .png to .jpg
const fixes = [
  { id: 67, oldFilename: 'hadrian-sestertius-1.png', newFilename: 'hadrian-sestertius-1.jpg' },
  { id: 68, oldFilename: 'antoninus-pius-sestertius-1.png', newFilename: 'antoninus-pius-sestertius-1.jpg' },
];

console.log('Fixing image file extensions...');

for (const fix of fixes) {
  await db.update(Images).set({ filename: fix.newFilename }).where(eq(Images.id, fix.id));
  console.log(`  Updated ID ${fix.id}: ${fix.oldFilename} -> ${fix.newFilename}`);
}

console.log('\nDone!');
