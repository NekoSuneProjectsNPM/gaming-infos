'use strict';
const GenshinImpact = require('@nekosuneprojects/genshinimpact-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Genshin Impact options must be an object');
  }
  return GenshinImpact(options);
}

module.exports = Object.freeze({ id: 'genshinimpact', create });
