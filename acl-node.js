'use strict';

const validator = {
  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], validator);
    } else {
      return target[key];
    }
  }
};


module.exports = class ACLNode {
  name;
  #config;
  #children;
  constructor(config, name = 'anonymous node') {
    this.#config = config;
    this.name = name;
  }

  update(newConfig) {
    this.#config = newConfig;
    console.log('Config updated in ', this.#name);
    this.updateChilderen();
  }

  get config() {
    return this.#config;
  }

  set config(value) {
    this.#children = value;
    this.updateChilderen();
  }

  updateChilderen() {
    for (const child of this.#children) {
      if (!child) continue;
      if (!child.update) continue;
      child.update(this.#config);
    }
  }
}
