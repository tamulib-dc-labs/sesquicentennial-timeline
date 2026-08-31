/**
 * One-off / re-sync helper: converts the aggie-theme timeline-data.js module
 * into the plain JSON this app serves from public/timeline.json.
 *
 * Usage:
 *   node scripts/import-data.mjs ../aggie-theme/data/timeline-data.js
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = process.argv[2] || '../aggie-theme/data/timeline-data.js';
const mod = await import(resolve(process.cwd(), src));
const data = mod.default;

writeFileSync(
  resolve(process.cwd(), 'public/timeline.json'),
  JSON.stringify(data, null, 2) + '\n'
);
console.log(`Wrote public/timeline.json (${data.decades.length} decades)`);
