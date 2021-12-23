"use strict";

const Big = require('big.js');

const sortObjKeys = obj => Object.keys(obj).sort().reduce((acc, curr) => {
  if (typeof obj[curr] === 'object') {
    acc[curr] = sortObjKeys(obj[curr]);
  } else {
    acc[curr] = obj[curr];
  }

  return acc;
}, {});

const formatParamsJson = obj => JSON.stringify(sortObjKeys(obj));

const formatOracleGetInt = resultBn => {
  const resultBig = new Big(resultBn.toString()).times(new Big('1e-18'));

  try {
    resultBig.constructor.strict = true;
    const resultNumber = resultBig.toNumber();
    return resultNumber;
  } catch (e) {
    throw Error("Converting ".concat(resultBig.toString(), " to number will result in loosing precision"));
  }
};

module.exports = {
  sortObjKeys,
  formatParamsJson,
  formatOracleGetInt
};