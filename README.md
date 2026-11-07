# @nekosuneprojects/gaming-infos

**Modular game information SDK for Node.js 18+.** The upcoming `3.0.2` release brings together **8 independent game packages** in one consistent provider registry, while keeping game-specific data, APIs and optional network requests within their own modules.

> **PR #1 release status:** This documentation describes the **draft** `3.0.2` branch. It has not been merged or published as a new `gaming-infos` release. The last PR build passed all dependency-installation, static-check, unit-test and package-validation steps.

## Supported games

| Game | Provider ID | Standalone dependency | Convenience factory | Optional live features |
| --- | --- | --- | --- | --- |
| Warframe | `warframe` | `@nekosuneprojects/warframe-api@1.0.1` | `createWarframe()` | Warframe public world-state data |
| VRChat | `vrchat` | `@nekosuneprojects/vrchat-api@1.0.0` | `createVRChat()` | Public worlds, groups and avatar search |
| Genshin Impact | `genshinimpact` | `@nekosuneprojects/genshinimpact-api@1.0.0` | `createGenshinImpact()` | Enka.Network public UID showcase |
| Honkai: Star Rail | `honkaistarrail` | `@nekosuneprojects/honkaistarrail-api@1.0.0` | `createHonkaiStarRail()` | Enka.Network public UID showcase |
| Zenless Zone Zero | `zenlesszonezero` | `@nekosuneprojects/zenlesszonezero-api@1.0.0` | `createZenlessZoneZero()` | Enka.Network public UID showcase |
| Arknights: Endfield | `arknightsendfield` | `@nekosuneprojects/arknightsendfield-api@1.0.0` | `createArknightsEndfield()` | Enka.Network public UID business card |
| Neverness to Everness | `nte` | `@nekosuneprojects/nte-api@1.0.0` | `createNTE()` | Optional GitHub JSON synchronisation |
| Wuthering Waves | `wutheringwaves` | `@nekosuneprojects/wutheringwaves-api@1.0.0` | `createWutheringWaves()` | Optional GitHub JSON synchronisation |

Each provider exposes its own methods and bundled data. **The aggregator does not copy game catalogs into a single combined JSON archive.**

## Installation

Install the consolidated package **after version 3.0.2 is released**:

```bash
npm install @nekosuneprojects/gaming-infos@3.0.2
```

For PR development, check out `feat/genshinimpact-api` and use `npm ci`. Alternatively, individual packages can be installed without `gaming-infos`:

```bash
npm install @nekosuneprojects/genshinimpact-api@1.0.0
npm install @nekosuneprojects/honkaistarrail-api@1.0.0
npm install @nekosuneprojects/zenlesszonezero-api@1.0.0
npm install @nekosuneprojects/arknightsendfield-api@1.0.0
npm install @nekosuneprojects/nte-api@1.0.0
npm install @nekosuneprojects/wutheringwaves-api@1.0.0
```

`gaming-infos` also depends on `@nekosuneprojects/warframe-api@1.0.1` and `@nekosuneprojects/vrchat-api@1.0.0`.

## Quick start: all 8 providers

```js
const gaming = require('@nekosuneprojects/gaming-infos');

console.log(gaming.listProviders());
// ['warframe', 'vrchat', 'genshinimpact', 'honkaistarrail',
//  'zenlesszonezero', 'arknightsendfield', 'nte', 'wutheringwaves']

// Game data for the 6 character-based providers:
for (const id of ['genshinimpact', 'honkaistarrail', 'zenlesszonezero',
                  'arknightsendfield', 'nte', 'wutheringwaves']) {
  const api = gaming.createClient(id);
  const game = await api.About();
  const characters = await api.characters.list();
  const codes = await api.codes.snapshot();
  console.log(game.name, characters.length, codes.Active.length);
}

// Shortcut equivalent:
const zzz = gaming.createZenlessZoneZero();
const ellen = await zzz.character('Ellen Joe');
console.log(ellen.name);
```

`createClient(game, options)` is case-insensitive for provider IDs (for example, `createClient('WARFRAME')`). Unknown game IDs raise a `RangeError`.

## Per-game examples

### Genshin Impact

```js
const { createGenshinImpact } = require('@nekosuneprojects/gaming-infos');
const genshin = createGenshinImpact();
const amber = await genshin.character('amber');
const archive = await genshin.codes.snapshot();

// Optional public Enka.Network profile, only fetched when called:
// const profile = await genshin.enka.player('123456789');
console.log(amber.name, archive.Expired.length);
```

### Honkai: Star Rail

```js
const { createHonkaiStarRail } = require('@nekosuneprojects/gaming-infos');
const hsr = createHonkaiStarRail();
const game = await hsr.About();
const characters = await hsr.characters.list();
const candidates = await hsr.codes.unknown();
// Optional: await hsr.enka.player('601499975');
console.log(game.name, characters.length, candidates.length);
```

### Zenless Zone Zero

```js
const { createZenlessZoneZero } = require('@nekosuneprojects/gaming-infos');
const zzz = createZenlessZoneZero();
const agents = await zzz.characters.list();
const codes = await zzz.codes.candidates();
// Optional: await zzz.enka.player('1300528351');
console.log(agents.length, codes.length);
```

### Arknights: Endfield

```js
const { createArknightsEndfield } = require('@nekosuneprojects/gaming-infos');
const endfield = createArknightsEndfield();
const akekuri = await endfield.character('Akekuri');
const candidateCodes = await endfield.codes.candidates();
// Optional: await endfield.enka.businessCard('6976332004');
console.log(akekuri.name, candidateCodes.length);
```

### Neverness to Everness (NTE)

```js
const { createNTE } = require('@nekosuneprojects/gaming-infos');
const nte = createNTE();
const blackbird = await nte.character('Blackbird');
const reports = await nte.codes.reported(); // Community reports, not confirmed redemptions
console.log(blackbird.name, reports.length);
```

### Wuthering Waves

```js
const { createWutheringWaves } = require('@nekosuneprojects/gaming-infos');
const wuwa = createWutheringWaves();
const hsin = await wuwa.character('Hsin');
const candidates = await wuwa.codes.candidates(); // Date-aware source statuses
console.log(hsin.name, candidates.length);
```

### Warframe

```js
const { createWarframe } = require('@nekosuneprojects/gaming-infos');
const warframe = createWarframe({ platform: 'pc', language: 'en' });
const ash = await warframe.search('Ash');
const alerts = await warframe.api.alerts(); // Live public data
console.log(ash.total, alerts.length);
```

### VRChat

```js
const { createVRChat } = require('@nekosuneprojects/gaming-infos');
const vrchat = createVRChat({ cacheDir: './storage/vrchat' });
const localWorld = await vrchat.world('theblackcat');
const worlds = await vrchat.worlds.browse({ sort: 'popular', page: 1 });
const groups = await vrchat.groups.searchOnline('Dance', { page: 1 });
const avatars = await vrchat.avatars.searchOnline('Rindo');
console.log(localWorld.name, worlds.meta, groups.meta, avatars.successful);
```

Live VRChat searches use public third-party services whose availability may vary. No private VRChat account information or login bypass is provided.

## Offline data, live API calls and code status

Character and game metadata are read from the standalone packages' local JSON by default. Each game SDK can optionally synchronise supported JSON from the `JsonData` branch of [NekoSuneProjectsNPM/game-tracker](https://github.com/NekoSuneProjectsNPM/game-tracker) using its explicit `data.sync()` and `codes.sync()` methods. Synchronisation is **not** automatic.

The bundled redemption-code groups `Active`, `Expired` and `Unknown` describe **source-record status**, not proof of successful account redemption. Codes may expire between package releases. Individual APIs provide additional filtering such as `codes.candidates()`, `codes.reported()` (NTE), and `codes.verifiedActive()` (where available). `verifiedActive()` returns an empty list in providers without genuine redemption verification.

The Genshin Impact, Honkai: Star Rail, Zenless Zone Zero and Arknights: Endfield providers support optional, read-only **Enka.Network** public UID lookups. Those lookups initiate network calls only when invoked; they do not access private inventory, authenticate into accounts or bypass hidden showcase settings. Observe third-party rate limits.

## Registry API

| Export | Description |
| --- | --- |
| `createClient(id, options)` | Create a provider by registered game ID |
| `listProviders()` | List all eight provider IDs |
| `providers` | Frozen mapping of all provider adapters |
| `createWarframe(options)` | Warframe |
| `createVRChat(options)` | VRChat |
| `createGenshinImpact(options)` | Genshin Impact |
| `createHonkaiStarRail(options)` | Honkai: Star Rail |
| `createZenlessZoneZero(options)` | Zenless Zone Zero |
| `createArknightsEndfield(options)` | Arknights: Endfield |
| `createNTE(options)` | Neverness to Everness |
| `createWutheringWaves(options)` | Wuthering Waves |

Adapter files live in `src/providers/<id>.js`, registration is in `src/registry.js`, and public exports are in `index.js`. `test/registry.test.js` exercises each adapter with local data and checks that no live network call is required for local reads.

## Migrating from 2.x

Version 3.x replaces the original monolithic API-first mirror and cached catalogs with standalone npm providers. Removed legacy functions such as `Game()`, `Characters()`, `GameCodes()`, `List()`, the old `gamecodes` convenience API, and the combined cache sync tasks are **not available** through the new registry. Switch to `createClient(game)`, then use that provider's documented methods.

## Development, CI and publishing

```bash
npm ci --ignore-scripts
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

The PR workflow validates dependencies, static syntax, provider smoke tests and packaging; the latest PR build succeeded. Pull requests **never publish**. Only after merging into `main` does `.github/workflows/build-publish.yml` attempt npmjs and GitHub Packages releases of an unpublished version; manual workflow dispatch also supports selecting a registry. Publishing to npmjs automatically requires the corresponding **npm Trusted Publisher (OIDC)** configuration, and GitHub Packages publishes under `@nekosuneprojectsnpm/gaming-infos`. Confirm all exact package versions are available and regenerate the npm lockfile with integrity hashes before release where possible.

**PR #1 remains a draft. Nothing in this README change merges or publishes the package.**

## Standalone documentation

See the per-package README files in the [game-tracker GitHub repository](https://github.com/NekoSuneProjectsNPM/game-tracker) under the corresponding `*-api` branches for full character schemas, redemption-code limitations and live API options.
