"use strict";

const fetch = require('cross-fetch');

const jp = require('jsonpath');

const {
  rawParamsSchema
} = require('./validators');

const {
  API_KEY_PLACEHOLDER
} = require('./conf');

const testRawParams = async rawParams => {
  const {
    url,
    method,
    headers,
    body,
    apiKey,
    JSONPath,
    dataType
  } = await rawParamsSchema().validate(rawParams);
  const finalUrl = url.replace(API_KEY_PLACEHOLDER, apiKey);
  const finalHeaders = Object.entries(headers).map(_ref => {
    let [k, v] = _ref;
    return [k, v.replace(API_KEY_PLACEHOLDER, apiKey)];
  }).reduce((acc, curr) => ({ ...acc,
    [curr[0]]: curr[1]
  }), {});
  const res = await fetch(finalUrl, {
    method,
    ...{
      headers: finalHeaders
    },
    ...(body && {
      body
    })
  }).catch(e => {
    throw Error("Failed get a response from the API (".concat(e, ")\nYou can:\n- check your connection\n- check the API url\n- check the HTTP method\n- check the API allows CORS"));
  });
  const defaultMessage = "The API answered with status ".concat(res.status).concat(res.statusText ? ": ".concat(res.statusText) : '');
  const json = await res.json().catch(() => {
    throw Error("".concat(defaultMessage, " but the response body format is not supported, it must be a JSON"));
  });
  const jsonPathResult = jp.query(json, JSONPath);

  if (jsonPathResult.length === 0) {
    throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned empty result, it must return a single value:\n").concat(JSON.stringify(jsonPathResult, null, 2)));
  }

  if (jsonPathResult.length > 1) {
    throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned multiple results, it must return a single value:\n").concat(JSON.stringify(jsonPathResult, null, 2)));
  }

  const selected = jsonPathResult[0];
  const typeofSelected = typeof selected;

  switch (typeofSelected) {
    case 'boolean':
      if (dataType !== 'boolean') {
        throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned a ").concat(typeofSelected, ", wich is NOT compatible with `dataType: \"").concat(dataType, "\"`,  use `dataType: \"boolean\"` to store ").concat(typeofSelected));
      }

      return selected;

    case 'string':
      if (dataType !== 'string') {
        throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned a ").concat(typeofSelected, ", wich is NOT compatible with `dataType: \"").concat(dataType, "\"`,  use `dataType: \"string\"` to store ").concat(typeofSelected));
      }

      return selected;

    case 'number':
      if (dataType !== 'number') {
        throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned a ").concat(typeofSelected, ", wich is NOT compatible with `dataType: \"").concat(dataType, "\"`,  use `dataType: \"number\"` to store ").concat(typeofSelected));
      }

      return selected;

    default:
      throw Error("".concat(defaultMessage, " but JSONPath selector \"").concat(JSONPath, "\" returned a ").concat(typeofSelected, ", it must be string, number or boolean:\n").concat(JSON.stringify(selected, null, 2)));
  }
};

module.exports = {
  testRawParams
};