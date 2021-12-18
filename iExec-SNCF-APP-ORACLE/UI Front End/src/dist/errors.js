"use strict";

const {
  ValidationError
} = require('yup');

class WorkflowError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
  }

}

class NoValueError extends Error {}

module.exports = {
  ValidationError,
  WorkflowError,
  NoValueError
};