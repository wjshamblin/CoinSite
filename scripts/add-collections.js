// Script to add new collections for lordmarcovan's finds
import { db, Collections, Coins, Images } from '../db/config.ts';

const newCollections = [
  {
    id: 7,
    name: 'Medieval English Hammered',
    slug: 'medieval-english-hammered',
    description: 'Medieval English hammered silver coins spanning from the 13th to 17th centuries, including finds from metal detecting expeditions.',
    thumbnail: 'medieval-hammered-collection.jpg',
    createdAt: new Date()
  },
  {
    id: 8,
    name: 'Error Coins & Varieties',
    slug: 'error-coins-varieties',
    description: 'Modern error coins, planchet varieties, and unusual minting anomalies from various countries.',
    thumbnail: 'error-coins-collection.jpg',
    createdAt: new Date()
  },
  {
    id: 9,
    name: 'World Predecimal Sets',
    slug: 'world-predecimal-sets',
    description: 'Complete sets and individual coins from the pre-decimal era of various countries, particularly British Commonwealth.',
    thumbnail: 'predecimal-collection.jpg',
    createdAt: new Date()
  },
  {
    id: 10,
    name: 'Ancient Indian Gold',
    slug: 'ancient-indian-gold',
    description: 'Tiny gold coins from ancient Indian kingdoms, including the famous miniature fanams and beles.',
    thumbnail: 'indian-gold-collection.jpg',
    createdAt: new Date()
  }
];

const newCoins = [
  // Medieval English Hammered Collection
  {
    id: 11,
    collectionId: 7,
    name: 'Edward I Silver Penny',
    slug: 'edward-i-penny-london',
    description: 'Silver penny from Edward I\'s reign, minted in London ca. 1300-1310. Found during metal detecting in Essex, England. Features the characteristic "Long Cross" type with medieval portrait style.',
    year: 1305,
    mintage: 'Unknown',
    condition: 'Very Good',
    primaryImage: 'edward-i-penny-1.jpg',
    createdAt: new Date()
  },
  {
    id: 12,
    collectionId: 7,
    name: 'Charles I Hammered Penny',
    slug: 'charles-i-penny-1642',
    description: 'Silver penny from Charles I, dated 1641-1643 with 2 dots mintmark. Found during metal detecting expedition in Colchester area.',
    year: 1642,
    mintage: 'Limited',
    condition: 'Fine',
    primaryImage: 'charles-i-penny-1.jpg',
    createdAt: new Date()
  },

  // Error Coins & Varieties Collection
  {
    id: 13,
    collectionId: 8,
    name: '1969 Lincoln Cent Double Clipped',
    slug: 'lincoln-cent-double-clipped-1969',
    description: 'Rare 1969 bronze Lincoln Memorial cent with double clipped planchet error. Certified by PCGS as MS64 RB.',
    year: 1969,
    mintage: 'Error - Very Rare',
    condition: 'MS64 RB',
    primaryImage: 'lincoln-double-clipped-1.jpg',
    createdAt: new Date()
  },

  // World Predecimal Sets Collection
  {
    id: 14,
    collectionId: 9,
    name: '1970 GB Predecimal Proof Set',
    slug: 'gb-predecimal-proof-1970',
    description: 'Complete 1970 Great Britain predecimal proof set - the last of the predecimal coinage. Includes 8 coins plus commemorative plaque.',
    year: 1970,
    mintage: 'Limited Proof',
    condition: 'Proof',
    primaryImage: 'gb-predecimal-set-1.jpg',
    createdAt: new Date()
  },

  // Ancient Indian Gold Collection
  {
    id: 15,
    collectionId: 10,
    name: 'Vijayanagara Gold Bele',
    slug: 'vijayanagara-gold-bele',
    description: 'Tiny gold bele (1/10 fanam) from the Vijayanagara Empire (ca. 1336-1646). Known as one of the world\'s smallest gold coins. Certified by ICG.',
    year: 1500,
    mintage: 'Ancient',
    condition: 'Very Fine',
    primaryImage: 'vijayanagara-bele-1.jpg',
    createdAt: new Date()
  },

  // Additional coin for Ancient Roman collection
  {
    id: 16,
    collectionId: 1, // Ancient Roman collection
    name: 'Marcus Aurelius Sestertius',
    slug: 'marcus-aurelius-sestertius-find',
    description: 'Bronze sestertius of Marcus Aurelius found during metal detecting in England. Large and impressive example of Roman imperial coinage.',
    year: 165,
    mintage: 'Common for type',
    condition: 'Very Fine',
    primaryImage: 'marcus-aurelius-sestertius-2.jpg',
    createdAt: new Date()
  }
];

// Sample images for the new coins (5 images each)
const newImages = [
  // Edward I Silver Penny
  { id: 26, coinId: 11, filename: 'edward-i-penny-1.jpg', title: 'Obverse - Edward I Portrait', alt: 'Edward I penny obverse', description: 'Medieval portrait of Edward I with crown', isPrimary: true, sortOrder: 1 },
  { id: 27, coinId: 11, filename: 'edward-i-penny-2.jpg', title: 'Reverse - Long Cross', alt: 'Edward I penny reverse', description: 'Traditional long cross design with pellets', isPrimary: false, sortOrder: 2 },
  { id: 28, coinId: 11, filename: 'edward-i-penny-3.jpg', title: 'Edge Profile', alt: 'Edward I penny edge', description: 'Hand-struck hammered edge detail', isPrimary: false, sortOrder: 3 },
  { id: 29, coinId: 11, filename: 'edward-i-penny-4.jpg', title: 'Find Context', alt: 'Edward I penny as found', description: 'As found during metal detecting', isPrimary: false, sortOrder: 4 },
  { id: 30, coinId: 11, filename: 'edward-i-penny-5.jpg', title: 'Comparative Size', alt: 'Edward I penny size', description: 'Size comparison with modern penny', isPrimary: false, sortOrder: 5 },

  // Charles I Hammered Penny
  { id: 31, coinId: 12, filename: 'charles-i-penny-1.jpg', title: 'Obverse - Charles I Portrait', alt: 'Charles I penny obverse', description: 'Late hammered portrait of Charles I', isPrimary: true, sortOrder: 1 },
  { id: 32, coinId: 12, filename: 'charles-i-penny-2.jpg', title: 'Reverse - Shield Design', alt: 'Charles I penny reverse', description: 'Royal shield with 2 dots mintmark', isPrimary: false, sortOrder: 2 },
  { id: 33, coinId: 12, filename: 'charles-i-penny-3.jpg', title: 'Mintmark Detail', alt: 'Charles I penny mintmark', description: 'Close-up of 2 dots mintmark', isPrimary: false, sortOrder: 3 },
  { id: 34, coinId: 12, filename: 'charles-i-penny-4.jpg', title: 'Historical Context', alt: 'Charles I penny history', description: 'Coin from turbulent Civil War period', isPrimary: false, sortOrder: 4 },
  { id: 35, coinId: 12, filename: 'charles-i-penny-5.jpg', title: 'Surface Detail', alt: 'Charles I penny surface', description: 'Hand-hammered surface texture', isPrimary: false, sortOrder: 5 },

  // 1969 Lincoln Cent Double Clipped
  { id: 36, coinId: 13, filename: 'lincoln-double-clipped-1.jpg', title: 'Obverse - Error Visible', alt: 'Lincoln cent error obverse', description: 'Double clipped planchet clearly visible', isPrimary: true, sortOrder: 1 },
  { id: 37, coinId: 13, filename: 'lincoln-double-clipped-2.jpg', title: 'Reverse - Memorial', alt: 'Lincoln cent error reverse', description: 'Lincoln Memorial with clipping visible', isPrimary: false, sortOrder: 2 },
  { id: 38, coinId: 13, filename: 'lincoln-double-clipped-3.jpg', title: 'Edge - Clipping Detail', alt: 'Lincoln cent clipping edge', description: 'Close-up of double clipped areas', isPrimary: false, sortOrder: 3 },
  { id: 39, coinId: 13, filename: 'lincoln-double-clipped-4.jpg', title: 'PCGS Holder', alt: 'Lincoln cent PCGS slab', description: 'PCGS MS64 RB certification holder', isPrimary: false, sortOrder: 4 },
  { id: 40, coinId: 13, filename: 'lincoln-double-clipped-5.jpg', title: 'Error Diagram', alt: 'Lincoln cent error explanation', description: 'Diagram showing clipping process', isPrimary: false, sortOrder: 5 },

  // 1970 GB Predecimal Proof Set
  { id: 41, coinId: 14, filename: 'gb-predecimal-set-1.jpg', title: 'Complete Set Display', alt: 'GB predecimal proof set complete', description: 'All 8 coins plus commemorative plaque', isPrimary: true, sortOrder: 1 },
  { id: 42, coinId: 14, filename: 'gb-predecimal-set-2.jpg', title: 'Crown and Half Crown', alt: 'GB crown and half crown', description: 'Large silver denominations', isPrimary: false, sortOrder: 2 },
  { id: 43, coinId: 14, filename: 'gb-predecimal-set-3.jpg', title: 'Commemorative Plaque', alt: 'GB predecimal plaque', description: '"Last of the predecimal coinage" plaque', isPrimary: false, sortOrder: 3 },
  { id: 44, coinId: 14, filename: 'gb-predecimal-set-4.jpg', title: 'Original Packaging', alt: 'GB proof set case', description: 'Original Royal Mint presentation case', isPrimary: false, sortOrder: 4 },
  { id: 45, coinId: 14, filename: 'gb-predecimal-set-5.jpg', title: 'Sixpence Detail', alt: 'GB sixpence detail', description: 'Final predecimal sixpence design', isPrimary: false, sortOrder: 5 },

  // Vijayanagara Gold Bele
  { id: 46, coinId: 15, filename: 'vijayanagara-bele-1.jpg', title: 'Actual Size', alt: 'Vijayanagara bele actual size', description: 'Tiny gold coin at actual size', isPrimary: true, sortOrder: 1 },
  { id: 47, coinId: 15, filename: 'vijayanagara-bele-2.jpg', title: 'Magnified View', alt: 'Vijayanagara bele magnified', description: 'High magnification showing details', isPrimary: false, sortOrder: 2 },
  { id: 48, coinId: 15, filename: 'vijayanagara-bele-3.jpg', title: 'ICG Holder', alt: 'Vijayanagara bele ICG slab', description: 'ICG certification holder', isPrimary: false, sortOrder: 3 },
  { id: 49, coinId: 15, filename: 'vijayanagara-bele-4.jpg', title: 'Size Comparison', alt: 'Vijayanagara bele size comparison', description: 'Compared to US dime for scale', isPrimary: false, sortOrder: 4 },
  { id: 50, coinId: 15, filename: 'vijayanagara-bele-5.jpg', title: 'Historical Context', alt: 'Vijayanagara empire map', description: 'Map showing Vijayanagara Empire territory', isPrimary: false, sortOrder: 5 },

  // Marcus Aurelius Sestertius
  { id: 51, coinId: 16, filename: 'marcus-aurelius-sestertius-2.jpg', title: 'Obverse - Imperial Portrait', alt: 'Marcus Aurelius sestertius obverse', description: 'Laureate bust of Marcus Aurelius', isPrimary: true, sortOrder: 1 },
  { id: 52, coinId: 16, filename: 'marcus-aurelius-sestertius-3.jpg', title: 'Reverse - Standing Figure', alt: 'Marcus Aurelius sestertius reverse', description: 'Standing figure with military symbols', isPrimary: false, sortOrder: 2 },
  { id: 53, coinId: 16, filename: 'marcus-aurelius-sestertius-4.jpg', title: 'Edge and Thickness', alt: 'Marcus Aurelius sestertius edge', description: 'Large bronze sestertius profile', isPrimary: false, sortOrder: 3 },
  { id: 54, coinId: 16, filename: 'marcus-aurelius-sestertius-5.jpg', title: 'Find Location', alt: 'Marcus Aurelius find spot', description: 'Metal detecting find in English field', isPrimary: false, sortOrder: 4 },
  { id: 55, coinId: 16, filename: 'marcus-aurelius-sestertius-6.jpg', title: 'Inscription Detail', alt: 'Marcus Aurelius inscription', description: 'Latin inscription around portrait', isPrimary: false, sortOrder: 5 }
];

console.log('Adding new collections and coins...');
console.log('Collections to add:', newCollections.length);
console.log('Coins to add:', newCoins.length);
console.log('Images to add:', newImages.length);