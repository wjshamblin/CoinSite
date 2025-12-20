#!/usr/bin/env node
/**
 * Download coin images from CoinTalk World Coins thread
 * Images are in chronological order matching the World Coins collection
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = './public/images/coins';

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// CoinTalk attachment URLs mapped to coins (in order from the World Coins thread)
// Thread: https://www.cointalk.com/threads/lordmarcovan-my-world-coins-collection-1601-to-present-as-of-fall-2025.419184/
const COINTALK_IMAGES = [
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686561/', coin: 'teutonic-quarter-thaler-1615', name: 'Teutonic Order Quarter Thaler ca. 1615' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686562/', coin: 'james-i-laurel-1623', name: 'England James I Gold Laurel ca. 1623-1624' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686563/', coin: 'mysore-gold-fanam', name: 'India Mysore Gold Fanam ca. 1638-1812' },
  { url: 'https://www.cointalk.com/attachments/01-chas2-crown-frame-png.1686564/', coin: 'charles-ii-crown-1679', name: 'England Charles II Crown 1679' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686565/', coin: 'austria-leopold-3-kreuzer-1700', name: 'Austria Leopold I 3-Kreuzer 1700' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686566/', coin: 'brunswick-wildman-1702', name: 'Brunswick Wildman 24-Mariengroschen 1702' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686567/', coin: 'south-sea-sixpence-1723', name: 'Great Britain South Sea Sixpence 1723' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686568/', coin: 'augsburg-confession-medal-1730', name: 'Nurnberg Augsburg Confession Medal 1730' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686569/', coin: 'mexico-8-reales-1736', name: 'Mexico 8 Reales Pillar Dollar 1736' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686570/', coin: 'zurich-half-thaler-1739', name: 'Zurich City View Half Thaler 1739' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686571/', coin: 'colombia-gold-escudo-1753', name: 'Colombia Gold Cob Escudo ca. 1753-56' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686572/', coin: 'george-iii-guinea-1781', name: 'Great Britain Rose Guinea 1781' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686573/', coin: 'siberia-10-kopecks-1781', name: 'Russia Siberia 10 Kopecks 1781' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686574/', coin: 'bermuda-proof-penny-1793', name: 'Bermuda Proof Penny 1793' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686575/', coin: 'chichester-conder-1794', name: 'Chichester Conder Halfpenny 1794' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686576/', coin: 'cartwheel-twopence-1797', name: 'Great Britain Cartwheel Twopence 1797' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686577/', coin: 'ireland-proof-halfpenny-1805', name: 'Ireland Bronzed Proof Halfpenny 1805' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686578/', coin: 'colombia-8-escudos-1808', name: 'Colombia Gold 8 Escudos 1808' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686579/', coin: 'persia-gold-toman-1817', name: 'Persia Gold Toman 1817' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686580/', coin: 'japan-gold-2-shu-1832', name: 'Japan Edo Gold 2-Shu ca. 1832-1858' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686581/', coin: 'france-bovy-medal-1840', name: 'France Bovy Napoleon Medal 1840' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686582/', coin: 'gothic-florin-1865', name: 'Great Britain Gothic Florin 1865' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686583/', coin: 'france-jeton-1869', name: 'France La Prevoyance Jeton 1869' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686584/', coin: 'australia-sovereign-1877', name: 'Australia RMS Duoro Shipwreck Sovereign 1877' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686585/', coin: 'peru-10-centavos-1879', name: 'Peru Provisional 10 Centavos 1879' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686586/', coin: 'chile-peso-1880', name: 'Chile Peso 1880' },
  { url: 'https://www.cointalk.com/attachments/01-nztoken-frame-png.1686587/', coin: 'nz-merchant-token-1881', name: 'New Zealand Milner Thompson Token 1881' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686588/', coin: 'newfoundland-2-dollars-1885', name: 'Canada Newfoundland 2 Dollars 1885' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686589/', coin: 'japan-dragon-yen-1890', name: 'Japan Dragon Yen 1890' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686590/', coin: 'victoria-half-sovereign-1901', name: 'Great Britain Victoria Half Sovereign 1901' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686591/', coin: 'stuttgart-klippe-1904', name: 'Germany Stuttgart New Year Klippe 1904' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686592/', coin: 'philippines-peso-1904', name: 'Philippines US Admin Peso 1904' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686593/', coin: 'westphalia-notgeld-1923', name: 'Germany Westphalia 10000 Mark Notgeld 1923' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686594/', coin: 'soviet-rouble-1924', name: 'Soviet Russia Rouble 1924' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686595/', coin: 'greenland-25-ore-1926', name: 'Greenland 25 Ore 1926' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686596/', coin: 'australia-parliament-florin-1927', name: 'Australia Parliament House Florin 1927' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686597/', coin: 'bremerhaven-3-reichsmark-1927', name: 'Germany Bremerhaven 3 Reichsmark 1927' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686598/', coin: 'weimar-5-marks-oak-1927', name: 'Germany Weimar 5 Marks Oak Tree 1927' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686599/', coin: 'palestine-5-mils-1944', name: 'Palestine British 5 Mils 1944' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686600/', coin: 'panama-balboa-1947', name: 'Panama Balboa 1947' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686602/', coin: 'nz-proof-crown-1953', name: 'New Zealand Coronation Proof Crown 1953' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686603/', coin: 'esperanto-10-steloj-1959', name: 'Esperanto 10 Steloj Fantasy 1959' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686604/', coin: 'peru-100-soles-1965', name: 'Peru Gold 100 Soles 1965' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686605/', coin: 'tanzania-5-shilingi-1972', name: 'Tanzania FAO 5 Shilingi 1972' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686606/', coin: 'bahamas-proof-10-cents-1974', name: 'Bahamas Bonefish Proof 10 Cents 1974' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686607/', coin: 'canada-proof-100-dollars-1977', name: 'Canada Silver Jubilee Gold 100 Dollars 1977' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686608/', coin: 'nepal-gold-asarfi-1995', name: 'Nepal Lord Buddha Gold Asarfi 1995' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686609/', coin: 'bermuda-triangle-60-dollars-1997', name: 'Bermuda Sea Venture Gold 60 Dollars 1997' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686610/', coin: 'austria-klosterneuburg-10-euro-2008', name: 'Austria Klosterneuburg 10 Euro 2008' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686611/', coin: 'gb-proof-britannia-2013', name: 'Great Britain Proof Britannia 2013' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686612/', coin: 'luxembourg-wildcat-5-euros-2015', name: 'Luxembourg Wildcat 5 Euros 2015' },
  { url: 'https://www.cointalk.com/attachments/01-frame-png.1686613/', coin: 'china-auspicious-10-yuan-2016', name: 'China Auspicious Culture 10 Yuan 2016' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686614/', coin: 'ghana-leopard-5-cedis-2017', name: 'Ghana African Leopard 5 Cedis 2017' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686615/', coin: 'kazakhstan-eagle-owl-2019', name: 'Kazakhstan Eagle Owl 200 Tenge 2019' },
  { url: 'https://www.cointalk.com/attachments/01-frame-jpg.1686616/', coin: 'gb-mayflower-100-pounds-2020', name: 'Great Britain Mayflower Gold 100 Pounds 2020' },
];

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
      }
    });
    if (!response.ok) {
      console.log(`  SKIP: ${filename} - HTTP ${response.status}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    const outputPath = join(OUTPUT_DIR, filename);
    writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`  OK: ${filename} (${Math.round(buffer.byteLength / 1024)}KB)`);
    return true;
  } catch (error) {
    console.log(`  ERROR: ${filename} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Downloading Coin Images from CoinTalk ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Total images: ${COINTALK_IMAGES.length}\n`);

  let downloaded = 0;
  let failed = 0;

  for (const img of COINTALK_IMAGES) {
    // Determine extension from URL
    const ext = img.url.includes('-png.') ? 'png' : 'jpg';
    const filename = `${img.coin}-1.${ext}`;
    console.log(`[${downloaded + failed + 1}/${COINTALK_IMAGES.length}] ${img.name}`);
    const success = await downloadImage(img.url, filename);
    if (success) downloaded++;
    else failed++;

    // Small delay to be polite to the server
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Complete ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
}

main();
