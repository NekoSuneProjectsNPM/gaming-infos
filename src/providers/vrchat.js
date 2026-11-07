'use strict';
const VRChat = require('@nekosuneprojects/vrchat-api');

function create(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('VRChat options must be an object');
  }
  return VRChat(options);
}

module.exports = Object.freeze({ id: 'vrchat', create });
