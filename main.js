'use strict';

const ACLNode = require('./acl-node.js');

const head = new ACLNode({}, 'global config');
const group = new ACLNode({}, 'group: programmers');
const user = new ACLNode({}, 'user: D1mASS14ek');

head.appendChildren(group);
group.appendChildren(user);

const printConfigs = () => console.table({
  head: JSON.stringify(head.config.countries),
  group: JSON.stringify(group.config.countries),
  user: JSON.stringify(user.config.countries)
});

printConfigs();
head.update({
  countries: {
    UA: true,
    KZ: false,
    TR: false,
    time: 1
  }
});
printConfigs();
head.update({
  countries: {
    KZ: true,
  }
});
printConfigs();
group.update({
  countries: {
    TR: true,
  }
});
printConfigs();
head.update({
  countries: {
    UA: false,
  }
});
printConfigs();
