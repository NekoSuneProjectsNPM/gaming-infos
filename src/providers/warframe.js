'use strict';
const Warframe = require('@nekosuneprojects/warframe-api');
function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Warframe options must be an object');
  return Warframe(options);
}
module.exports = Object.freeze({ id: 'warframe', create });
