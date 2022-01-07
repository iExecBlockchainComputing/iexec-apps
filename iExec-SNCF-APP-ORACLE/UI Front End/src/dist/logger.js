"use strict";

const Debug = require('debug');

const debug = Debug('iexec-oracle-factory-wrapper');

const getLogger = namespace => debug.extend(namespace);

module.exports = {
  getLogger
};