import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = [
  ...walk(path.join(ROOT, 'app')),
  ...walk(path.join(ROOT, 'components')),
  ...walk(path.join(ROOT, 'lib')),
];

const bannedPatterns = [
  /AI writers/i,
  /data scientists/i,
  /millions of data points/i,
  /real-time crowd densit/i,
  /100 global cities/i,
  /eco-friendly vendors/i,
];

const violations = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pat of bannedPatterns) {
    if (pat.test(content)) {
      violations.push(`${path.relative(ROOT, file)} matched ${pat}`);
    }
  }
}
assert.equal(violations.length, 0, `Unsupported claims found:\n${violations.join('\n')}`);

const layoutSrc = fs.readFileSync(path.join(ROOT, 'app/layout.tsx'), 'utf8');
assert.ok(layoutSrc.includes('href="#main-content"'), 'layout.tsx must include skip-to-content link');
assert.ok(!layoutSrc.includes("addressCountry: 'US'"), 'layout.tsx must not contain US TravelAgency placeholder');

const configSrc = fs.readFileSync(path.join(ROOT, 'lib/config.ts'), 'utf8');
assert.ok(configSrc.includes("NODE_ENV === 'production'"), 'lib/config.ts must handle production API_URL');

console.log(`QA regression passed: ${files.length} files checked, 0 unsupported claims, layout & config verified.`);

