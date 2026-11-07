'use strict';
const warframe = require('./providers/warframe');
const vrchat = require('./providers/vrchat');
const genshinimpact = require('./providers/genshinimpact');
const honkaistarrail = require('./providers/honkaistarrail');
const zenlesszonezero = require('./providers/zenlesszonezero');
const arknightsendfield = require('./providers/arknightsendfield');
const nte = require('./providers/nte');
const wutheringwaves = require('./providers/wutheringwaves');

const providers = Object.freeze({ warframe, vrchat, genshinimpact, honkaistarrail, zenlesszonezero, arknightsendfield, nte, wutheringwaves });

function listProviders() { return Object.keys(providers); }

function createClient(game, options = {}) {
  if (typeof game !== 'string' || !game.trim()) {
    throw new TypeError('Game must be a non-empty string');
  }
  const key = game.trim().toLowerCase();
  if (!Object.hasOwn(providers, key)) {
    throw new RangeError(`Game provider not installed: ${game}`);
  }
  return providers[key].create(options);
}

function createWarframe(options = {}) { return createClient('warframe', options); }
function createVRChat(options = {}) { return createClient('vrchat', options); }
function createGenshinImpact(options = {}) { return createClient('genshinimpact', options); }
function createHonkaiStarRail(options = {}) { return createClient('honkaistarrail', options); }
function createZenlessZoneZero(options = {}) { return createClient('zenlesszonezero', options); }
function createArknightsEndfield(options = {}) { return createClient('arknightsendfield', options); }
function createNTE(options = {}) { return createClient('nte', options); }
function createWutheringWaves(options = {}) { return createClient('wutheringwaves', options); }

module.exports = { createClient, createWarframe, createVRChat, createGenshinImpact, createHonkaiStarRail, createZenlessZoneZero, createArknightsEndfield, createNTE, createWutheringWaves, listProviders, providers };
