# @nekosuneprojects/gaming-infos

Modular multi-game information toolkit for Node.js 18+. **Version 3.0.1 continues the clean-break 3.x rebuild** of the old monolithic data-mirror package, using independent npm packages for each game. The previous embedded datasets, API cache syncs and legacy add-on implementation have been removed.

The rebuilt package now includes **Warframe and VRChat**, backed by `@nekosuneprojects/warframe-api@1.0.1` and `@nekosuneprojects/vrchat-api@1.0.0` respectively. Additional games can be added later without reintroducing the old monolithic cache.

## Installation

```bash
npm install @nekosuneprojects/gaming-infos
```

To use an individual game package directly:

```bash
npm install @nekosuneprojects/warframe-api@1.0.1
npm install @nekosuneprojects/vrchat-api@1.0.0
```

Node.js 18+ is required. Ordinary pushes do not publish npm releases.

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

## Module layout

- `index.js` — public entrypoint
- `src/registry.js` — provider registry and selection
- `src/providers/warframe.js` — Warframe npm adapter
- `src/providers/vrchat.js` — VRChat npm adapter
- `test/registry.test.js` — provider smoke tests
- `.github/workflows/npm-publish.yml` — npmjs release publishing
- `.github/workflows/npm-publish-github-packages.yml` — GitHub Packages release publishing

## API surface

| Export | Purpose |
| --- | --- |
| `createClient(game, options)` | Instantiate the game provider |
| `createWarframe(options)` | Shortcut to the Warframe provider |
| `createVRChat(options)` | Shortcut to the VRChat provider |
| `listProviders()` | List installed game IDs |
| `providers.warframe` | Warframe provider adapter |
| `providers.vrchat` | VRChat provider adapter |

Read the standalone packages' documentation for complete features: [Warframe API](https://www.npmjs.com/package/@nekosuneprojects/warframe-api) and [VRChat API](https://www.npmjs.com/package/@nekosuneprojects/vrchat-api).

## Migration from 2.x

The 2.x `gaming-infos` API-first caches, embedded JSON catalogs, `gamecodes`, and sync scripts are **not available** in 3.0.0. Previous consumers must migrate explicitly. Old releases remain accessible through Git history and npm.

## Publishing

The source version is `3.0.1`; package publication is manual through GitHub Actions. Before publishing, confirm both exact dependency versions exist on npmjs.org, run `npm ci`, `npm run check`, `npm test`, and `npm pack --dry-run`. The consolidated `Build and publish gaming-infos` workflow runs build/tests on main pushes and pull requests. To publish, use **Run workflow** on `main` and select `registry=both`, `npmjs`, or `github`. For npmjs select `npm_auth=token` (requires secret `npm_token`) or `npm_auth=trusted` (requires a Trusted Publisher configured for repository `NekoSuneProjectsNPM/gaming-infos`, workflow `build-publish.yml`). Publishing is never triggered by an ordinary push. GitHub Packages uses the `@nekosuneprojectsnpm/gaming-infos` scope.
