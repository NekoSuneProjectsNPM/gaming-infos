'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const gaming = require('../index');
test('Warframe is the only initial provider', () => {
  assert.deepEqual(gaming.listProviders(), ['warframe']);
  assert.equal(gaming.providers.warframe.id, 'warframe');
});
test('unknown games are rejected explicitly', () => {
  assert.throws(() => gaming.createClient('fortnite'), /not installed/);
  assert.throws(() => gaming.createClient(''), TypeError);
});
test('Warframe delegates to its standalone package and supports bundled data', async () => {
  const wf = gaming.createWarframe({ platform: 'pc' });
  assert.equal(typeof wf.About, 'function');
  assert.equal(typeof wf.api.alerts, 'function');
  assert.equal(typeof wf.codes.active, 'function');
  const about = await wf.About();
  assert.ok(about && typeof about === 'object');
  const result = await wf.search('Ash');
  assert.ok(result.total >= 1);
  assert.equal(gaming.createClient('WARFRAME').character instanceof Function, true);
});
