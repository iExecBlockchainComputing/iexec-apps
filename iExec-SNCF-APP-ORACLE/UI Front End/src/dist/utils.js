"use strict";

const {
  getSignerFromPrivateKey
} = require('iexec').utils;

const {
  getParamSet
} = require('./oracle');

const hashComputeOracleId = require('./hash').computeOracleId;

const callTesterTestRawParams = require('./callTester').testRawParams;

const {
  getDefaults,
  DEFAULT_IPFS_GATEWAY
} = require('./conf');

const computeOracleId = async function (paramSetOrCid) {
  let {
    ipfsGateway = DEFAULT_IPFS_GATEWAY
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    paramSet
  } = await getParamSet({
    paramSetOrCid,
    ipfsGateway
  });
  const oracleId = await hashComputeOracleId(paramSet);
  return oracleId;
};

module.exports = {
  computeOracleId,
  testRawParams: callTesterTestRawParams,
  getSignerFromPrivateKey,
  getChainDefaults: getDefaults
};