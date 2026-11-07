'use strict';
const warframe = require('./providers/warframe');
const vrchat = require('./providers/vrchat');
const genshinimpact = require('./providers/genshinimpact');

const providers = Object.freeze({ warframe, vrchat, genshinimpact });

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

module.exports = { createClient, createWarframe, createVRChat, createGenshinImpact, listProviders, providers };
