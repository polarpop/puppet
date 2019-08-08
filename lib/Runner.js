"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

class Runner {
  /**
  * The browser instance from puppeteer or null, if the browser instance
  * has not been launched yet.
  *
  * @property
  * 
  * @type {puppeteer.Browser|null}
  *
  */

  /**
  * The map of steps you will use to run the puppeteer commands.
  * 
  * @property
  *
  * @type {Map<string, string[]>}
  *
  */

  /**
  * Creates a puppeteer runner instance. This is mainly used in the scrappers namespace.
  * Allows for multiple pages to be run on one puppeteer browser instance with
  * dynamic steps, and properties.
  *
  *
  * @constructor
  * 
  * @param {object[]<string[]>} steps An array of objects that either contain a string or an
  * array of strings. The key will always be the `page` method you want to send to the puppeteer
  * browser.page instance.
  *
  * @param {Object<string>} props The dynamic properties you want to give the runner instance. This
  * is done so we do not store any kinds of passwords hardcoded or in a `process.env` variables.
  *
  * @returns {void}
  *
  * @example
  * import { Runner } from '@movement-mortgage/web-scrappers';
  * 
  * const jsonSteps = require('./steps.json');
  * const steps = jsonSteps.steps;
  *
  * var props = {
  *  username: 'test',
  *  password: 'got-this-from-storage-or-process-env',
  *  pageName: 'login-page',
  *  otherInput: 'maybe for a search'
  * };
  *
  * // show the chrome browser
  * props['headless'] = false;
  *
  * const runner = new Runner(steps, props);
  *
  * // a browser window will appear, when the tast is complete it will close.
  *
  */
  constructor([..._steps], { ...props
  }, {
    headless = false
  }) {
    _run.add(this);

    _setSteps.add(this);

    _openBrowser.add(this);

    (0, _defineProperty2.default)(this, "browser", null);
    (0, _defineProperty2.default)(this, "steps", new Map());

    // If there are no properties, then do not add them
    // to this instance.
    if (Object.keys(props).length > 0) {
      // create an interable from the object
      // props
      let entries = Object.entries(props);

      for (let [key, value] of entries) {
        // Only strings allowed to be properties
        if (typeof value === 'string') {
          this[key] = value;
        }
      }
    }

    _classPrivateMethodGet(this, _setSteps, _setSteps2).call(this, _steps);

    let _options = {
      headless
    };

    _classPrivateMethodGet(this, _openBrowser, _openBrowser2).call(this, _options);
  }
  /**
  * Launch a new puppeteer browser instance, and begin the run sequence. 
  * @see {Runner~run}, for further details.
  * 
  * @private
  * @property
  *
  * @param {Object} options The launch options for puppeteer.
  *
  * @returns {Promise<void>}
  *
  */


  /**
  * Close the puppeteer browser instance, this can be done
  * if a critical error is thrown or if you just do not want to
  * keep the browser instance running. Mainly used at the end of the
  * run method.
  *
  * @property
  *
  * @returns {Promise<void|null>}
  */
  async close() {
    if (this.browser) {
      return await this.browser.close();
    }
  }

}

var _openBrowser = new WeakSet();

var _setSteps = new WeakSet();

var _run = new WeakSet();

var _openBrowser2 = async function _openBrowser2(options) {
  if (!this.browser) {
    this.browser = await _puppeteer.default.launch(options);

    _classPrivateMethodGet(this, _run, _run2).call(this);
  }
};

var _setSteps2 = function _setSteps2(steps = []) {
  for (let i in steps) {
    let entry = Object.entries(steps[i]);
    let k;
    let v;

    for (let [key, value] of entry) {
      if (this.steps.has(key)) {
        k = `${key}:${i}`;
      } else {
        k = key;
      }

      if (Array.isArray(value)) {
        v = value.map(item => {
          if (this.hasOwnProperty(item.toLowerCase())) {
            return `${this[`${item.toLowerCase()}`]}`;
          } else {
            return `${item}`;
          }
        });
      } else if (typeof value === 'string') {
        v = [`${value}`];
      }

      if (k && v) {
        this.steps.set(k, v);
      }
    }
  }
};

var _run2 = async function _run2() {
  const page = await this.browser.newPage(); // Iterate through the steps map

  for (let [key, value] of this.steps.entries()) {
    try {
      // run the page function, and take off the unique
      // key from the map.
      await page[key.replace(/:[0-9]+$/, '')](...value);
    } catch (e) {}
  } // close the browser when all steps are completed.


  return await this.close();
};

;
/** @exports {Runner} */

var _default = Runner;
exports.default = _default;