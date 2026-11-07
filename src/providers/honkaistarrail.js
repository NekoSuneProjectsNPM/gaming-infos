'use strict';
const Game = require('@nekosuneprojects/honkaistarrail-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Honkai: Star Rail options must be an object');
  }
  return Game(options);
}

module.exports = Object.freeze({ id: 'honkaistarrail', create });
