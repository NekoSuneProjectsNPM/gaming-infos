'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const gaming = require('../index');

test('Warframe and VRChat are the installed game providers', () => {
  assert.deepEqual(gaming.listProviders(), ['warframe', 'vrchat']);
  assert.equal(gaming.providers.warframe.id, 'warframe');
  assert.equal(gaming.providers.vrchat.id, 'vrchat');
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
  assert.equal(typeof gaming.createClient('WARFRAME').character, 'function');
});

test('VRChat delegates to its standalone package with JSON and online methods', async () => {
  const vrchat = gaming.createVRChat();
  assert.equal(typeof vrchat.About, 'function');
  assert.equal(typeof vrchat.worlds.browse, 'function');
  assert.equal(typeof vrchat.worlds.searchOnline, 'function');
  assert.equal(typeof vrchat.groups.searchOnline, 'function');
  assert.equal(typeof vrchat.avatars.searchOnline, 'function');
  const about = await vrchat.About();
  assert.equal(about.name, 'VRChat');
  const world = await vrchat.world('theblackcat', { refresh: false });
  assert.equal(world.name, 'The Black Cat');
  const results = await vrchat.worlds.search('Black Cat');
  assert.ok(results.total > 0);
  assert.equal(typeof gaming.createClient('VRCHAT').worlds.browse, 'function');
});
