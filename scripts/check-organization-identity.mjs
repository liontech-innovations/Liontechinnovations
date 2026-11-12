import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const expected = [
  'https://find-and-update.company-information.service.gov.uk/company/17068390',
  'https://uk.linkedin.com/company/liontechinnovations',
];
const checked = [];
for (const file of ['dist/index.html', 'dist/about/index.html']) {
  const html = await readFile(file, 'utf8');
  const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap(match => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });
  const org = blocks.find(value => value['@type'] === 'Organization');
  assert.ok(org, `${file}: missing Organization`);
  assert.equal(org['@id'], 'https://liontechinnovations.co.uk/#organization');
  assert.equal(org.legalName, 'Lion Tech Innovations Ltd');
  assert.deepEqual(org.sameAs, expected);
  assert.equal(org.identifier.value, '17068390');
  assert.equal(new Set(org.sameAs).size, 2);
  checked.push(file);
}
console.log(JSON.stringify({status:'PASS', scope:'Built homepage and About Organization identity', checked, sameAs:expected}, null, 2));
