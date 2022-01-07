"use strict";

const {
  string,
  object,
  array,
  ValidationError
} = require('yup');

const {
  getAddress
} = require('ethers').utils;

const jp = require('jsonpath');

const {
  API_KEY_PLACEHOLDER
} = require('./conf');

const countSubstrAllowOverlap = (str, substr) => {
  if (substr.length <= 0) return str.length + 1;
  let count = 0;
  let startIndex = 0;

  while (startIndex > -1) {
    startIndex = str.indexOf(substr, startIndex);

    if (startIndex >= 0) {
      count += 1;
      startIndex += 1;
    }
  }

  return count;
};

const httpsUrlSchema = () => string().test('is-url-allow-placeholder', '${path} must be a valid url', async value => {
  try {
    const originalUrl = value || '';
    await string().url().validate(originalUrl.replace(API_KEY_PLACEHOLDER, 'API_KEY_PLACEHOLDER'));
    return true;
  } catch (e) {
    return false;
  }
}).test('is-https', '${path} is not https', value => !value || value.indexOf('https://') === 0);

const httpMethodSchema = () => string().oneOf(['GET', 'POST', 'PUT', 'DELETE']);

const bodySchema = () => string().default('');

const headerValueSchema = () => string().required();

const headersMapSchema = () => object().default({}).test('values-are-strings', '${path} is not a valid header list', async value => {
  try {
    await array().transform((_, orig) => Object.values(orig)).of(headerValueSchema()).validate(value);
    return true;
  } catch (e) {
    return false;
  }
});

const apiKeySchema = () => string();

const datasetAddressSchema = () => string().default('0x0000000000000000000000000000000000000000').test('is-address', '${path} is not a valid ethereum address', value => {
  try {
    if (value) {
      getAddress(value);
    }

    return true;
  } catch (e) {
    return false;
  }
});

const jsonPathSchema = () => string().test('is-jsonpath', '${originalValue} is not a valid JSONPath', str => {
  if (str) {
    try {
      jp.parse(str);
    } catch (e) {
      return false;
    }
  }

  return true;
});

const dataTypeSchema = () => string().oneOf(['boolean', 'number', 'string']);

const callParamsSchema = () => object({
  url: httpsUrlSchema().required(),
  method: httpMethodSchema().required(),
  headers: headersMapSchema(),
  body: bodySchema()
}).noUnknown(true);

const strictCallParamsSchema = () => object().test('is-call-params', '${originalValue} is not a valid callParams', async (obj, context) => {
  try {
    if (obj && obj.body === '') {
      await object({
        url: httpsUrlSchema().required(),
        method: httpMethodSchema().required(),
        headers: headersMapSchema().required(),
        body: bodySchema()
      }).required().strict().noUnknown(true).validate(obj);
    } else {
      await object({
        url: httpsUrlSchema().required(),
        method: httpMethodSchema().required(),
        headers: headersMapSchema().required(),
        body: bodySchema().required()
      }).required().strict().noUnknown(true).validate(obj);
    }

    return true;
  } catch (e) {
    return context.createError({
      message: e.message
    });
  }
});

const rawParamsSchema = () => callParamsSchema().shape({
  JSONPath: jsonPathSchema().required(),
  dataType: dataTypeSchema().required(),
  apiKey: apiKeySchema()
}).test('no-multiple-apikey', "Found multiple ".concat(API_KEY_PLACEHOLDER, " occurences in API call parameters, it must have at most one occurrence"), (obj, context) => {
  const {
    url,
    headers
  } = context.originalValue;
  return countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) <= 1;
}).test('apikey-provided-when-needed', "Using ".concat(API_KEY_PLACEHOLDER, " placeholder but no apiKey provided"), (obj, context) => {
  const {
    url,
    headers,
    apiKey
  } = context.originalValue;
  return !(countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) >= 1 && !apiKey);
}).test('no-unused-apikey', "Provided apiKey but no ".concat(API_KEY_PLACEHOLDER, " placeholder found in url or headers"), (obj, context) => {
  const {
    url,
    headers,
    apiKey
  } = context.originalValue;
  return !(apiKey && countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) === 0);
}).noUnknown(true);

const paramSetSchema = () => callParamsSchema().shape({
  JSONPath: jsonPathSchema().required(),
  dataType: dataTypeSchema().required(),
  dataset: datasetAddressSchema()
}).test('no-multiple-apikey', "Found multiple ".concat(API_KEY_PLACEHOLDER, " occurences in API call parameters, it must have at most one occurrence"), (obj, context) => {
  const {
    url,
    headers
  } = context.originalValue;
  return countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) <= 1;
}).test('dataset-provided-when-needed', "Using ".concat(API_KEY_PLACEHOLDER, " placeholder but no dataset provided"), (obj, context) => {
  const {
    url,
    headers,
    dataset
  } = context.originalValue;
  return !(countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) >= 1 && (!dataset || dataset === '0x0000000000000000000000000000000000000000'));
}).test('no-unused-dataset', "Provided dataset but no ".concat(API_KEY_PLACEHOLDER, " placeholder found in url or headers"), (obj, context) => {
  const {
    url,
    headers,
    dataset
  } = context.originalValue;
  return !(dataset && dataset !== '0x0000000000000000000000000000000000000000' && countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) === 0);
}).noUnknown(true);

const strictParamSetSchema = () => object().test('is-params-set', '${originalValue} is not a valid paramSet', async (obj, context) => {
  try {
    if (obj && obj.body === '') {
      await object({
        url: httpsUrlSchema().required(),
        method: httpMethodSchema().required(),
        headers: headersMapSchema().required(),
        body: bodySchema(),
        JSONPath: jsonPathSchema().required(),
        dataType: dataTypeSchema().required(),
        dataset: datasetAddressSchema().required()
      }).required().strict().noUnknown(true).validate(obj);
    } else {
      await object({
        url: httpsUrlSchema().required(),
        method: httpMethodSchema().required(),
        headers: headersMapSchema().required(),
        body: bodySchema().required(),
        JSONPath: jsonPathSchema().required(),
        dataType: dataTypeSchema().required(),
        dataset: datasetAddressSchema().required()
      }).required().strict().noUnknown(true).validate(obj);
    }

    return true;
  } catch (e) {
    return context.createError({
      message: e.message
    });
  }
}).test('no-multiple-apikey', "Found multiple ".concat(API_KEY_PLACEHOLDER, " occurences in API call parameters, it must have at most one occurrence"), (obj, context) => {
  const {
    url,
    headers
  } = context.originalValue;
  return countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) <= 1;
}).test('dataset-provided-when-needed', "Using ".concat(API_KEY_PLACEHOLDER, " placeholder but no dataset provided"), (obj, context) => {
  const {
    url,
    headers,
    dataset
  } = context.originalValue;
  return !(countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) >= 1 && (!dataset || dataset === '0x0000000000000000000000000000000000000000'));
}).test('no-unused-dataset', "Provided dataset but no ".concat(API_KEY_PLACEHOLDER, " placeholder found in url or headers"), (obj, context) => {
  const {
    url,
    headers,
    dataset
  } = context.originalValue;
  return !(dataset && dataset !== '0x0000000000000000000000000000000000000000' && countSubstrAllowOverlap(JSON.stringify({
    url,
    headers
  }), API_KEY_PLACEHOLDER) === 0);
});

const jsonParamSetSchema = () => string().strict().required().test('is-json', '${originalValue} is not a valid JSON', value => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}).test('is-params-set', '${originalValue} is not a valid paramSet', async (value, context) => {
  try {
    const obj = JSON.parse(value);
    await strictParamSetSchema().validate(obj);
    return true;
  } catch (e) {
    return context.createError({
      message: "".concat(context.originalValue, " is not a valid paramSet (").concat(e.message, ")")
    });
  }
});

const readDataTypeSchema = () => string().oneOf(['boolean', 'number', 'string', 'raw'], 'dataType read option must be one of the following values: ${values}').required();

const throwIfMissing = () => {
  throw new ValidationError('Missing parameter');
};

module.exports = {
  callParamsSchema,
  rawParamsSchema,
  paramSetSchema,
  strictCallParamsSchema,
  strictParamSetSchema,
  jsonParamSetSchema,
  readDataTypeSchema,
  throwIfMissing
};