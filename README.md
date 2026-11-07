# @nekosuneprojects/gaming-infos

Modular multi-game information toolkit for Node.js 18+. **Version 3.0.2 continues the clean-break 3.x rebuild** of the old monolithic data-mirror package, using independent npm packages for each game. The previous embedded datasets, API cache syncs and legacy add-on implementation have been removed.

The rebuilt package now includes **eight standalone providers** (Warframe, VRChat, Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, Arknights: Endfield, Neverness to Everness and Wuthering Waves), backed by `@nekosuneprojects/warframe-api@1.0.1` and `@nekosuneprojects/vrchat-api@1.0.0`, plus six exact `@nekosuneprojects/*-api@1.0.0` game dependencies. Additional games can be added later without reintroducing the old monolithic cache.

## Installation

```bash
npm install @nekosuneprojects/gaming-infos
```

To use an individual game package directly:

```bash
npm install @nekosuneprojects/warframe-api@1.0.1
npm install @nekosuneprojects/vrchat-api@1.0.0
npm install @nekosuneprojects/genshinimpact-api@1.0.0
npm install @nekosuneprojects/honkaistarrail-api@1.0.0
npm install @nekosuneprojects/zenlesszonezero-api@1.0.0
npm install @nekosuneprojects/arknightsendfield-api@1.0.0
npm install @nekosuneprojects/nte-api@1.0.0
npm install @nekosuneprojects/wutheringwaves-api@1.0.0
```

Node.js 18+ is required. Pushes to `main` run build/tests and attempt to publish the package to npmjs and GitHub Packages when the exact version is not already available. Pull requests build/test only.

## Warframe

```js
const gaming = require('@nekosuneprojects/gaming-infos');

const warframe = gaming.createClient('warframe', { platform: 'pc', language: 'en' });
const about = await warframe.About(); 
const matches = await warframe.search('Ash');
const codes = await warframe.codes.active({ hasCode: true });
const alerts = await warframe.api.alerts();
console.log(about.name, matches.total, codes.length, alerts.length);
```

## VRChat

```js
const gaming = require('@nekosuneprojects/gaming-infos');

// Local-first bundled VRChat JSON, no VRChat login needed:
const vrchat = gaming.createClient('vrchat', {
  cacheDir: './storage/vrchat'
});
const game = await vrchat.About();
const localWorld = await vrchat.world('theblackcat');
const localGroups = await vrchat.groups.search('club');

// Live online NekoSune APIs:
const worlds = await vrchat.worlds.browse({sort:'popular',page:1});
const foundWorlds = await vrchat.worlds.searchOnline('Mirror',{platform:'pc'});
const groups = await vrchat.groups.searchOnline('Dance',{page:1});

// Public third-party avatar-search providers (availability varies):
const avatars = await vrchat.avatars.searchOnline('Rindo');

console.log(game.name, localWorld.name, localGroups.total);
console.log(worlds.meta, foundWorlds.meta, groups.meta, avatars.successful);
```

The `vrchat-api` provider bundles local JSON for worlds, groups, players and game metadata; online methods make on-demand HTTP calls. It does **not** fetch private VRChat account data or bypass authentication. The upstream JSON currently contains no local avatar catalog, so `avatars.searchOnline` uses external providers.

### World browsing

The online world browser supports `updated`, `newest`, `oldest` and `popular`, using the remote API's 24-world pagination:

```js
const { createVRChat } = require('@nekosuneprojects/gaming-infos');
const vrchat = createVRChat();
const page2 = await vrchat.worlds.browse({sort:'updated',page:2});
console.log(page2.data, page2.meta);
```

## Genshin Impact

The Genshin provider is an adapter for the standalone `@nekosuneprojects/genshinimpact-api@1.0.0` package. It keeps local JSON and redemption-code data separate from optional live Enka.Network requests.

```js
const gaming = require('@nekosuneprojects/gaming-infos');
const gi = gaming.createGenshinImpact();

// All of these work from bundled local JSON:
const about = await gi.About();
const amber = await gi.character('amber');
const characters = await gi.characters.list();
const archivedCodes = await gi.codes.snapshot();
const unknownCodes = await gi.codes.unknown();
console.log(about.name, amber.name, characters.length, archivedCodes.Expired.length);

// Optional Enka.Network UID showcase (live request only when called):
const uid = '123456789'; // Replace with a real UID
const profile = await gi.enka.player(uid);
console.log(profile.playerInfo.nickname);
```

Use `gaming.createClient('genshinimpact')` as an equivalent way to create a client. The local code archive has historical `Active`, `Expired` and `Unknown` categories; these are not real-time redemption guarantees. Enka is a third-party public profile service and obeys its rate limits. See [Genshin Impact API](https://www.npmjs.com/package/@nekosuneprojects/genshinimpact-api) for the standalone documentation.

## New standalone game providers

All providers are separate npm dependencies, not data mirrors copied into `gaming-infos`. Normal local character/game/code reads use their bundled JSON. The optional Enka.Network provider makes live requests only when explicitly invoked.

| Provider | Standalone exact dependency | Factory | Character catalog | Optional Enka |
| --- | --- | --- | --- | --- |
| Genshin Impact | `@nekosuneprojects/genshinimpact-api@1.0.0` | `createGenshinImpact()` | Characters | Genshin public UID |
| Honkai: Star Rail | `@nekosuneprojects/honkaistarrail-api@1.0.0` | `createHonkaiStarRail()` | Characters | Public UID |
| Zenless Zone Zero | `@nekosuneprojects/zenlesszonezero-api@1.0.0` | `createZenlessZoneZero()` | Agents | Public UID |
| Arknights: Endfield | `@nekosuneprojects/arknightsendfield-api@1.0.0` | `createArknightsEndfield()` | Operators | Public UID |
| Neverness to Everness | `@nekosuneprojects/nte-api@1.0.0` | `createNTE()` | Characters | — |
| Wuthering Waves | `@nekosuneprojects/wutheringwaves-api@1.0.0` | `createWutheringWaves()` | Resonators | — |

```js
const gaming = require('@nekosuneprojects/gaming-infos');

// Identical createClient() API for every game:
for (const id of ['genshinimpact', 'honkaistarrail', 'zenlesszonezero',
                  'arknightsendfield', 'nte', 'wutheringwaves']) {
  const game = gaming.createClient(id);
  console.log((await game.About()).name, (await game.characters.list()).length);
  console.log((await game.codes.snapshot()).Active.length);
}

// Optional public Enka.Network UID (not accessed unless called):
const starRail = gaming.createHonkaiStarRail();
const zzz = gaming.createZenlessZoneZero();
const endfield = gaming.createArknightsEndfield();
console.log(typeof starRail.enka.player, typeof zzz.enka.player, typeof endfield.enka.player);
```

**Code status note:** `Active` in a bundled code snapshot is a historical or community-reported label, not proof that redemption currently succeeds. Use each provider's `codes.candidates()` or `codes.verifiedActive()` as documented, and check date-limited codes carefully.

## Module layout

- `index.js` — public entrypoint
- `src/registry.js` — provider registry and selection
- `src/providers/warframe.js` — Warframe npm adapter
- `src/providers/vrchat.js` — VRChat npm adapter
- `src/providers/genshinimpact.js` — Genshin Impact npm adapter
- `src/providers/honkaistarrail.js` — Honkai: Star Rail npm adapter
- `src/providers/zenlesszonezero.js` — Zenless Zone Zero npm adapter
- `src/providers/arknightsendfield.js` — Arknights: Endfield npm adapter
- `src/providers/nte.js` — Neverness to Everness npm adapter
- `src/providers/wutheringwaves.js` — Wuthering Waves npm adapter
- `test/registry.test.js` — provider smoke tests
- `.github/workflows/build-publish.yml` — CI checks and publishing after merges to main

## API surface

| Export | Purpose |
| --- | --- |
| `createClient(game, options)` | Instantiate the game provider |
| `createWarframe(options)` | Shortcut to the Warframe provider |
| `createVRChat(options)` | Shortcut to the VRChat provider |
| `createGenshinImpact(options)` | Shortcut to the Genshin Impact provider |
| `createHonkaiStarRail(options)` | Shortcut to the Honkai: Star Rail provider |
| `createZenlessZoneZero(options)` | Shortcut to the Zenless Zone Zero provider |
| `createArknightsEndfield(options)` | Shortcut to the Arknights: Endfield provider |
| `createNTE(options)` | Shortcut to the Neverness to Everness provider |
| `createWutheringWaves(options)` | Shortcut to the Wuthering Waves provider |
| `listProviders()` | List installed game IDs |
| `providers.warframe` | Warframe provider adapter |
| `providers.vrchat` | VRChat provider adapter |
| `providers.genshinimpact` | Genshin Impact provider adapter |
| `providers.honkaistarrail` | Honkai: Star Rail provider adapter |
| `providers.zenlesszonezero` | Zenless Zone Zero provider adapter |
| `providers.arknightsendfield` | Arknights: Endfield provider adapter |
| `providers.nte` | Neverness to Everness provider adapter |
| `providers.wutheringwaves` | Wuthering Waves provider adapter |

Read the standalone packages' documentation for complete features: [Warframe API](https://www.npmjs.com/package/@nekosuneprojects/warframe-api) [VRChat API](https://www.npmjs.com/package/@nekosuneprojects/vrchat-api), and [Genshin Impact API](https://www.npmjs.com/package/@nekosuneprojects/genshinimpact-api).

## Migration from 2.x

The 2.x `gaming-infos` API-first caches, embedded JSON catalogs, `gamecodes`, and sync scripts are **not available** in 3.0.0. Previous consumers must migrate explicitly. Old releases remain accessible through Git history and npm.

## Publishing

This PR prepares source version `3.0.2`. Creating this branch and pull request does not publish it; after review and merge into `main`, the configured build workflow attempts publication only if the exact version has not already been published. Before publishing, confirm all eight exact dependency versions exist on npmjs.org, run `npm ci`, `npm run check`, `npm test`, and `npm pack --dry-run`. The consolidated `Build and publish gaming-infos` workflow builds/tests on every `main` push and pull request. After a successful build on `main`, it also attempts **both** registry publications, skipping any version already published. The manual **Run workflow** action still supports `registry=both`, `npmjs`, or `github`. On automatic pushes, npmjs uses **Trusted Publisher OIDC only**, not the existing `npm_token` (which caused EOTP). Configure npm's Trusted Publisher for the exact `NekoSuneProjectsNPM/gaming-infos` repository and `build-publish.yml` workflow, and enable direct `npm publish`. Manual dispatch still permits a token if it is eligible to publish without an interactive OTP (which must be configured for repository `NekoSuneProjectsNPM/gaming-infos`, workflow `build-publish.yml`). Manual dispatch uses the selected `npm_auth` setting. GitHub Packages publishes as `@nekosuneprojectsnpm/gaming-infos`. Each new npm release still requires incrementing the package version in both package files.
