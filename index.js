'use strict';
const { createClient, createWarframe, createVRChat, createGenshinImpact, listProviders, providers } = require('./src/registry');

module.exports = Object.freeze({ createClient, createWarframe, createVRChat, createGenshinImpact, listProviders, providers });
