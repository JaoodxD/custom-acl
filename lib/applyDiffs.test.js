'use strict';

const apply = require('./applyDiffs.js');
const { test } = require('node:test');
const assert = require('node:assert');

test('apply: primitive', () => {
  const obj = {
    UA: true,
    KZ: true,
    TR: false
  };

  const diff = {
    TR: true,
    KZ: false
  };

  apply(obj, diff);
  const result = obj;
  const expected = {
    UA: true,
    KZ: false,
    TR: true
  };

  assert.deepEqual(result, expected);
});

test('apply: nested objects', () => {
  const obj = {
    countries: {
      UA: true,
      KZ: true,
      TR: false
    }
  };

  const diff = {
    countries: {
      TR: true,
      KZ: false
    }
  };

  apply(obj, diff);
  const result = obj;
  const expected = {
    countries: {
      UA: true,
      KZ: false,
      TR: true
    }
  };

  assert.deepEqual(result, expected);
});
