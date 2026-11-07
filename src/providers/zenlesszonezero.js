'use strict';
const Game = require('@nekosuneprojects/zenlesszonezero-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Zenless Zone Zero options must be an object');
  }
  return Game(options);
}

module.exports = Object.freeze({ id: 'zenlesszonezero', create });
