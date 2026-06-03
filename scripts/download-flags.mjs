/**
 * Downloads SVG flag images from flagcdn.com for every country in flags.ts.
 * Idempotent: skips files that already exist.
 *
 * Usage: npm run download-flags
 */
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'flags');

// ISO codes extracted from flags.ts
const CODES = [
  'it','fr','de','es','pt','ch','nl','be','at','se','no','dk','fi','gr','pl',
  'gb','us','ca','br','ar','mx','au','jp','cn','in','ru','za','eg','tr','kr',
  'ie','is','lu','hr','si','sk','cz','hu','ro','bg','rs','ba','mk','al','me',
  'lt','lv','ee','ua','by','md','mt','cy',
  'th','id','vn','ph','my','sg','mm','kh','pk','bd','lk','np',
  'sa','ae','iq','ir','il','jo','lb','sy','kp',
  'ng','ke','et','gh','ug','sn','tz','ma','tn','dz','cm','ao','mz','zw','zm','rw','mg',
  'cl','co','pe','ve','ec','bo','py','uy','cu','nz',
  'kz','uz','az','am','ge','mn',
  'li','mc','sm','va','ad','xk',
  'tm','kg','tj','af','la','tl','bn','mv','bt','tw',
  'ye','om','kw','bh','qa','ps',
  'ci','gn','sl','lr','tg','bj','gm','gw','cv','st','gq','ga',
  'bi','so','dj','er','ss','sd','cf','km','sc','mu','mw','sz','ls','na','bw',
  'cd','cg','td','ml','bf','ne','mr',
  'pg','fj','sb','vu','ws','to','ki','tv','nr','pw','mh','fm',
  'gt','hn','sv','ni','ht','do','jm','tt','bb','lc','vc','gd','ag','dm','kn','bs','bz',
  'cr','pa','gy','sr',
];

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let downloaded = 0, skipped = 0, failed = 0;

function download(code) {
  return new Promise((resolve) => {
    const dest = path.join(OUT_DIR, `${code}.svg`);
    if (fs.existsSync(dest)) { skipped++; resolve(); return; }

    const url = `https://flagcdn.com/${code}.svg`;
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest);
        console.warn(`  ✗ ${code} (HTTP ${res.statusCode})`);
        failed++; resolve(); return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); downloaded++; resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.warn(`  ✗ ${code} (${err.message})`);
      failed++; resolve();
    });
  });
}

console.log(`Downloading ${CODES.length} flag SVGs to ${OUT_DIR} ...\n`);

// Download in batches of 8 to avoid hammering the server
const BATCH = 8;
for (let i = 0; i < CODES.length; i += BATCH) {
  const batch = CODES.slice(i, i + BATCH);
  await Promise.all(batch.map(download));
  process.stdout.write(`\r  ${i + batch.length}/${CODES.length} processed`);
}

console.log(`\n\nDone! Downloaded: ${downloaded}  Skipped: ${skipped}  Failed: ${failed}`);
