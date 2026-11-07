'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const gaming = require('../index');

test('all eight standalone game providers are registered', () => {
  assert.deepEqual(gaming.listProviders(), ['warframe', 'vrchat', 'genshinimpact', 'honkaistarrail', 'zenlesszonezero', 'arknightsendfield', 'nte', 'wutheringwaves']);
  assert.equal(gaming.providers.warframe.id, 'warframe');
  assert.equal(gaming.providers.vrchat.id, 'vrchat');
  assert.equal(gaming.providers.genshinimpact.id, 'genshinimpact');
  assert.equal(gaming.providers.honkaistarrail.id, 'honkaistarrail');
  assert.equal(gaming.providers.zenlesszonezero.id, 'zenlesszonezero');
  assert.equal(gaming.providers.arknightsendfield.id, 'arknightsendfield');
  assert.equal(gaming.providers.nte.id, 'nte');
  assert.equal(gaming.providers.wutheringwaves.id, 'wutheringwaves');
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

test('Genshin Impact uses standalone npm package for local characters and redeem codes', async () => {
  const genshin = gaming.createGenshinImpact({fetchImpl: async () => {
    throw Error('Network access should not be used for bundled JSON');
  }});
  assert.equal(typeof genshin.About, 'function');
  assert.equal(typeof genshin.character, 'function');
  assert.equal(typeof genshin.characters.list, 'function');
  assert.equal(typeof genshin.codes.snapshot, 'function');
  assert.equal(typeof genshin.enka.player, 'function');

  const about = await genshin.About();
  assert.equal(about.name, 'Genshin Impact');
  const amber = await genshin.character('amber');
  assert.equal(amber.name, 'Amber');

  const codes = await genshin.codes.snapshot();
  assert.ok(Array.isArray(codes.Active));
  assert.ok(Array.isArray(codes.Expired));
  assert.ok(Array.isArray(codes.Unknown));
  assert.equal(typeof gaming.createClient('GENSHINIMPACT').enka.player, 'function');
});

test('Genshin Impact provider rejects invalid options', () => {
  assert.throws(() => gaming.createGenshinImpact(null), TypeError);
  assert.throws(() => gaming.createGenshinImpact([]), TypeError);
});


test('five additional standalone APIs expose local data, characters and code archives', async () => {
 const factories = [
  ['honkaistarrail', 'Honkai: Star Rail', 'createHonkaiStarRail', 'March 7th'],
  ['zenlesszonezero', 'Zenless Zone Zero', 'createZenlessZoneZero', 'Ellen Joe'],
  ['arknightsendfield', 'Arknights: Endfield', 'createArknightsEndfield', 'Akekuri'],
  ['nte', 'Neverness to Everness', 'createNTE', 'Adler'],
  ['wutheringwaves', 'Wuthering Waves', 'createWutheringWaves', 'Hsin'],
 ];
 const networkBlocked = async () => { throw Error('Unexpected live request from local-only smoke test'); };
 for (const [id, expectedName, factory, characterName] of factories) {
   const client = gaming[factory]({fetchImpl:networkBlocked});
   assert.equal(typeof client.About,'function');
   assert.equal(typeof client.character,'function');
   assert.equal(typeof client.characters.list,'function');
   assert.equal(typeof client.codes.snapshot,'function');
   const game = await client.About();
   assert.equal(game.name, expectedName);
   const chars = await client.characters.list();
   assert.ok(chars.length > 0, id+' has no characters');
   const character = await client.character(characterName);
   assert.equal(character.name,characterName);
   const codeGroups = await client.codes.snapshot();
   for (const key of ['Active','Expired','Unknown'])assert.ok(Array.isArray(codeGroups[key]), id+' missing '+key);
   assert.equal(gaming.createClient(id.toUpperCase()).About instanceof Function,true);
 }
});

test('additional providers expose their optional public Enka integrations', () => {
 for (const factory of ['createHonkaiStarRail','createZenlessZoneZero','createArknightsEndfield']) {
   const client = gaming[factory]();
   assert.equal(typeof client.enka.player,'function');
 }
});

test('new provider shortcuts reject invalid options', () => {
 for (const factory of ['createHonkaiStarRail','createZenlessZoneZero','createArknightsEndfield','createNTE','createWutheringWaves']) {
  assert.throws(() => gaming[factory](null),TypeError);
  assert.throws(() => gaming[factory]([]),TypeError);
 }
});
