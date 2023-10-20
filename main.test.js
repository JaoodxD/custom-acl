'use strict'

const { test } = require('node:test')
const assert = require('node:assert')

const AclNode = require('.')

const assertNode = (node, expected) => {
  const result = node.config
  assert.deepEqual(result, expected)
}

test('acl: complex transitions', () => {
  const global = new AclNode({ name: 'global' })
  const group = new AclNode({ name: 'group' })
  const user1 = new AclNode({ name: 'user1' })
  const user2 = new AclNode({ name: 'user2' })

  global.appendChildren(group)
  group.appendChildren(user1)
  group.appendChildren(user2)

  global.update({
    countries: {
      UA: false,
      KZ: false,
      TR: false
    }
  })

  // all nodes should get same config
  {
    const expected = {
      countries: {
        UA: false,
        KZ: false,
        TR: false
      }
    }
    assertNode(global, expected)
    assertNode(group, expected)
    assertNode(user1, expected)
    assertNode(user2, expected)
  }

  group.update({
    countries: {
      UA: true,
      KZ: false,
      TR: false
    }
  })

  // both users should get UA: true
  {
    const expected = { countries: { UA: true, KZ: false, TR: false } }
    assertNode(user1, expected)
    assertNode(user2, expected)
  }

  user1.update({
    countries: {
      UA: true,
      KZ: false,
      TR: true
    }
  })

  // user1 should get TR:true
  {
    const expected = { countries: { UA: true, KZ: false, TR: true } }
    assertNode(user1, expected)
  }

  group.update({ countries: { UA: true, KZ: true, TR: false } })

  // both users should get KZ: true
  {
    let expected = { countries: { UA: true, KZ: true, TR: false } }
    assertNode(user2, expected)

    expected = { countries: { UA: true, KZ: true, TR: true } }
    assertNode(user1, expected)
  }

  group.update({ countries: { UA: true, KZ: true, TR: true } })

  // both users now should have TR: true
  {
    const expected = { countries: { UA: true, KZ: true, TR: true } }
    assertNode(user1, expected)
    assertNode(user2, expected)
  }

  group.update({ countries: { UA: true, KZ: true, TR: false } })

  // both users now should have TR: false
  {
    const expected = { countries: { UA: true, KZ: true, TR: false } }
    assertNode(user1, expected)
    assertNode(user2, expected)
  }

  global.update({ countries: { US: false } })

  // child group and both users should get US: false
  {
    const expected = { countries: { UA: true, KZ: true, TR: false, US: false } }
    assertNode(group, expected)
    assertNode(user1, expected)
    assertNode(user2, expected)
  }
})
