'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const ACLNode = require('./lib/acl-node.js');
const diff = require('./lib/diffObjects.js');
const merge = require('./lib/applyDiffs.js');

const assertNode = (node, expected) => {
  const result = node.config;
  assert.deepEqual(result, expected);
};

test('acl: complex transitions', () => {
  const global = new ACLNode({ name: 'global', diff, merge });
  const group = new ACLNode({ name: 'group', diff, merge });
  const user1 = new ACLNode({ name: 'user1', diff, merge });
  const user2 = new ACLNode({ name: 'user2', diff, merge });

  global.appendChildren(group);
  group.appendChildren(user1);
  group.appendChildren(user2);

  global.update({
    countries: {
      UA: false,
      KZ: false,
      TR: false
    }
  });

  // all nodes should get same config
  {
    const expected = {
      countries: {
        UA: false,
        KZ: false,
        TR: false
      }
    };
    assertNode(global, expected);
    assertNode(group, expected);
    assertNode(user1, expected);
    assertNode(user2, expected);
  }

  group.update({
    countries: {
      UA: true,
      KZ: false,
      TR: false
    }
  });

  // both users should get UA: true
  {
    const expected = { countries: { UA: true, KZ: false, TR: false } };
    assertNode(user1, expected);
    assertNode(user2, expected);
  }

  user1.update({
    countries: {
      UA: true,
      KZ: false,
      TR: true
    }
  });

  // user1 should get TR:true
  {
    const expected = { countries: { UA: true, KZ: false, TR: true } };
    assertNode(user1, expected);
  }

  group.update({ countries: { UA: true, KZ: true, TR: false } });

  // both users should get KZ: true
  {
    let expected = { countries: { UA: true, KZ: true, TR: false } };
    assertNode(user2, expected);

    expected = { countries: { UA: true, KZ: true, TR: true } };
    assertNode(user1, expected);
  }

  group.update({ countries: { UA: true, KZ: true, TR: true } });

  // both users now should have TR: true
  {
    let expected = { countries: { UA: true, KZ: true, TR: true } };
    assertNode(user1, expected);
    assertNode(user2, expected);
  }

  group.update({ countries: { UA: true, KZ: true, TR: false } });

  // both users now should have TR: false
  {
    let expected = { countries: { UA: true, KZ: true, TR: false } };
    assertNode(user1, expected);
    assertNode(user2, expected);
  }

  global.update({ countries: { US: false } });

  // child group and both users should get US: false
  {
    const expected = { countries: { UA: true, KZ: true, TR: false, US: false } };
    assertNode(group, expected);
    assertNode(user1, expected);
    assertNode(user2, expected);
  }
});
