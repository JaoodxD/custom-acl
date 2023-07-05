'use strict';

const ACLNode = require('./acl-node.js');

const copy = (obj) => JSON.parse(JSON.stringify(obj));

function mergeLogic(obj1, obj2, leftPriority) {
  if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
    if (obj1 === undefined) return obj2;
    if (obj2 === undefined) return obj1;
    return leftPriority ? obj1 ?? obj2 : obj2;
  }
  const { time: t1 = 0 } = obj1;
  const { time: t2 = 0 } = obj2;
  const newObj = {};
  // const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)));
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);
  const keys = k1.concat(k2).sort();
  for (const key of keys) {
    newObj[key] = mergeLogic(obj1[key], obj2[key], leftPriority ?? t1 > t2);
  }

  return newObj;
}

function diffLogic(obj1, obj2, leftPriority) {
  if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
    if (obj1 === obj2) return;
    if (obj1 === undefined) return obj2;
    if (obj2 === undefined) return;
    return leftPriority ? obj1 ?? obj2 : obj2;
  }
  if (typeof obj1 === 'object' && typeof obj2 !== 'object') return copy(obj1);
  if (typeof obj1 !== 'object' && typeof obj2 === 'object') return copy(obj2);
  const { time: t1 = 0 } = obj1;
  const { time: t2 = 0 } = obj2;
  const newObj = {};
  // const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)));
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);
  const keys = k1.concat(k2).sort();
  for (const key of keys) {
    const temp = diffLogic(obj1[key], obj2[key], leftPriority ?? t1 > t2);
    if (temp !== undefined) newObj[key] = temp;
  }

  return newObj;

}

const head = new ACLNode({}, 'global config', mergeLogic, diffLogic);
const group = new ACLNode({}, 'group: programmers', mergeLogic, diffLogic);
const user = new ACLNode({}, 'user: D1mASS14ek', mergeLogic, diffLogic);

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
