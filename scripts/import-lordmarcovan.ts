/**
 * Import Lordmarcovan coin collection to database
 * Run with: npx astro db execute scripts/import-lordmarcovan.ts --remote
 */

import { db, Collections, Coins, Images } from 'astro:db';

export default async function() {
  console.log('Starting Lordmarcovan collection import...');

  // ============================================
  // STEP 1: Add new collections
  // ============================================
  console.log('\n1. Adding new collections...');

  await db.insert(Collections).values([
    {
      id: 11,
      name: 'World Coins (1601-Present)',
      slug: 'world-coins',
      description: 'World coins from the early modern period through today, spanning over 400 years of global numismatic history.',
      thumbnail: 'world-coins-collection.jpg',
      createdAt: new Date()
    },
    {
      id: 12,
      name: 'United States Coins',
      slug: 'united-states',
      description: 'American coins from colonial era through the 20th century, including gold, silver, and copper issues.',
      thumbnail: 'us-coins-collection.jpg',
      createdAt: new Date()
    }
  ]);
  console.log('  Added 2 new collections');

  // ============================================
  // STEP 2: Add Roman Twelve Caesars coins
  // ============================================
  console.log('\n2. Adding Roman Twelve Caesars...');

  const romanCoins = [
    { id: 17, collectionId: 1, name: 'Julius Caesar Denarius', slug: 'julius-caesar-denarius-44bc', description: 'Silver denarius of Julius Caesar, struck during his lifetime in 44 BC. One of the most iconic coins of the Roman Republic.', year: -44, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'julius-caesar-denarius-44bc-1.png' },
    { id: 18, collectionId: 1, name: 'Augustus Cistophorus', slug: 'augustus-cistophorus-25bc', description: 'Silver cistophoric tetradrachm of Octavian as Augustus, struck in Ephesus ca. 25-20 BC.', year: -25, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'augustus-cistophorus-25bc-1.png' },
    { id: 19, collectionId: 1, name: 'Tiberius Tribute Penny', slug: 'tiberius-tribute-penny', description: 'Silver denarius of Tiberius, ca. 14-37 AD. The famous "Tribute Penny" referenced in the Bible.', year: 20, mintage: 'Common', condition: 'Very Fine', primaryImage: 'tiberius-tribute-penny-1.png' },
    { id: 20, collectionId: 1, name: 'Caligula Bronze As', slug: 'caligula-bronze-as', description: 'Bronze as of Gaius (Caligula), ca. 37-38 AD. Scarce coin from the infamous emperor.', year: 38, mintage: 'Scarce', condition: 'Fine', primaryImage: 'caligula-bronze-as-1.png' },
    { id: 21, collectionId: 1, name: 'Claudius Sestertius', slug: 'claudius-sestertius', description: 'Large bronze sestertius of Claudius, ca. 41-54 AD.', year: 45, mintage: 'Common', condition: 'Very Fine', primaryImage: 'claudius-sestertius-1.png' },
    { id: 22, collectionId: 1, name: 'Galba Denarius', slug: 'galba-denarius', description: 'Silver denarius of Galba, ca. 68-69 AD. Year of the Four Emperors.', year: 68, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'galba-denarius-1.png' },
    { id: 23, collectionId: 1, name: 'Otho Denarius', slug: 'otho-denarius', description: 'Silver denarius of Otho, 69 AD. Rare coin from his brief 3-month reign.', year: 69, mintage: 'Very Rare', condition: 'Very Fine', primaryImage: 'otho-denarius-1.png' },
    { id: 24, collectionId: 1, name: 'Vitellius Denarius', slug: 'vitellius-denarius', description: 'Silver denarius of Vitellius, 69 AD. Civil War emperor.', year: 69, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'vitellius-denarius-1.png' },
    { id: 25, collectionId: 1, name: 'Vespasian Commemorative Denarius', slug: 'vespasian-denarius-titus', description: 'Silver denarius of Vespasian, struck by Titus ca. 80-81 AD.', year: 80, mintage: 'Scarce', condition: 'Extremely Fine', primaryImage: 'vespasian-denarius-titus-1.png' },
    { id: 26, collectionId: 1, name: 'Titus Colosseum Aureus', slug: 'titus-gold-aureus', description: 'Gold aureus of Titus, ca. 80 AD. Struck to commemorate the Colosseum opening.', year: 80, mintage: 'Very Rare', condition: 'About Uncirculated', primaryImage: 'titus-gold-aureus-1.png' },
    { id: 27, collectionId: 1, name: 'Domitian Denarius', slug: 'domitian-denarius', description: 'Silver denarius of Domitian as Caesar under Titus, ca. 80-81 AD.', year: 80, mintage: 'Common', condition: 'Extremely Fine', primaryImage: 'domitian-denarius-1.png' },
    { id: 28, collectionId: 1, name: 'Hadrian Sestertius', slug: 'hadrian-sestertius', description: 'Bronze sestertius of Hadrian, ca. 117-138 AD. Ex-Boston Museum of Fine Arts.', year: 130, mintage: 'Common', condition: 'Very Fine', primaryImage: 'hadrian-sestertius-1.png' },
    { id: 29, collectionId: 1, name: 'Antoninus Pius Sestertius', slug: 'antoninus-pius-sestertius', description: 'Bronze sestertius of Antoninus Pius, ca. 159 AD. Five Good Emperors.', year: 159, mintage: 'Common', condition: 'Very Fine', primaryImage: 'antoninus-pius-sestertius-1.png' },
    { id: 30, collectionId: 1, name: 'Julian II Siliqua', slug: 'julian-ii-siliqua', description: 'Silver siliqua of Julian II, ca. 360-363 AD. East Harptree Hoard find.', year: 361, mintage: 'Rare', condition: 'Extremely Fine', primaryImage: 'julian-ii-siliqua-1.png' },
  ];

  await db.insert(Coins).values(romanCoins.map(c => ({ ...c, createdAt: new Date() })));
  console.log(`  Added ${romanCoins.length} Roman coins`);

  // ============================================
  // STEP 3: Add World Coins
  // ============================================
  console.log('\n3. Adding World Coins...');

  const worldCoins = [
    { id: 31, collectionId: 11, name: 'Teutonic Order Quarter Thaler', slug: 'teutonic-quarter-thaler-1615', description: 'Silver 1/4-thaler of the Teutonic Order, Grand Master Maximilian of Austria, ca. 1615.', year: 1615, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'teutonic-quarter-thaler-1615-1.jpg' },
    { id: 32, collectionId: 11, name: 'James I Gold Laurel', slug: 'james-i-laurel-1623', description: 'Gold laurel of James I of England, third coinage, ca. 1623-1624.', year: 1623, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'james-i-laurel-1623-1.png' },
    { id: 33, collectionId: 11, name: 'Charles II Silver Crown', slug: 'charles-ii-crown-1679', description: 'Silver crown of Charles II, 1679, with TRICESIMO PRIMO edge.', year: 1679, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'charles-ii-crown-1679-1.png' },
    { id: 34, collectionId: 11, name: 'Austria Leopold I 3-Kreuzer', slug: 'austria-leopold-3-kreuzer-1700', description: 'Silver 3-kreuzer of Leopold I "The Hogmouth," 1700.', year: 1700, mintage: 'Common', condition: 'Very Fine', primaryImage: 'austria-leopold-3-kreuzer-1700-1.jpg' },
    { id: 35, collectionId: 11, name: 'Brunswick Wildman 24-Mariengroschen', slug: 'brunswick-wildman-1702', description: 'Silver 24-mariengroschen with "Wildman" design, 1702.', year: 1702, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'brunswick-wildman-1702-1.png' },
    { id: 36, collectionId: 11, name: 'South Sea Company Sixpence', slug: 'south-sea-sixpence-1723', description: 'Silver sixpence of George I, 1723, with double-struck error.', year: 1723, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'south-sea-sixpence-1723-1.jpg' },
    { id: 37, collectionId: 11, name: 'Augsburg Confession Medal', slug: 'augsburg-confession-medal-1730', description: 'Silver medal by Daniel Dockler, Nürnberg 1730.', year: 1730, mintage: 'Rare', condition: 'Extremely Fine', primaryImage: 'augsburg-confession-medal-1730-1.jpg' },
    { id: 38, collectionId: 11, name: 'Mexico 8 Reales Pillar Dollar', slug: 'mexico-8-reales-1736', description: 'Silver 8 reales "Pillar Dollar," Mexico City mint, 1736.', year: 1736, mintage: 'Common', condition: 'Very Fine', primaryImage: 'mexico-8-reales-1736-1.png' },
    { id: 39, collectionId: 11, name: 'Zurich City View Half Thaler', slug: 'zurich-half-thaler-1739', description: 'Silver "city view" half thaler of Zürich, 1739.', year: 1739, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'zurich-half-thaler-1739-1.jpg' },
    { id: 40, collectionId: 11, name: 'Colombia Gold Cob Escudo', slug: 'colombia-gold-escudo-1753', description: 'Gold "cob" escudo of Ferdinand VI, ca. 1753-56.', year: 1754, mintage: 'Rare', condition: 'Fine', primaryImage: 'colombia-gold-escudo-1753-1.png' },
    { id: 41, collectionId: 11, name: 'George III Rose Guinea', slug: 'george-iii-guinea-1781', description: 'Gold "Rose" guinea of George III, 1781.', year: 1781, mintage: 'Scarce', condition: 'Extremely Fine', primaryImage: 'george-iii-guinea-1781-1.png' },
    { id: 42, collectionId: 11, name: 'Russia Siberia 10 Kopecks', slug: 'siberia-10-kopecks-1781', description: 'Copper 10-kopecks of Catherine the Great, Suzun mint, 1781.', year: 1781, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'siberia-10-kopecks-1781-1.jpg' },
    { id: 43, collectionId: 11, name: 'Bermuda Proof Penny', slug: 'bermuda-proof-penny-1793', description: 'Proof copper penny of George III, Bermuda, 1793.', year: 1793, mintage: 'Very Rare', condition: 'Proof', primaryImage: 'bermuda-proof-penny-1793-1.png' },
    { id: 44, collectionId: 11, name: 'Chichester Conder Halfpenny', slug: 'chichester-conder-1794', description: 'Copper Conder token "Chichester Halfpenny," 1794.', year: 1794, mintage: 'Common', condition: 'Very Fine', primaryImage: 'chichester-conder-1794-1.jpg' },
    { id: 45, collectionId: 11, name: 'Cartwheel Twopence', slug: 'cartwheel-twopence-1797', description: 'Copper "Cartwheel" twopence of George III, 1797.', year: 1797, mintage: 'Common', condition: 'Very Fine', primaryImage: 'cartwheel-twopence-1797-1.png' },
    { id: 46, collectionId: 11, name: 'Ireland Proof Halfpenny', slug: 'ireland-proof-halfpenny-1805', description: 'Bronzed copper proof halfpenny of George III, 1805.', year: 1805, mintage: 'Very Rare', condition: 'Proof', primaryImage: 'ireland-proof-halfpenny-1805-1.jpg' },
    { id: 47, collectionId: 11, name: 'Colombia Gold 8 Escudos', slug: 'colombia-8-escudos-1808', description: 'Gold 8-escudos of Charles IV, 1808. Spanish colonial doubloon.', year: 1808, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'colombia-8-escudos-1808-1.jpg' },
    { id: 48, collectionId: 11, name: 'Persia Gold Toman', slug: 'persia-gold-toman-1817', description: 'Gold toman of Fath-Ali Shah, 1817. Qajar dynasty.', year: 1817, mintage: 'Rare', condition: 'Extremely Fine', primaryImage: 'persia-gold-toman-1817-1.jpg' },
    { id: 49, collectionId: 11, name: 'Japan Edo Gold 2-Shu', slug: 'japan-gold-2-shu-1832', description: 'Gold 2-shu of the Edo period, ca. 1832-1858.', year: 1845, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'japan-gold-2-shu-1832-1.png' },
    { id: 50, collectionId: 11, name: 'France Bovy Napoleon Medal', slug: 'france-bovy-medal-1840', description: 'Gilt bronze specimen medal by Antoine Bovy, 1840.', year: 1840, mintage: 'Rare', condition: 'Specimen', primaryImage: 'france-bovy-medal-1840-1.jpg' },
    { id: 51, collectionId: 11, name: 'Gothic Florin', slug: 'gothic-florin-1865', description: 'Silver florin of Queen Victoria, "Gothic" type, 1865.', year: 1865, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'gothic-florin-1865-1.jpg' },
    { id: 52, collectionId: 11, name: 'France La Prevoyance Jeton', slug: 'france-jeton-1869', description: 'Silver jeton of Compagnie La Prévoyance, 1869.', year: 1869, mintage: 'Scarce', condition: 'Extremely Fine', primaryImage: 'france-jeton-1869-1.jpg' },
    { id: 53, collectionId: 11, name: 'Australia RMS Duoro Sovereign', slug: 'australia-sovereign-1877', description: 'Gold sovereign of Queen Victoria, 1877-S. RMS Duoro shipwreck.', year: 1877, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'australia-sovereign-1877-1.png' },
    { id: 54, collectionId: 11, name: 'Peru Provisional 10 Centavos', slug: 'peru-10-centavos-1879', description: 'Copper-nickel 10-centavos provisional, 1879.', year: 1879, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'peru-10-centavos-1879-1.png' },
    { id: 55, collectionId: 11, name: 'Chile Peso', slug: 'chile-peso-1880', description: 'Silver peso, Santiago mint, 1880.', year: 1880, mintage: 'Common', condition: 'Very Fine', primaryImage: 'chile-peso-1880-1.png' },
    { id: 56, collectionId: 11, name: 'New Zealand Merchant Token', slug: 'nz-merchant-token-1881', description: 'Bronze token, Milner & Thompson, Christchurch, 1881.', year: 1881, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'nz-merchant-token-1881-1.png' },
    { id: 57, collectionId: 11, name: 'Newfoundland 2 Dollars', slug: 'newfoundland-2-dollars-1885', description: 'Gold 2 dollars of Queen Victoria, 1885.', year: 1885, mintage: 'Rare', condition: 'Very Fine', primaryImage: 'newfoundland-2-dollars-1885-1.jpg' },
    { id: 58, collectionId: 11, name: 'Japan Dragon Yen', slug: 'japan-dragon-yen-1890', description: 'Silver "dragon" yen of Emperor Meiji, 1890.', year: 1890, mintage: 'Common', condition: 'Very Fine', primaryImage: 'japan-dragon-yen-1890-1.png' },
    { id: 59, collectionId: 11, name: 'Victoria Half Sovereign', slug: 'victoria-half-sovereign-1901', description: 'Gold half-sovereign of Queen Victoria, 1901. Terner collection.', year: 1901, mintage: 'Common', condition: 'About Uncirculated', primaryImage: 'victoria-half-sovereign-1901-1.jpg' },
    { id: 60, collectionId: 11, name: 'Stuttgart New Year Klippe', slug: 'stuttgart-klippe-1904', description: 'Silver klippe, Stuttgart Numismatic Association, ca. 1904.', year: 1904, mintage: 'Rare', condition: 'Proof-like', primaryImage: 'stuttgart-klippe-1904-1.jpg' },
    { id: 61, collectionId: 11, name: 'Philippines Peso', slug: 'philippines-peso-1904', description: 'Silver peso, US Administration, 1904-S.', year: 1904, mintage: 'Common', condition: 'Very Fine', primaryImage: 'philippines-peso-1904-1.png' },
    { id: 62, collectionId: 11, name: 'Westphalia Notgeld', slug: 'westphalia-notgeld-1923', description: 'Gilt bronze 10,000-mark notgeld, 1923. Hyperinflation era.', year: 1923, mintage: 'Common', condition: 'Uncirculated', primaryImage: 'westphalia-notgeld-1923-1.jpg' },
    { id: 63, collectionId: 11, name: 'Soviet Rouble', slug: 'soviet-rouble-1924', description: 'Silver rouble, Leningrad mint, 1924.', year: 1924, mintage: 'Common', condition: 'Very Fine', primaryImage: 'soviet-rouble-1924-1.jpg' },
    { id: 64, collectionId: 11, name: 'Greenland 25 Ore', slug: 'greenland-25-ore-1926', description: 'Copper-nickel 25-øre, Copenhagen mint, 1926.', year: 1926, mintage: 'Scarce', condition: 'Very Fine', primaryImage: 'greenland-25-ore-1926-1.jpg' },
    { id: 65, collectionId: 11, name: 'Australia Parliament Florin', slug: 'australia-parliament-florin-1927', description: 'Silver florin of George V, 1927. Canberra Parliament House.', year: 1927, mintage: 'Scarce', condition: 'Extremely Fine', primaryImage: 'australia-parliament-florin-1927-1.jpg' },
    { id: 66, collectionId: 11, name: 'Bremerhaven 3 Reichsmark', slug: 'bremerhaven-3-reichsmark-1927', description: 'Silver 3-reichsmark, Bremerhaven commemorative, 1927.', year: 1927, mintage: 'Scarce', condition: 'About Uncirculated', primaryImage: 'bremerhaven-3-reichsmark-1927-1.png' },
    { id: 67, collectionId: 11, name: 'Weimar Oak Tree 5 Marks', slug: 'weimar-5-marks-oak-1927', description: 'Silver 5 marks, Oak Tree type, 1927.', year: 1927, mintage: 'Common', condition: 'Extremely Fine', primaryImage: 'weimar-5-marks-oak-1927-1.png' },
    { id: 68, collectionId: 11, name: 'Palestine 5 Mils', slug: 'palestine-5-mils-1944', description: 'Bronze 5-mils, British Palestine, 1944. WW2 provenance.', year: 1944, mintage: 'Common', condition: 'Very Fine', primaryImage: 'palestine-5-mils-1944-1.jpg' },
    { id: 69, collectionId: 11, name: 'Panama Balboa', slug: 'panama-balboa-1947', description: 'Silver Balboa, 1947.', year: 1947, mintage: 'Common', condition: 'Very Fine', primaryImage: 'panama-balboa-1947-1.png' },
    { id: 70, collectionId: 11, name: 'New Zealand Coronation Crown', slug: 'nz-proof-crown-1953', description: 'Proof copper-nickel crown, 1953. Elizabeth II Coronation.', year: 1953, mintage: 'Scarce', condition: 'Proof', primaryImage: 'nz-proof-crown-1953-1.png' },
    { id: 71, collectionId: 11, name: 'Esperanto 10 Steloj', slug: 'esperanto-10-steloj-1959', description: 'Copper-nickel 10-steloj fantasy, 1959. Struck at Utrecht.', year: 1959, mintage: 'Rare', condition: 'Uncirculated', primaryImage: 'esperanto-10-steloj-1959-1.jpg' },
    { id: 72, collectionId: 11, name: 'Peru Gold 100 Soles', slug: 'peru-100-soles-1965', description: 'Gold 100-soles, Seated Liberty type, 1965. 9/inverted 5 variety.', year: 1965, mintage: 'Rare', condition: 'About Uncirculated', primaryImage: 'peru-100-soles-1965-1.png' },
    { id: 73, collectionId: 11, name: 'Tanzania FAO 5 Shilingi', slug: 'tanzania-5-shilingi-1972', description: 'Copper-nickel 5-shilingi, FAO issue, 1972.', year: 1972, mintage: 'Common', condition: 'Uncirculated', primaryImage: 'tanzania-5-shilingi-1972-1.jpg' },
    { id: 74, collectionId: 11, name: 'Bahamas Proof 10 Cents', slug: 'bahamas-proof-10-cents-1974', description: 'Copper-nickel proof 10-cents, Bonefish, 1974.', year: 1974, mintage: 'Common', condition: 'Proof', primaryImage: 'bahamas-proof-10-cents-1974-1.jpg' },
    { id: 75, collectionId: 11, name: 'Canada Silver Jubilee 100 Dollars', slug: 'canada-proof-100-dollars-1977', description: 'Gold proof 100 dollars of Elizabeth II, 1977.', year: 1977, mintage: 'Scarce', condition: 'Proof', primaryImage: 'canada-proof-100-dollars-1977-1.png' },
    { id: 76, collectionId: 11, name: 'Nepal Buddha Gold Asarfi', slug: 'nepal-gold-asarfi-1995', description: 'Gold proof Asarfi of Gyanendra Shah, 1995. Lord Buddha.', year: 1995, mintage: 'Rare', condition: 'Proof', primaryImage: 'nepal-gold-asarfi-1995-1.png' },
    { id: 77, collectionId: 11, name: 'Bermuda Sea Venture 60 Dollars', slug: 'bermuda-triangle-60-dollars-1997', description: 'Gold 60-dollars, "Bermuda Triangle," 1997. Sea Venture wreck.', year: 1997, mintage: 'Rare', condition: 'Proof', primaryImage: 'bermuda-triangle-60-dollars-1997-1.jpg' },
    { id: 78, collectionId: 11, name: 'Austria Klosterneuburg 10 Euro', slug: 'austria-klosterneuburg-10-euro-2008', description: 'Silver proof 10-euro, Klosterneuburg Abbey, 2008.', year: 2008, mintage: 'Common', condition: 'Proof', primaryImage: 'austria-klosterneuburg-10-euro-2008-1.png' },
    { id: 79, collectionId: 11, name: 'Great Britain Proof Britannia', slug: 'gb-proof-britannia-2013', description: 'Proof silver Britannia, 1 oz .999 fine, 2013.', year: 2013, mintage: 'Common', condition: 'Proof', primaryImage: 'gb-proof-britannia-2013-1.jpg' },
    { id: 80, collectionId: 11, name: 'Luxembourg Wildcat 5 Euros', slug: 'luxembourg-wildcat-5-euros-2015', description: 'Proof bimetallic 5 euros, European Wildcat, 2015.', year: 2015, mintage: 'Scarce', condition: 'Proof', primaryImage: 'luxembourg-wildcat-5-euros-2015-1.jpg' },
    { id: 81, collectionId: 11, name: 'China Auspicious Culture 10 Yuan', slug: 'china-auspicious-10-yuan-2016', description: 'Gilt-enamel proof silver 10-yuan, 2016.', year: 2016, mintage: 'Scarce', condition: 'Proof', primaryImage: 'china-auspicious-10-yuan-2016-1.png' },
    { id: 82, collectionId: 11, name: 'Ghana African Leopard 5 Cedis', slug: 'ghana-leopard-5-cedis-2017', description: 'Silver 5-cedis, African Leopard, 1 oz, 2017.', year: 2017, mintage: 'Common', condition: 'Brilliant Unc', primaryImage: 'ghana-leopard-5-cedis-2017-1.jpg' },
    { id: 83, collectionId: 11, name: 'Kazakhstan Eagle Owl 200 Tenge', slug: 'kazakhstan-eagle-owl-2019', description: 'Copper-nickel gilt 200-tenge, Eagle Owl, 2019.', year: 2019, mintage: 'Common', condition: 'Brilliant Unc', primaryImage: 'kazakhstan-eagle-owl-2019-1.jpg' },
    { id: 84, collectionId: 11, name: 'Great Britain Mayflower 100 Pounds', slug: 'gb-mayflower-100-pounds-2020', description: 'Gold 100-pounds, Mayflower 400th Anniversary, 2020.', year: 2020, mintage: 'Scarce', condition: 'Proof', primaryImage: 'gb-mayflower-100-pounds-2020-1.jpg' },
  ];

  await db.insert(Coins).values(worldCoins.map(c => ({ ...c, createdAt: new Date() })));
  console.log(`  Added ${worldCoins.length} World Coins`);

  // ============================================
  // STEP 4: Add Images
  // ============================================
  console.log('\n4. Adding images...');

  // Roman coin images
  const romanImages = romanCoins.map((coin, i) => ({
    id: 56 + i,
    coinId: coin.id,
    filename: coin.primaryImage,
    title: coin.name,
    alt: coin.name,
    description: coin.description.substring(0, 100),
    isPrimary: true,
    sortOrder: 1,
    createdAt: new Date()
  }));

  // World coin images
  const worldImages = worldCoins.map((coin, i) => ({
    id: 70 + i,
    coinId: coin.id,
    filename: coin.primaryImage,
    title: coin.name,
    alt: coin.name,
    description: coin.description.substring(0, 100),
    isPrimary: true,
    sortOrder: 1,
    createdAt: new Date()
  }));

  await db.insert(Images).values([...romanImages, ...worldImages]);
  console.log(`  Added ${romanImages.length + worldImages.length} images`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n=== Import Complete ===');
  console.log(`Collections: 2 new (total 12)`);
  console.log(`Coins: ${romanCoins.length + worldCoins.length} new (14 Roman + 54 World)`);
  console.log(`Images: ${romanImages.length + worldImages.length} new`);
  console.log('\nDatabase updated successfully!');
}
