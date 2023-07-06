'use strict';

const isOrdinaryObject = (value) =>
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value !== null;

const isPrimitive = (value) =>
  ['number', 'string', 'boolean'].includes(typeof value);

const copy = (obj) => JSON.parse(JSON.stringify(obj));

module.exports = {
  isOrdinaryObject,
  isPrimitive,
  copy
};
