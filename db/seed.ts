import { db, Collections, Coins, Images, AdminUsers } from 'astro:db';
import bcrypt from 'bcryptjs';

export default async function seed() {
	console.log('Seeding database...');

	// Sample Collections Data (5-6 collections as requested)
	const collectionsData = [
		{
			id: 1,
			name: 'Ancient Roman Coins',
			slug: 'ancient-roman',
			description: 'A fascinating collection of coins from the Roman Empire, spanning from the Republic through the fall of Rome.',
			thumbnail: 'roman-collection.jpg',
		},
		{
			id: 2,
			name: 'Medieval European Coins',
			slug: 'medieval-european',
			description: 'Medieval coins from various European kingdoms, featuring intricate designs and historical significance.',
			thumbnail: 'medieval-collection.jpg',
		},
		{
			id: 3,
			name: 'American Gold Rush',
			slug: 'american-gold-rush',
			description: 'Rare coins from the American Gold Rush era, including territorial and private mint issues.',
			thumbnail: 'gold-rush-collection.jpg',
		},
		{
			id: 4,
			name: 'World War Era Coins',
			slug: 'world-war-era',
			description: 'Coins minted during the tumultuous periods of both World Wars, reflecting the history of nations.',
			thumbnail: 'war-era-collection.jpg',
		},
		{
			id: 5,
			name: 'Ancient Greek Coins',
			slug: 'ancient-greek',
			description: 'Beautiful silver and gold coins from ancient Greek city-states, featuring gods, goddesses, and symbols.',
			thumbnail: 'greek-collection.jpg',
		},
		{
			id: 6,
			name: 'Modern Commemoratives',
			slug: 'modern-commemorative',
			description: 'Special edition and commemorative coins from the 20th and 21st centuries.',
			thumbnail: 'modern-collection.jpg',
		},
	];

	// Sample Coins Data (showing 10 coins per collection for example)
	const coinsData = [
		// Ancient Roman Coins
		{ id: 1, collectionId: 1, name: 'Augustus Denarius', slug: 'augustus-denarius', description: 'Silver denarius featuring Emperor Augustus', year: 27, mintage: 'Unknown', condition: 'Very Fine', primaryImage: 'augustus-denarius-1.jpg' },
		{ id: 2, collectionId: 1, name: 'Trajan Aureus', slug: 'trajan-aureus', description: 'Gold aureus of Emperor Trajan', year: 98, mintage: 'Rare', condition: 'Extremely Fine', primaryImage: 'trajan-aureus-1.jpg' },
		{ id: 3, collectionId: 1, name: 'Caesar Denarius', slug: 'caesar-denarius', description: 'Julius Caesar commemorative denarius', year: 44, mintage: 'Limited', condition: 'Fine', primaryImage: 'caesar-denarius-1.jpg' },
		{ id: 4, collectionId: 1, name: 'Marcus Aurelius Sestertius', slug: 'aurelius-sestertius', description: 'Bronze sestertius of philosopher emperor', year: 161, mintage: 'Common', condition: 'Very Fine', primaryImage: 'aurelius-sestertius-1.jpg' },
		{ id: 5, collectionId: 1, name: 'Nero Aureus', slug: 'nero-aureus', description: 'Gold coin of the infamous Emperor Nero', year: 64, mintage: 'Very Rare', condition: 'About Uncirculated', primaryImage: 'nero-aureus-1.jpg' },

		// Medieval European Coins
		{ id: 6, collectionId: 2, name: 'Edward III Noble', slug: 'edward-noble', description: 'English gold noble featuring ship design', year: 1344, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'edward-noble-1.jpg' },
		{ id: 7, collectionId: 2, name: 'Louis IX Denier', slug: 'louis-denier', description: 'French silver denier of Saint Louis', year: 1266, mintage: 'Uncommon', condition: 'Fine', primaryImage: 'louis-denier-1.jpg' },
		{ id: 8, collectionId: 2, name: 'Frederick II Augustalis', slug: 'frederick-augustalis', description: 'Holy Roman Empire gold augustalis', year: 1231, mintage: 'Very Rare', condition: 'Extremely Fine', primaryImage: 'frederick-augustalis-1.jpg' },

		// Ancient Greek Coins
		{ id: 9, collectionId: 5, name: 'Athenian Tetradrachm', slug: 'athenian-tetradrachm', description: 'Silver tetradrachm with Athena and owl', year: 440, mintage: 'Common', condition: 'Very Fine', primaryImage: 'athenian-tetradrachm-1.jpg' },
		{ id: 10, collectionId: 5, name: 'Alexander Stater', slug: 'alexander-stater', description: 'Gold stater of Alexander the Great', year: 336, mintage: 'Rare', condition: 'About Uncirculated', primaryImage: 'alexander-stater-1.jpg' },
	];

	// Sample Images Data (5 images per coin as requested)
	const imagesData = [
		// Augustus Denarius images
		{ id: 1, coinId: 1, filename: 'augustus-denarius-1.jpg', title: 'Obverse - Augustus Portrait', alt: 'Augustus denarius obverse', description: 'Laureate head of Augustus facing right', isPrimary: true, sortOrder: 1 },
		{ id: 2, coinId: 1, filename: 'augustus-denarius-2.jpg', title: 'Reverse - Victory Figure', alt: 'Augustus denarius reverse', description: 'Victory standing holding wreath and palm', isPrimary: false, sortOrder: 2 },
		{ id: 3, coinId: 1, filename: 'augustus-denarius-3.jpg', title: 'Edge View', alt: 'Augustus denarius edge', description: 'Side profile showing coin thickness', isPrimary: false, sortOrder: 3 },
		{ id: 4, coinId: 1, filename: 'augustus-denarius-4.jpg', title: 'Detail - Inscription', alt: 'Augustus denarius inscription detail', description: 'Close-up of Latin inscription around portrait', isPrimary: false, sortOrder: 4 },
		{ id: 5, coinId: 1, filename: 'augustus-denarius-5.jpg', title: 'Under Magnification', alt: 'Augustus denarius magnified', description: 'High magnification showing minting details', isPrimary: false, sortOrder: 5 },

		// Trajan Aureus images
		{ id: 6, coinId: 2, filename: 'trajan-aureus-1.jpg', title: 'Obverse - Trajan Portrait', alt: 'Trajan aureus obverse', description: 'Laureate and draped bust of Trajan', isPrimary: true, sortOrder: 1 },
		{ id: 7, coinId: 2, filename: 'trajan-aureus-2.jpg', title: 'Reverse - Virtus Standing', alt: 'Trajan aureus reverse', description: 'Virtus standing with spear and parazonium', isPrimary: false, sortOrder: 2 },
		{ id: 8, coinId: 2, filename: 'trajan-aureus-3.jpg', title: 'Edge Profile', alt: 'Trajan aureus edge', description: 'Edge showing gold purity and wear', isPrimary: false, sortOrder: 3 },
		{ id: 9, coinId: 2, filename: 'trajan-aureus-4.jpg', title: 'Inscription Detail', alt: 'Trajan aureus inscription', description: 'TRAIANVS AVGVSTVS inscription detail', isPrimary: false, sortOrder: 4 },
		{ id: 10, coinId: 2, filename: 'trajan-aureus-5.jpg', title: 'Comparative Size', alt: 'Trajan aureus size comparison', description: 'Size comparison with modern coin', isPrimary: false, sortOrder: 5 },

		// Caesar Denarius images
		{ id: 11, coinId: 3, filename: 'caesar-denarius-1.jpg', title: 'Obverse - Caesar Portrait', alt: 'Caesar denarius obverse', description: 'Laureate head of Julius Caesar', isPrimary: true, sortOrder: 1 },
		{ id: 12, coinId: 3, filename: 'caesar-denarius-2.jpg', title: 'Reverse - Venus Standing', alt: 'Caesar denarius reverse', description: 'Venus holding Victory and scepter', isPrimary: false, sortOrder: 2 },
		{ id: 13, coinId: 3, filename: 'caesar-denarius-3.jpg', title: 'Side View', alt: 'Caesar denarius side', description: 'Profile showing silver toning', isPrimary: false, sortOrder: 3 },
		{ id: 14, coinId: 3, filename: 'caesar-denarius-4.jpg', title: 'Patina Detail', alt: 'Caesar denarius patina', description: 'Natural silver patination patterns', isPrimary: false, sortOrder: 4 },
		{ id: 15, coinId: 3, filename: 'caesar-denarius-5.jpg', title: 'Historical Context', alt: 'Caesar denarius context', description: 'Coin with historical timeline reference', isPrimary: false, sortOrder: 5 },

		// Athenian Tetradrachm images
		{ id: 16, coinId: 9, filename: 'athenian-tetradrachm-1.jpg', title: 'Obverse - Athena Head', alt: 'Athenian tetradrachm obverse', description: 'Head of Athena wearing crested helmet', isPrimary: true, sortOrder: 1 },
		{ id: 17, coinId: 9, filename: 'athenian-tetradrachm-2.jpg', title: 'Reverse - Owl and Olive', alt: 'Athenian tetradrachm reverse', description: 'Owl standing with olive branch', isPrimary: false, sortOrder: 2 },
		{ id: 18, coinId: 9, filename: 'athenian-tetradrachm-3.jpg', title: 'Edge Lettering', alt: 'Athenian tetradrachm edge', description: 'Ancient Greek lettering on edge', isPrimary: false, sortOrder: 3 },
		{ id: 19, coinId: 9, filename: 'athenian-tetradrachm-4.jpg', title: 'Helmet Detail', alt: 'Athenian tetradrachm helmet detail', description: 'Intricate detail of Athena\'s helmet crest', isPrimary: false, sortOrder: 4 },
		{ id: 20, coinId: 9, filename: 'athenian-tetradrachm-5.jpg', title: 'Museum Documentation', alt: 'Athenian tetradrachm documentation', description: 'Professional museum photography setup', isPrimary: false, sortOrder: 5 },

		// Alexander Stater images
		{ id: 21, coinId: 10, filename: 'alexander-stater-1.jpg', title: 'Obverse - Athena Head', alt: 'Alexander stater obverse', description: 'Head of Athena in Corinthian helmet', isPrimary: true, sortOrder: 1 },
		{ id: 22, coinId: 10, filename: 'alexander-stater-2.jpg', title: 'Reverse - Nike with Wreath', alt: 'Alexander stater reverse', description: 'Nike standing holding wreath and stylis', isPrimary: false, sortOrder: 2 },
		{ id: 23, coinId: 10, filename: 'alexander-stater-3.jpg', title: 'Gold Luster', alt: 'Alexander stater gold luster', description: 'Natural gold color and luster detail', isPrimary: false, sortOrder: 3 },
		{ id: 24, coinId: 10, filename: 'alexander-stater-4.jpg', title: 'Royal Inscription', alt: 'Alexander stater inscription', description: 'ΑΛΕΞΑΝΔΡΟΥ inscription meaning "of Alexander"', isPrimary: false, sortOrder: 4 },
		{ id: 25, coinId: 10, filename: 'alexander-stater-5.jpg', title: 'Archaeological Context', alt: 'Alexander stater archaeology', description: 'Coin with archaeological excavation context', isPrimary: false, sortOrder: 5 },
	];

	// Create default admin user
	const defaultPassword = 'admin123'; // Change this in production!
	const passwordHash = await bcrypt.hash(defaultPassword, 10);

	const adminData = {
		id: 1,
		username: 'admin',
		passwordHash: passwordHash,
		email: 'admin@coinsite.com',
		isActive: true,
		createdAt: new Date()
	};

	// Additional collections based on lordmarcovan's finds
	const additionalCollections = [
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

	// Additional coins from lordmarcovan's collection and finds
	const additionalCoins = [
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

	// Additional images for the new coins
	const additionalImages = [
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

	// Insert data into tables
	await db.insert(Collections).values([...collectionsData, ...additionalCollections]);
	await db.insert(Coins).values([...coinsData, ...additionalCoins]);
	await db.insert(Images).values([...imagesData, ...additionalImages]);
	await db.insert(AdminUsers).values(adminData);

	console.log('Database seeded successfully!');
	console.log(`- ${collectionsData.length + additionalCollections.length} collections added`);
	console.log(`- ${coinsData.length + additionalCoins.length} coins added`);
	console.log(`- ${imagesData.length + additionalImages.length} images added`);
	console.log(`- 1 admin user created (username: admin, password: ${defaultPassword})`);
}