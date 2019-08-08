"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Steps = require("./Steps");

/** @class Pages */
class Manager {
  /**
  * The map of pages that are used to run in the Scrappy instance.
  *
  * @property
  *
  * @type {Map<string, Steps>}
  *
  */

  /**
  * Creates a new Pages instance, that allows you to manage what pages are
  * used in the browser instance of Scrappy.
  *
  * @constructor
  *
  * @returns {void}
  *
  */
  constructor() {
    (0, _defineProperty2.default)(this, "pages", new Map());
  }
  /**
  * Adds an element of steps to the `pages` property map. If the
  * `pages` property already has that unique id, the new pages element
  * will not be added.
  *
  * @param {string} id The unique id for the page instance.
  * 
  * @param {object[]<string[]|string>} steps An array of objects that has the value of either
  * an array of strings or just a string.
  *
  * @param {object} props An object that houses the props that you want to give each step.
  *
  * @returns {void}
  *
  */


  add({
    id,
    steps,
    props
  }) {
    if (!this.pages.has(`${id}`)) {
      this.pages.set(`${id}`, new _Steps.Manager(steps, props));
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


  remove({
    id
  }) {
    if (this.pages.has(id)) {
      this.pages.remove(id);
    }
  }

}

exports.Manager = Manager;