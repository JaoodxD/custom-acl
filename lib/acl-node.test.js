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
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })

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
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })

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
  const head = new ACLNode({ config: { countries: {} }, name: 'head' })
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
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
  const group = new ACLNode({ config: {}, name: 'group' })
  const user = new ACLNode({ config: {}, name: 'user' })
  head.appendChildren(group)
  group.appendChildren(user)
  head.update({
    countries: {
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const result = user.config
  const expected = {
    countries: {
      KZ: true
    },
    statuses: {
      new: true
    }
  }

  assert.deepEqual(result, expected)
})

test('acl: chain of children with children#2', () => {
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
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

test('acl: onUpdate hook fires', () => {
  let updateCount = 0
  const onUpdate = () => updateCount++
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head',
    onUpdate
  })
  head.update({
    countries: {
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const expectedUpdates = 1

  assert.deepEqual(updateCount, expectedUpdates)
})

test('acl: onUpdate hook propagates on children', () => {
  let updateCount = 0
  const onUpdate = () => updateCount++
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head',
    onUpdate
  })
  const group = new ACLNode({ config: {}, name: 'group', onUpdate })
  const user = new ACLNode({ config: {}, name: 'user', onUpdate })
  head.appendChildren(group)
  group.appendChildren(user)
  head.update({
    countries: {
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const expected = 3

  assert.deepEqual(updateCount, expected)
})

test('acl: onUpdate hook fires only when set', () => {
  let updateCount = 0
  const onUpdate = () => updateCount++
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head',
    onUpdate
  })
  const group = new ACLNode({ config: {}, name: 'group' })
  const user = new ACLNode({ config: {}, name: 'user', onUpdate })
  head.appendChildren(group)
  group.appendChildren(user)
  head.update({
    countries: {
      KZ: true
    },
    statuses: {
      new: true
    }
  })

  const expected = 2

  assert.deepEqual(updateCount, expected)
})

test('acl: color become blue when group has more privilegies than head', () => {
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
  const group = new ACLNode({ config: {}, name: 'group' })
  head.appendChildren(group)
  group.update({
    countries: {
      KZ: true
    }
  })

  const actual = group.dotColor
  const expected = 'blue'

  assert.deepEqual(actual, expected)
})

test('acl: color become red when group has less privilegies than head', () => {
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
  const group = new ACLNode({ config: {}, name: 'group' })
  head.appendChildren(group)
  group.update({
    countries: {
      UA: false
    }
  })

  const actual = group.dotColor
  const expected = 'red'

  assert.deepEqual(actual, expected)
})

test('acl: head and group should have empty color on head update', () => {
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
  const group = new ACLNode({ config: {}, name: 'group' })
  head.appendChildren(group)
  head.update({
    countries: {
      UA: false
    }
  })

  const actual = group.dotColor
  const expected = ''

  assert.deepEqual(actual, expected)
})

test('acl: child node should get color on parent appending', () => {
  const head = new ACLNode({
    config: { countries: { UA: true } },
    name: 'head'
  })
  const group = new ACLNode({ config: { UA: false }, name: 'group' })
  head.appendChildren(group)

  const actual = group.dotColor
  const expected = 'red'

  assert.deepEqual(actual, expected)
})
