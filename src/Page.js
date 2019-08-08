import { Manager as Steps } from './Steps';

/** @class Pages */
export class Manager {
  /**
  * The map of pages that are used to run in the Scrappy instance.
  *
  * @property {Map<string, Steps>}
  *
  */
  pages = new Map();

  /**
  * Creates a new Pages instance, that allows you to manage what pages are
  * used in the browser instance of Scrappy.
  *
  * @constructor
  *
  * @returns {void}
  *
  */
  constructor() {}

  /**
  * Adds an element of steps to the `pages` property map. If the
  * `pages` property already has that unique id, the new pages element
  * will not be added.
  *
  * @param {string} id The unique id for the page instance.
  * 
  * @param {Array<object<string[]|string>>} steps An array of objects that has the value of either
  * an array of strings or just a string.
  *
  * @param {object} props An object that houses the props that you want to give each step.
  *
  * @returns {void}
  *
  */
  add({ id, steps, props }) {
    if (!this.pages.has(`${id}`)) {
      this.pages.set(`${id}`, new Steps(steps, props));
    }
  }

  /**
  * Removes an element of steps to the `pages` property map. If the
  * `pages` property does not have the unique id, the new pages element
  * will not be removed.
  *
  * @param {string} id The unique id for the page instance.
  *
  * @returns {void}
  *
  */
  remove({ id }) {
    if (this.pages.has(id)) {
      this.pages.remove(id);
    }
  }
}