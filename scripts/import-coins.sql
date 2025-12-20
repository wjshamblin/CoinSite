-- Lordmarcovan Collection Import Script
-- Run with: npx astro db execute scripts/import-coins.sql --remote

-- ============================================
-- STEP 1: Add new collections
-- ============================================

-- World Coins (1601-present)
INSERT INTO Collections (id, name, slug, description, thumbnail) VALUES
(11, 'World Coins (1601-Present)', 'world-coins', 'World coins from the early modern period through today, spanning over 400 years of global numismatic history.', 'world-coins-collection.jpg');

-- United States Coins
INSERT INTO Collections (id, name, slug, description, thumbnail) VALUES
(12, 'United States Coins', 'united-states', 'American coins from colonial era through the 20th century, including gold, silver, and copper issues.', 'us-coins-collection.jpg');

-- ============================================
-- STEP 2: Add Roman Twelve Caesars coins
-- ============================================

INSERT INTO Coins (id, collectionId, name, slug, description, year, mintage, condition, primaryImage) VALUES
(17, 1, 'Julius Caesar Denarius', 'julius-caesar-denarius-44bc', 'Silver denarius of Julius Caesar, struck during his lifetime in 44 BC. One of the most iconic coins of the Roman Republic, marking the end of republican rule.', -44, 'Rare', 'Very Fine', 'julius-caesar-denarius-44bc-1.png'),
(18, 1, 'Augustus Cistophorus', 'augustus-cistophorus-25bc', 'Silver cistophoric tetradrachm of Octavian as Augustus, struck in Ephesus ca. 25-20 BC. Large provincial silver coin from the early Imperial period.', -25, 'Scarce', 'Very Fine', 'augustus-cistophorus-25bc-1.png'),
(19, 1, 'Tiberius Tribute Penny', 'tiberius-tribute-penny', 'Silver denarius of Tiberius, ca. 14-37 AD. The famous "Tribute Penny" referenced in the Bible - "Render unto Caesar."', 20, 'Common', 'Very Fine', 'tiberius-tribute-penny-1.png'),
(20, 1, 'Caligula Bronze As', 'caligula-bronze-as', 'Bronze as of Gaius (Caligula), ca. 37-38 AD. Scarce coin from the brief and infamous reign of Caligula.', 38, 'Scarce', 'Fine', 'caligula-bronze-as-1.png'),
(21, 1, 'Claudius Sestertius', 'claudius-sestertius', 'Large bronze sestertius of Claudius, ca. 41-54 AD. Impressive large bronze from the reign of the unlikely emperor.', 45, 'Common', 'Very Fine', 'claudius-sestertius-1.png'),
(22, 1, 'Galba Denarius', 'galba-denarius', 'Silver denarius of Galba, ca. 68-69 AD. From the turbulent Year of the Four Emperors following Nero''s death.', 68, 'Rare', 'Very Fine', 'galba-denarius-1.png'),
(23, 1, 'Otho Denarius', 'otho-denarius', 'Silver denarius of Otho, 69 AD. Rare coin from his brief 3-month reign during the Year of Four Emperors.', 69, 'Very Rare', 'Very Fine', 'otho-denarius-1.png'),
(24, 1, 'Vitellius Denarius', 'vitellius-denarius', 'Silver denarius of Vitellius, 69 AD. From the short-lived reign of this Civil War emperor.', 69, 'Rare', 'Very Fine', 'vitellius-denarius-1.png'),
(25, 1, 'Vespasian Commemorative Denarius', 'vespasian-denarius-titus', 'Silver denarius of Vespasian, struck by Titus ca. 80-81 AD. Commemorative issue honoring the founder of the Flavian dynasty.', 80, 'Scarce', 'Extremely Fine', 'vespasian-denarius-titus-1.png'),
(26, 1, 'Titus Colosseum Aureus', 'titus-gold-aureus', 'Gold aureus of Titus, ca. 80 AD. Struck to commemorate the opening of the Colosseum - one of the most desirable Roman gold coins.', 80, 'Very Rare', 'About Uncirculated', 'titus-gold-aureus-1.png'),
(27, 1, 'Domitian Denarius', 'domitian-denarius', 'Silver denarius of Domitian as Caesar under Titus, ca. 80-81 AD. Before he became emperor in his own right.', 80, 'Common', 'Extremely Fine', 'domitian-denarius-1.png'),
(28, 1, 'Hadrian Sestertius', 'hadrian-sestertius', 'Bronze sestertius of Hadrian, ca. 117-138 AD. Ex-Boston Museum of Fine Arts collection. Large and impressive bronze.', 130, 'Common', 'Very Fine', 'hadrian-sestertius-1.png'),
(29, 1, 'Antoninus Pius Sestertius', 'antoninus-pius-sestertius', 'Bronze sestertius of Antoninus Pius, ca. 159 AD. From the peaceful reign of one of Rome''s "Five Good Emperors."', 159, 'Common', 'Very Fine', 'antoninus-pius-sestertius-1.png'),
(30, 1, 'Julian II Siliqua', 'julian-ii-siliqua', 'Silver siliqua of Julian II "the Apostate," ca. 360-363 AD. Found in the famous East Harptree Hoard of 1887.', 361, 'Rare', 'Extremely Fine', 'julian-ii-siliqua-1.png');

-- ============================================
-- STEP 3: Add World Coins (Collection 11)
-- ============================================

INSERT INTO Coins (id, collectionId, name, slug, description, year, mintage, condition, primaryImage) VALUES
(31, 11, 'Teutonic Order Quarter Thaler', 'teutonic-quarter-thaler-1615', 'Silver 1/4-thaler of the Teutonic Order, Grand Master Maximilian of Austria, ca. 1615. Military religious order coinage.', 1615, 'Rare', 'Very Fine', 'teutonic-quarter-thaler-1615-1.jpg'),
(32, 11, 'James I Gold Laurel', 'james-i-laurel-1623', 'Gold laurel of James I of England, third coinage with lis mintmark, ca. 1623-1624. Stuart dynasty gold.', 1623, 'Rare', 'Very Fine', 'james-i-laurel-1623-1.png'),
(33, 11, 'Charles II Silver Crown', 'charles-ii-crown-1679', 'Silver crown of Charles II, 1679, with TRICESIMO PRIMO edge inscription. Restoration period coinage.', 1679, 'Scarce', 'Very Fine', 'charles-ii-crown-1679-1.png'),
(34, 11, 'Austria Leopold I 3-Kreuzer', 'austria-leopold-3-kreuzer-1700', 'Silver 3-kreuzer of Leopold I "The Hogmouth," 1700. Habsburg Empire coinage.', 1700, 'Common', 'Very Fine', 'austria-leopold-3-kreuzer-1700-1.jpg'),
(35, 11, 'Brunswick Wildman 24-Mariengroschen', 'brunswick-wildman-1702', 'Silver 24-mariengroschen with "Wildman" design, Brunswick-Lüneburg, 1702. Iconic German States coinage.', 1702, 'Scarce', 'Very Fine', 'brunswick-wildman-1702-1.png'),
(36, 11, 'South Sea Company Sixpence', 'south-sea-sixpence-1723', 'Silver sixpence of George I, 1723, with double-struck mint error. South Sea Company issue.', 1723, 'Rare', 'Very Fine', 'south-sea-sixpence-1723-1.jpg'),
(37, 11, 'Augsburg Confession Medal', 'augsburg-confession-medal-1730', 'Silver medal by Daniel Dockler, Nürnberg 1730. Commemorating the Augsburg Confession.', 1730, 'Rare', 'Extremely Fine', 'augsburg-confession-medal-1730-1.jpg'),
(38, 11, 'Mexico 8 Reales Pillar Dollar', 'mexico-8-reales-1736', 'Silver 8 reales "Pillar Dollar," Mexico City mint, 1736-Mo-MF. The coin that funded global trade.', 1736, 'Common', 'Very Fine', 'mexico-8-reales-1736-1.png'),
(39, 11, 'Zurich City View Half Thaler', 'zurich-half-thaler-1739', 'Silver "city view" half thaler of Zürich, 1739. Beautiful Swiss cantonal coinage.', 1739, 'Scarce', 'Very Fine', 'zurich-half-thaler-1739-1.jpg'),
(40, 11, 'Colombia Gold Cob Escudo', 'colombia-gold-escudo-1753', 'Gold "cob" type escudo of Ferdinand VI, ca. 1753-56. Hand-struck Spanish colonial gold.', 1754, 'Rare', 'Fine', 'colombia-gold-escudo-1753-1.png'),
(41, 11, 'George III Rose Guinea', 'george-iii-guinea-1781', 'Gold "Rose" type guinea of George III, 1781. Classic British gold coinage.', 1781, 'Scarce', 'Extremely Fine', 'george-iii-guinea-1781-1.png'),
(42, 11, 'Russia Siberia 10 Kopecks', 'siberia-10-kopecks-1781', 'Copper 10-kopecks of Catherine the Great, Suzun mint, 1781-KM. Siberian regional coinage.', 1781, 'Scarce', 'Very Fine', 'siberia-10-kopecks-1781-1.jpg'),
(43, 11, 'Bermuda Proof Penny', 'bermuda-proof-penny-1793', 'Proof copper penny of George III, Bermuda, 1793. Rare colonial proof.', 1793, 'Very Rare', 'Proof', 'bermuda-proof-penny-1793-1.png'),
(44, 11, 'Chichester Conder Halfpenny', 'chichester-conder-1794', 'Copper Conder token "Chichester Halfpenny," 1794. British 18th century token coinage.', 1794, 'Common', 'Very Fine', 'chichester-conder-1794-1.jpg'),
(45, 11, 'Cartwheel Twopence', 'cartwheel-twopence-1797', 'Copper "Cartwheel" twopence of George III, 1797. Matthew Boulton''s famous large copper.', 1797, 'Common', 'Very Fine', 'cartwheel-twopence-1797-1.png'),
(46, 11, 'Ireland Proof Halfpenny', 'ireland-proof-halfpenny-1805', 'Bronzed copper proof halfpenny of George III, Soho Mint, 1805. Irish proof coinage.', 1805, 'Very Rare', 'Proof', 'ireland-proof-halfpenny-1805-1.jpg'),
(47, 11, 'Colombia Gold 8 Escudos', 'colombia-8-escudos-1808', 'Gold 8-escudos of Charles IV, 1808-NR JJ, Nuevo Reino mint. Spanish colonial gold doubloon.', 1808, 'Scarce', 'Very Fine', 'colombia-8-escudos-1808-1.jpg'),
(48, 11, 'Persia Gold Toman', 'persia-gold-toman-1817', 'Gold toman of Fath-Ali Shah, Yazd mint, AH 1233 (1817). Qajar dynasty gold.', 1817, 'Rare', 'Extremely Fine', 'persia-gold-toman-1817-1.jpg'),
(49, 11, 'Japan Edo Gold 2-Shu', 'japan-gold-2-shu-1832', 'Gold 2-shu of the Edo period, ca. 1832-1858. Pre-Meiji Japanese gold coinage.', 1845, 'Scarce', 'Very Fine', 'japan-gold-2-shu-1832-1.png'),
(50, 11, 'France Bovy Napoleon Medal', 'france-bovy-medal-1840', 'Gilt bronze specimen medal by Antoine Bovy, 1840. Napoleon Bonaparte Paris funeral commemoration.', 1840, 'Rare', 'Specimen', 'france-bovy-medal-1840-1.jpg'),
(51, 11, 'Gothic Florin', 'gothic-florin-1865', 'Silver florin of Queen Victoria, "Gothic" type Die #13, 1865. One of Britain''s most beautiful coins.', 1865, 'Scarce', 'Very Fine', 'gothic-florin-1865-1.jpg'),
(52, 11, 'France La Prevoyance Jeton', 'france-jeton-1869', 'Silver jeton of Compagnie La Prévoyance, engraved by Paulin Tasset, 1869. French insurance token.', 1869, 'Scarce', 'Extremely Fine', 'france-jeton-1869-1.jpg'),
(53, 11, 'Australia RMS Duoro Sovereign', 'australia-sovereign-1877', 'Gold "Shield" sovereign of Queen Victoria, 1877-S. Recovered from the RMS Duoro shipwreck.', 1877, 'Rare', 'Very Fine', 'australia-sovereign-1877-1.png'),
(54, 11, 'Peru Provisional 10 Centavos', 'peru-10-centavos-1879', 'Copper-nickel 10-centavos provisional coinage, Peru, 1879. War of the Pacific era.', 1879, 'Scarce', 'Very Fine', 'peru-10-centavos-1879-1.png'),
(55, 11, 'Chile Peso', 'chile-peso-1880', 'Silver peso, Santiago mint, 1880-SO. South American republic coinage.', 1880, 'Common', 'Very Fine', 'chile-peso-1880-1.png'),
(56, 11, 'New Zealand Merchant Token', 'nz-merchant-token-1881', 'Bronze merchant token, Milner & Thompson''s Music Depot, Christchurch, 1881. New Zealand trade token.', 1881, 'Scarce', 'Very Fine', 'nz-merchant-token-1881-1.png'),
(57, 11, 'Newfoundland 2 Dollars', 'newfoundland-2-dollars-1885', 'Gold 2 dollars of Queen Victoria, Newfoundland, 1885. Canadian colonial gold.', 1885, 'Rare', 'Very Fine', 'newfoundland-2-dollars-1885-1.jpg'),
(58, 11, 'Japan Dragon Yen', 'japan-dragon-yen-1890', 'Silver "dragon" yen of Emperor Meiji, Year 23 (1890). Iconic Meiji period silver.', 1890, 'Common', 'Very Fine', 'japan-dragon-yen-1890-1.png'),
(59, 11, 'Victoria Half Sovereign', 'victoria-half-sovereign-1901', 'Gold half-sovereign of Queen Victoria, 1901. From the Dr. Jacob Terner collection.', 1901, 'Common', 'About Uncirculated', 'victoria-half-sovereign-1901-1.jpg'),
(60, 11, 'Stuttgart New Year Klippe', 'stuttgart-klippe-1904', 'Silver klippe, Stuttgart Numismatic Association, ca. 1904. "Happy New Year" commemorative.', 1904, 'Rare', 'Proof-like', 'stuttgart-klippe-1904-1.jpg'),
(61, 11, 'Philippines Peso', 'philippines-peso-1904', 'Silver peso, US Administration, 1904-S large type. American colonial silver.', 1904, 'Common', 'Very Fine', 'philippines-peso-1904-1.png'),
(62, 11, 'Westphalia Notgeld', 'westphalia-notgeld-1923', 'Gilt bronze 10,000-mark notgeld token, Westphalia, 1923. German hyperinflation emergency money.', 1923, 'Common', 'Uncirculated', 'westphalia-notgeld-1923-1.jpg'),
(63, 11, 'Soviet Rouble', 'soviet-rouble-1924', 'Silver rouble, Leningrad mint, 1924-ПЛ. Early Soviet Union coinage.', 1924, 'Common', 'Very Fine', 'soviet-rouble-1924-1.jpg'),
(64, 11, 'Greenland 25 Ore', 'greenland-25-ore-1926', 'Copper-nickel 25-øre, Copenhagen mint, 1926 (h). Danish colonial coinage.', 1926, 'Scarce', 'Very Fine', 'greenland-25-ore-1926-1.jpg'),
(65, 11, 'Australia Parliament Florin', 'australia-parliament-florin-1927', 'Silver florin of George V, 1927. Canberra Parliament House commemorative.', 1927, 'Scarce', 'Extremely Fine', 'australia-parliament-florin-1927-1.jpg'),
(66, 11, 'Bremerhaven 3 Reichsmark', 'bremerhaven-3-reichsmark-1927', 'Silver 3-reichsmark, Bremerhaven commemorative, 1927-A. Weimar Republic commemorative.', 1927, 'Scarce', 'About Uncirculated', 'bremerhaven-3-reichsmark-1927-1.png'),
(67, 11, 'Weimar Oak Tree 5 Marks', 'weimar-5-marks-oak-1927', 'Silver 5 marks, Oak Tree type, 1927-A. Weimar Republic regular issue.', 1927, 'Common', 'Extremely Fine', 'weimar-5-marks-oak-1927-1.png'),
(68, 11, 'Palestine 5 Mils', 'palestine-5-mils-1944', 'Bronze 5-mils of British Palestine, 1944. From a US Merchant Marine captain''s WW2 collection.', 1944, 'Common', 'Very Fine', 'palestine-5-mils-1944-1.jpg'),
(69, 11, 'Panama Balboa', 'panama-balboa-1947', 'Silver Balboa, 1947. Large silver from the Republic of Panama.', 1947, 'Common', 'Very Fine', 'panama-balboa-1947-1.png'),
(70, 11, 'New Zealand Coronation Crown', 'nz-proof-crown-1953', 'Proof copper-nickel crown, 1953. Elizabeth II Coronation issue.', 1953, 'Scarce', 'Proof', 'nz-proof-crown-1953-1.png'),
(71, 11, 'Esperanto 10 Steloj', 'esperanto-10-steloj-1959', 'Copper-nickel 10-steloj fantasy, Universal Esperanto League, 1959. Struck 1960 at Utrecht.', 1959, 'Rare', 'Uncirculated', 'esperanto-10-steloj-1959-1.jpg'),
(72, 11, 'Peru Gold 100 Soles', 'peru-100-soles-1965', 'Gold 100-soles, Seated Liberty type, 1965. 9 over inverted 5 variety.', 1965, 'Rare', 'About Uncirculated', 'peru-100-soles-1965-1.png'),
(73, 11, 'Tanzania FAO 5 Shilingi', 'tanzania-5-shilingi-1972', 'Copper-nickel 5-shilingi, United Nations F.A.O. issue, 1972. African commemorative.', 1972, 'Common', 'Uncirculated', 'tanzania-5-shilingi-1972-1.jpg'),
(74, 11, 'Bahamas Proof 10 Cents', 'bahamas-proof-10-cents-1974', 'Copper-nickel proof 10-cents, Bonefish design, 1974-FM. Caribbean proof coinage.', 1974, 'Common', 'Proof', 'bahamas-proof-10-cents-1974-1.jpg'),
(75, 11, 'Canada Silver Jubilee 100 Dollars', 'canada-proof-100-dollars-1977', 'Gold proof 100 dollars of Elizabeth II, 1977. Silver Jubilee commemorative.', 1977, 'Scarce', 'Proof', 'canada-proof-100-dollars-1977-1.png'),
(76, 11, 'Nepal Buddha Gold Asarfi', 'nepal-gold-asarfi-1995', 'Gold proof Asarfi of Gyanendra Shah, VS2052 (1995). 1/20 oz Lord Buddha commemorative.', 1995, 'Rare', 'Proof', 'nepal-gold-asarfi-1995-1.png'),
(77, 11, 'Bermuda Sea Venture 60 Dollars', 'bermuda-triangle-60-dollars-1997', 'Gold 60-dollars, "Bermuda Triangle," 1997. Commemorating the wreck of the Sea Venture.', 1997, 'Rare', 'Proof', 'bermuda-triangle-60-dollars-1997-1.jpg'),
(78, 11, 'Austria Klosterneuburg 10 Euro', 'austria-klosterneuburg-10-euro-2008', 'Silver proof 10-euro, Klosterneuburg Abbey commemorative, 2008.', 2008, 'Common', 'Proof', 'austria-klosterneuburg-10-euro-2008-1.png'),
(79, 11, 'Great Britain Proof Britannia', 'gb-proof-britannia-2013', 'Proof silver Britannia commemorative, 1 oz .999 fine, 2013.', 2013, 'Common', 'Proof', 'gb-proof-britannia-2013-1.jpg'),
(80, 11, 'Luxembourg Wildcat 5 Euros', 'luxembourg-wildcat-5-euros-2015', 'Proof bimetallic 5 euros of Henri I, European Wildcat, 2015.', 2015, 'Scarce', 'Proof', 'luxembourg-wildcat-5-euros-2015-1.jpg'),
(81, 11, 'China Auspicious Culture 10 Yuan', 'china-auspicious-10-yuan-2016', 'Gilt-enamel proof silver 10-yuan, "Auspicious Culture: Longevity," 2016.', 2016, 'Scarce', 'Proof', 'china-auspicious-10-yuan-2016-1.png'),
(82, 11, 'Ghana African Leopard 5 Cedis', 'ghana-leopard-5-cedis-2017', 'Silver 5-cedis of Elizabeth II, African Leopard commemorative, 1 oz, 2017.', 2017, 'Common', 'Brilliant Unc', 'ghana-leopard-5-cedis-2017-1.jpg'),
(83, 11, 'Kazakhstan Eagle Owl 200 Tenge', 'kazakhstan-eagle-owl-2019', 'Copper-nickel gilt 200-tenge, Eagle Owl design, 2019.', 2019, 'Common', 'Brilliant Unc', 'kazakhstan-eagle-owl-2019-1.jpg'),
(84, 11, 'Great Britain Mayflower 100 Pounds', 'gb-mayflower-100-pounds-2020', 'Gold 100-pounds, Mayflower 400th Anniversary commemorative, 2020.', 2020, 'Scarce', 'Proof', 'gb-mayflower-100-pounds-2020-1.jpg');

-- ============================================
-- STEP 4: Add Images for new coins
-- ============================================

-- Roman Twelve Caesars Images
INSERT INTO Images (id, coinId, filename, title, alt, description, isPrimary, sortOrder) VALUES
(56, 17, 'julius-caesar-denarius-44bc-1.png', 'Julius Caesar Denarius', 'Julius Caesar silver denarius 44 BC', 'Lifetime issue silver denarius of Julius Caesar', 1, 1),
(57, 18, 'augustus-cistophorus-25bc-1.png', 'Augustus Cistophorus', 'Augustus silver cistophorus', 'Large provincial silver from Ephesus', 1, 1),
(58, 19, 'tiberius-tribute-penny-1.png', 'Tiberius Tribute Penny', 'Tiberius silver denarius', 'The biblical Tribute Penny', 1, 1),
(59, 20, 'caligula-bronze-as-1.png', 'Caligula Bronze As', 'Caligula bronze as', 'Bronze coin from Caligula reign', 1, 1),
(60, 21, 'claudius-sestertius-1.png', 'Claudius Sestertius', 'Claudius bronze sestertius', 'Large bronze sestertius', 1, 1),
(61, 22, 'galba-denarius-1.png', 'Galba Denarius', 'Galba silver denarius', 'Civil War emperor denarius', 1, 1),
(62, 23, 'otho-denarius-1.png', 'Otho Denarius', 'Otho silver denarius', 'Rare 3-month reign denarius', 1, 1),
(63, 24, 'vitellius-denarius-1.png', 'Vitellius Denarius', 'Vitellius silver denarius', 'Civil War emperor denarius', 1, 1),
(64, 25, 'vespasian-denarius-titus-1.png', 'Vespasian Commemorative', 'Vespasian silver denarius', 'Struck by Titus in memory of Vespasian', 1, 1),
(65, 26, 'titus-gold-aureus-1.png', 'Titus Colosseum Aureus', 'Titus gold aureus', 'Commemorating Colosseum opening', 1, 1),
(66, 27, 'domitian-denarius-1.png', 'Domitian Denarius', 'Domitian silver denarius', 'As Caesar under Titus', 1, 1),
(67, 28, 'hadrian-sestertius-1.png', 'Hadrian Sestertius', 'Hadrian bronze sestertius', 'Ex-Boston MFA collection', 1, 1),
(68, 29, 'antoninus-pius-sestertius-1.png', 'Antoninus Pius Sestertius', 'Antoninus Pius bronze sestertius', 'Five Good Emperors era', 1, 1),
(69, 30, 'julian-ii-siliqua-1.png', 'Julian II Siliqua', 'Julian II silver siliqua', 'East Harptree Hoard find', 1, 1);

-- World Coins Images (first batch - IDs 70-123)
INSERT INTO Images (id, coinId, filename, title, alt, description, isPrimary, sortOrder) VALUES
(70, 31, 'teutonic-quarter-thaler-1615-1.jpg', 'Teutonic Order Quarter Thaler', 'Teutonic Order silver quarter thaler', 'Grand Master Maximilian of Austria', 1, 1),
(71, 32, 'james-i-laurel-1623-1.png', 'James I Gold Laurel', 'James I gold laurel', 'Stuart dynasty gold coinage', 1, 1),
(72, 33, 'charles-ii-crown-1679-1.png', 'Charles II Crown', 'Charles II silver crown', 'Restoration period silver', 1, 1),
(73, 34, 'austria-leopold-3-kreuzer-1700-1.jpg', 'Leopold I 3-Kreuzer', 'Austria Leopold I 3-kreuzer', 'Habsburg silver', 1, 1),
(74, 35, 'brunswick-wildman-1702-1.png', 'Brunswick Wildman', 'Brunswick wildman coin', 'Iconic German states design', 1, 1),
(75, 36, 'south-sea-sixpence-1723-1.jpg', 'South Sea Sixpence', 'George I sixpence', 'Double-struck mint error', 1, 1),
(76, 37, 'augsburg-confession-medal-1730-1.jpg', 'Augsburg Confession Medal', 'Augsburg Confession silver medal', 'Daniel Dockler religious medal', 1, 1),
(77, 38, 'mexico-8-reales-1736-1.png', 'Mexico Pillar Dollar', 'Mexico 8 reales pillar dollar', 'Spanish colonial trade coin', 1, 1),
(78, 39, 'zurich-half-thaler-1739-1.jpg', 'Zurich Half Thaler', 'Zurich city view half thaler', 'Swiss cantonal silver', 1, 1),
(79, 40, 'colombia-gold-escudo-1753-1.png', 'Colombia Gold Escudo', 'Colombia gold cob escudo', 'Spanish colonial gold', 1, 1),
(80, 41, 'george-iii-guinea-1781-1.png', 'George III Guinea', 'George III gold guinea', 'British gold coinage', 1, 1),
(81, 42, 'siberia-10-kopecks-1781-1.jpg', 'Siberia 10 Kopecks', 'Catherine the Great 10 kopecks', 'Siberian regional copper', 1, 1),
(82, 43, 'bermuda-proof-penny-1793-1.png', 'Bermuda Proof Penny', 'Bermuda proof penny', 'Colonial proof coinage', 1, 1),
(83, 44, 'chichester-conder-1794-1.jpg', 'Chichester Conder Token', 'Chichester conder halfpenny', 'British trade token', 1, 1),
(84, 45, 'cartwheel-twopence-1797-1.png', 'Cartwheel Twopence', 'George III cartwheel twopence', 'Boulton large copper', 1, 1),
(85, 46, 'ireland-proof-halfpenny-1805-1.jpg', 'Ireland Proof Halfpenny', 'Ireland bronzed proof halfpenny', 'Soho Mint proof', 1, 1),
(86, 47, 'colombia-8-escudos-1808-1.jpg', 'Colombia 8 Escudos', 'Colombia gold 8 escudos', 'Spanish colonial gold doubloon', 1, 1),
(87, 48, 'persia-gold-toman-1817-1.jpg', 'Persia Gold Toman', 'Persia Qajar gold toman', 'Fath-Ali Shah gold', 1, 1),
(88, 49, 'japan-gold-2-shu-1832-1.png', 'Japan Gold 2-Shu', 'Japan Edo gold 2-shu', 'Pre-Meiji Japanese gold', 1, 1),
(89, 50, 'france-bovy-medal-1840-1.jpg', 'Bovy Napoleon Medal', 'France Bovy Napoleon medal', 'Bonaparte funeral commemorative', 1, 1),
(90, 51, 'gothic-florin-1865-1.jpg', 'Gothic Florin', 'Victoria Gothic florin', 'Beautiful British silver', 1, 1),
(91, 52, 'france-jeton-1869-1.jpg', 'France Jeton', 'France insurance jeton', 'La Prevoyance silver token', 1, 1),
(92, 53, 'australia-sovereign-1877-1.png', 'Australia Shipwreck Sovereign', 'Australia gold sovereign', 'RMS Duoro wreck recovery', 1, 1),
(93, 54, 'peru-10-centavos-1879-1.png', 'Peru 10 Centavos', 'Peru provisional 10 centavos', 'War of the Pacific era', 1, 1),
(94, 55, 'chile-peso-1880-1.png', 'Chile Peso', 'Chile silver peso', 'South American republic silver', 1, 1),
(95, 56, 'nz-merchant-token-1881-1.png', 'New Zealand Token', 'New Zealand merchant token', 'Milner Thompson trade token', 1, 1),
(96, 57, 'newfoundland-2-dollars-1885-1.jpg', 'Newfoundland 2 Dollars', 'Newfoundland gold 2 dollars', 'Canadian colonial gold', 1, 1),
(97, 58, 'japan-dragon-yen-1890-1.png', 'Japan Dragon Yen', 'Japan Meiji dragon yen', 'Iconic Japanese silver', 1, 1),
(98, 59, 'victoria-half-sovereign-1901-1.jpg', 'Victoria Half Sovereign', 'Victoria gold half sovereign', 'Terner collection provenance', 1, 1),
(99, 60, 'stuttgart-klippe-1904-1.jpg', 'Stuttgart Klippe', 'Stuttgart numismatic klippe', 'New Year commemorative', 1, 1),
(100, 61, 'philippines-peso-1904-1.png', 'Philippines Peso', 'Philippines US admin peso', 'American colonial silver', 1, 1),
(101, 62, 'westphalia-notgeld-1923-1.jpg', 'Westphalia Notgeld', 'Westphalia emergency money', 'Hyperinflation token', 1, 1),
(102, 63, 'soviet-rouble-1924-1.jpg', 'Soviet Rouble', 'Soviet Russia silver rouble', 'Early USSR coinage', 1, 1),
(103, 64, 'greenland-25-ore-1926-1.jpg', 'Greenland 25 Ore', 'Greenland 25 ore', 'Danish colonial coinage', 1, 1),
(104, 65, 'australia-parliament-florin-1927-1.jpg', 'Australia Parliament Florin', 'Australia commemorative florin', 'Canberra Parliament House', 1, 1),
(105, 66, 'bremerhaven-3-reichsmark-1927-1.png', 'Bremerhaven 3 Reichsmark', 'Germany Weimar commemorative', 'Bremerhaven silver', 1, 1),
(106, 67, 'weimar-5-marks-oak-1927-1.png', 'Weimar 5 Marks', 'Germany Weimar 5 marks', 'Oak Tree type', 1, 1),
(107, 68, 'palestine-5-mils-1944-1.jpg', 'Palestine 5 Mils', 'British Palestine 5 mils', 'WW2 era coinage', 1, 1),
(108, 69, 'panama-balboa-1947-1.png', 'Panama Balboa', 'Panama silver balboa', 'Large silver dollar', 1, 1),
(109, 70, 'nz-proof-crown-1953-1.png', 'New Zealand Crown', 'New Zealand proof crown', 'Coronation commemorative', 1, 1),
(110, 71, 'esperanto-10-steloj-1959-1.jpg', 'Esperanto 10 Steloj', 'Esperanto fantasy coin', 'Universal league issue', 1, 1),
(111, 72, 'peru-100-soles-1965-1.png', 'Peru 100 Soles', 'Peru gold 100 soles', 'Variety with overdate', 1, 1),
(112, 73, 'tanzania-5-shilingi-1972-1.jpg', 'Tanzania 5 Shilingi', 'Tanzania FAO 5 shilingi', 'United Nations issue', 1, 1),
(113, 74, 'bahamas-proof-10-cents-1974-1.jpg', 'Bahamas 10 Cents', 'Bahamas proof 10 cents', 'Bonefish design', 1, 1),
(114, 75, 'canada-proof-100-dollars-1977-1.png', 'Canada 100 Dollars', 'Canada proof gold 100 dollars', 'Silver Jubilee gold', 1, 1),
(115, 76, 'nepal-gold-asarfi-1995-1.png', 'Nepal Gold Asarfi', 'Nepal proof gold asarfi', 'Lord Buddha commemorative', 1, 1),
(116, 77, 'bermuda-triangle-60-dollars-1997-1.jpg', 'Bermuda 60 Dollars', 'Bermuda gold 60 dollars', 'Sea Venture wreck commemorative', 1, 1),
(117, 78, 'austria-klosterneuburg-10-euro-2008-1.png', 'Austria 10 Euro', 'Austria proof 10 euro', 'Klosterneuburg Abbey', 1, 1),
(118, 79, 'gb-proof-britannia-2013-1.jpg', 'Britannia', 'Great Britain proof Britannia', 'One ounce silver proof', 1, 1),
(119, 80, 'luxembourg-wildcat-5-euros-2015-1.jpg', 'Luxembourg 5 Euros', 'Luxembourg bimetallic 5 euros', 'European Wildcat', 1, 1),
(120, 81, 'china-auspicious-10-yuan-2016-1.png', 'China 10 Yuan', 'China proof 10 yuan', 'Auspicious Culture series', 1, 1),
(121, 82, 'ghana-leopard-5-cedis-2017-1.jpg', 'Ghana 5 Cedis', 'Ghana silver 5 cedis', 'African Leopard', 1, 1),
(122, 83, 'kazakhstan-eagle-owl-2019-1.jpg', 'Kazakhstan 200 Tenge', 'Kazakhstan gilt 200 tenge', 'Eagle Owl design', 1, 1),
(123, 84, 'gb-mayflower-100-pounds-2020-1.jpg', 'Mayflower 100 Pounds', 'Great Britain gold 100 pounds', 'Mayflower 400th anniversary', 1, 1);
