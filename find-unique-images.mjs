import { readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';

const coinsDir = './public/images/coins';
const duplicateHash = 'fdf2a66facc1da0a1106bc7170cf461a';

const files = readdirSync(coinsDir).filter(f => f.endsWith('-1.jpg') || f.endsWith('-1.png'));

console.log('=== Unique Primary Coin Images ===\n');

for (const file of files) {
  const filePath = join(coinsDir, file);
  const content = readFileSync(filePath);
  const hash = createHash('md5').update(content).digest('hex');

  if (hash !== duplicateHash) {
    console.log(file);
  }
}
