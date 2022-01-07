"use strict";

const {
  solidityKeccak256
} = require('ethers').utils;

const {
  strictParamSetSchema,
  strictCallParamsSchema
} = require('./validators');

const {
  sortObjKeys
} = require('./format');

const bytes32Regex = /^(0x)([0-9a-f]{2}){32}$/;

const isOracleId = oracleId => typeof oracleId === 'string' && bytes32Regex.test(oracleId);

const formatMap = obj => {
  const sortedObj = sortObjKeys(obj);
  return Object.entries(sortedObj);
};

const computeOracleId = async paramSet => {
  const {
    JSONPath,
    body,
    dataType,
    dataset,
    headers,
    method,
    url
  } = await strictParamSetSchema().validate(paramSet);
  const formatedHeaders = formatMap(headers);
  return solidityKeccak256(['string', 'string', 'string', 'address', 'string[][]', 'string', 'string'], [JSONPath, body, dataType, dataset, formatedHeaders, method, url]);
};

const computeCallId = async callParams => {
  const {
    body,
    headers,
    method,
    url
  } = await strictCallParamsSchema().validate(callParams);
  const formatedHeaders = formatMap(headers);
  return solidityKeccak256(['string', 'string[][]', 'string', 'string'], [body, formatedHeaders, method, url]);
};

module.exports = {
  isOracleId,
  computeOracleId,
  computeCallId
};