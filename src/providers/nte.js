'use strict';
const Game = require('@nekosuneprojects/nte-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Neverness to Everness options must be an object');
  }
  return Game(options);
}

module.exports = Object.freeze({ id: 'nte', create });
