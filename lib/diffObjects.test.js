'use strict'

const diff = require('./diffObjects.js')
const assert = require('node:assert')
const { test } = require('node:test')

test('diff: primitive1', () => {
  const obj1 = {
    UA: false,
    KZ: false,
    TR: false
  }

  const obj2 = {
    UA: true,
    KZ: false,
    TR: false
  }

  const result = diff(obj1, obj2)
  const expected = { UA: true }
  assert.deepEqual(result, expected)
})

test('diff: primitive2', () => {
  const obj1 = {
    UA: true,
    KZ: true,
    TR: true
  }

  const obj2 = {
    UA: true,
    KZ: false,
    TR: false
  }

  const result = diff(obj1, obj2)
  const expected = { KZ: false, TR: false }
  assert.deepEqual(result, expected)
})

test('diff: with time', () => {
  const obj1 = {
    UA: true,
    KZ: true,
    TR: true
  }

  const obj2 = {
    UA: true,
    KZ: false,
    TR: false,
    time: 1
  }

  const result = diff(obj1, obj2)
  const expected = {
    KZ: false,
    TR: false,
    time: 1
  }
  assert.deepEqual(result, expected)
})

test('diff: with nested objects', () => {
  const obj1 = {
    countries: {
      UA: true,
      KZ: true,
      TR: true
    }
  }

  const obj2 = {
    countries: {
      UA: true,
      KZ: false,
      TR: false,
      time: 1
    }
  }

  const result = diff(obj1, obj2)
  const expected = {
    countries: {
      KZ: false,
      TR: false,
      time: 1
    }
  }
  assert.deepEqual(result, expected)
})

test('diff: with nested objects2', () => {
  const obj1 = {
    countries: {
      UA: true,
      KZ: true,
      TR: true
    },
    statuses: {
      new: true,
      accepted: true,
      sent: true
    }
  }

  const obj2 = {
    countries: {
      UA: true,
      KZ: false,
      TR: false,
      time: 1
    },
    statuses: {
      new: true,
      accepted: true,
      sent: true
    }
  }

  const result = diff(obj1, obj2)
  const expected = {
    countries: {
      KZ: false,
      TR: false,
      time: 1
    }
  }
  assert.deepEqual(result, expected)
})
