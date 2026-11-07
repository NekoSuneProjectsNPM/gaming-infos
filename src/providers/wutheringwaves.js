'use strict';
const Game = require('@nekosuneprojects/wutheringwaves-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Wuthering Waves options must be an object');
  }
  return Game(options);
}

module.exports = Object.freeze({ id: 'wutheringwaves', create });
