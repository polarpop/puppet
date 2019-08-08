import { Manager as Steps } from './Steps';

export class Manager {

  pages = new Map();

  constructor() {}

  add({ id, steps, props }) {
    if (!this.pages.has(`${id}`)) {
      this.pages.set(`${id}`, new Steps(steps, props));
    }
  }

  remove({ id }) {
    if (this.pages.has(id)) {
      this.pages.remove(id);
    }
  }
}