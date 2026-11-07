# @nekosuneprojects/gaming-infos

Modular multi-game information toolkit for Node.js. **Version 3.0.0 is a clean-break rebuild** of the old monolithic data-mirror package. The previous embedded datasets, API cache syncs and legacy add-on implementation have been removed.

This initial rebuild includes **Warframe only**, implemented using the independently published `@nekosuneprojects/warframe-api@1.0.1`. More game providers can be added as separate modules later.

## Installation

```bash
npm install @nekosuneprojects/gaming-infos
```

To install the Warframe dependency directly instead:

```bash
npm install @nekosuneprojects/warframe-api@1.0.1
```

Node.js 18+ required. No npm publish happens automatically on ordinary pushes.

## Quick start

```js
const gaming = require('@nekosuneprojects/gaming-infos');

// Each game is a standalone adapter; no global data mirroring.
const warframe = gaming.createClient('warframe', { platform: 'pc', language: 'en' });
const about = await warframe.About(); // bundled metadata
const matches = await warframe.search('Ash'); // local JSON search
const codes = await warframe.codes.active({ hasCode: true }); // bundled codes
const alerts = await warframe.api.alerts(); // live community API
console.log(about.name, matches.total, codes.length, alerts.length);
```

Or use the standalone provider directly:

```js
const { createWarframe, listProviders } = require('@nekosuneprojects/gaming-infos');
const wf = createWarframe({ platform: 'pc' });
console.log(listProviders()); // ['warframe']
const ash = await wf.character('ash');
```

## Module layout

- `index.js` — public entrypoint
- `src/registry.js` — game provider selection and validation
- `src/providers/warframe.js` — Warframe adapter (delegates to npm dependency)
- `test/` — package smoke tests
- `.github/workflows/npm-publish.yml` — npmjs release publishing
- `.github/workflows/npm-publish-github-packages.yml` — GitHub Packages release publishing

## API surface

| Export | Purpose |
| --- | --- |
| `createClient(game, options)` | Instantiate an installed game provider |
| `createWarframe(options)` | Shortcut for the Warframe provider |
| `listProviders()` | List available game IDs |
| `providers.warframe` | Warframe provider module |

The Warframe instance exposes the independent package's documented `About`, `search`, `character`, `codes`, `data`, `wfcd`, and `api` namespaces. See [Warframe API](https://www.npmjs.com/package/@nekosuneprojects/warframe-api) for full endpoint details.

## Migration from 2.x

The 2.x `gaming-infos` API-first caches, embedded JSON catalogs, `gamecodes`, and sync scripts are **not available** in 3.0.0. Applications using these need to migrate explicitly. This package is intentionally not backward-compatible. Old releases remain accessible through Git history and npm.

## Publishing

Publish only after reviewing the code and updating `package.json` and `package-lock.json`. The release-triggered workflows require repository/registry permissions. The npmjs workflow uses `npm_token` unless configured for trusted OIDC in npm settings. GitHub Packages publishes with a temporary `@nekosuneprojectsnpm/gaming-infos` scope matching the repository owner. A release must correspond to the exact package version; version 3.0.0 is **source only** until explicitly published.
