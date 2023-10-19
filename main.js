'use strict';

const AclNode = require('./lib/acl-node.js');


// const head = new ACLNode({ config: {}, name: 'global config' });
// const group = new ACLNode({ config: {}, name: 'group: programmers' });
// const user = new ACLNode({ config: {}, name: 'user: D1mASS14ek' });

// head.appendChildren(group);
// group.appendChildren(user);

// const printConfigs = () => console.table({
//   head: JSON.stringify(head.config.countries),
//   group: JSON.stringify(group.config.countries),
//   user: JSON.stringify(user.config.countries)
// });

// printConfigs();
// head.update({
//   countries: {
//     UA: true,
//     KZ: false,
//     TR: false,
//     time: 1
//   }
// });
// printConfigs();
// head.update({
//   countries: {
//     KZ: true,
//   }
// });
// printConfigs();
// group.update({
//   countries: {
//     TR: true,
//   }
// });
// printConfigs();
// head.update({
//   countries: {
//     UA: false,
//   }
// });
// printConfigs();
