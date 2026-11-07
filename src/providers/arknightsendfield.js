'use strict';
const Game = require('@nekosuneprojects/arknightsendfield-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Arknights: Endfield options must be an object');
  }
  return Game(options);
}

module.exports = Object.freeze({ id: 'arknightsendfield', create });
