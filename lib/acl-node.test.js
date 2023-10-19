'use strict'

const { test } = require('node:test')
const assert = require('node:assert')

const ACLNode = require('./acl-node.js')

test('acl: primitive2', () => {
  const head = new ACLNode({ config: { UA: true }, name: 'head' })

  head.update({
    UA: true,
    KZ: true
  })

  const result = head.config
  const expected = {
    UA: true,
    KZ: true
  }

  assert.deepEqual(result, expected)
})

test('acl: nested object', () => {
  const head = new ACLNode({ config: { countries: { UA: true } }, name: 'head' })

  head.update({
    countries: {
      UA: true,
      KZ: true
    }
  })

  const result = head.config
  const expected = {
    countries: {
      UA: true,
      KZ: true
    }
  }

  assert.deepEqual(result, expected)
})

test('acl: nested object2', () => {
  const head = new ACLNode({ config: { countries: { UA: true } }, name: 'head' })

  head.update({
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const result = head.config
  const expected = {
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  }

  assert.deepEqual(result, expected)
})

test('acl: chain of 1 child', () => {
  const head = new ACLNode({ config: { countries: { UA: true } }, name: 'head' })
  const group = new ACLNode({ config: {}, name: 'group' })
  head.appendChildren(group)

  head.update({
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const result = group.config
  const expected = {
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  }

  assert.deepEqual(result, expected)
})

test('acl: chain of children with children', () => {
  const head = new ACLNode({ config: { countries: { UA: true } }, name: 'head' })
  const group = new ACLNode({ config: {}, name: 'group' })
  const user = new ACLNode({ config: {}, name: 'user' })
  head.appendChildren(group)
  group.appendChildren(user)
  head.update({
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const result = user.config
  const expected = {
    countries: {
      UA: true,
      KZ: true
    },
    statuses: {
      new: true
    }
  }

  assert.deepEqual(result, expected)
})

test('acl: chain of children with children#2', () => {
  const head = new ACLNode({ config: { countries: { UA: true } }, name: 'head' })
  const group = new ACLNode({ config: {}, name: 'group' })
  const user = new ACLNode({ config: {}, name: 'user' })
  head.appendChildren(group)
  group.appendChildren(user)
  group.update({
    countries: {
      UA: true,
      KZ: true
    }
  })

  {
    const result = head.config
    const expected = {
      countries: { UA: true }
    }
    assert.deepEqual(result, expected)
  }

  {
    const result = user.config
    const expected = {
      countries: {
        UA: true,
        KZ: true
      }
    }
    assert.deepEqual(result, expected)
  }
})
