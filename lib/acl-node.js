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
  #merge;
  #diff;
  constructor({ config, name, merge, diff }) {
    this.#config = config ?? {};
    this.name = name ?? 'anonymous node';
    this.#merge = merge;
    this.#diff = diff;
    this.#children = [];
  }

  appendChildren(node) {
    this.#children.push(node);
  }

  update(newConfig) {
    const cfg = this.#diff ? this.#diff(this.#config, newConfig) : newConfig;
    if (this.#merge) this.#merge(this.#config, cfg);
    else this.#config = cfg;
    this.updateChilderen(cfg);
  }

  get config() {
    return this.#config;
  }

  set config(value) {
    this.#config = value;
    this.updateChilderen();
  }

  updateChilderen(cfg) {
    for (const child of this.#children) {
      if (!child) continue;
      if (!child.update) continue;
      child.update(cfg);
    }
  }
}
