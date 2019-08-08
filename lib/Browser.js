"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

/** @class Browser */
class Manager {
  /**
  * The puppeteer launch instance or null.
  * See https://github.com/GoogleChrome/puppeteer for further
  * details.
  *
  * @property
  *
  * @type {puppeteer~Browser|null}
  *
  */

  /**
  * The manager instance for opening and closing the
  * puppeteer instance.
  *
  * @constructor
  *
  * @returns {void}
  *
  */
  constructor() {
    (0, _defineProperty2.default)(this, "browser", void 0);
  }
  /**
  * Opens a new browser instance, and sets the `browser` property to that
  * puppeteer instance.
  *
  * @param {Object} options The options you want to use to open the puppeteer instance.
  *
  * @returns {Promise<void>}
  *
  * @example
  *
  * import { Browser } from '@movement-mortgage/Scrappy';
  *
  * const browser = new Browser();
  * 
  * browser.open({ headless: true });
  *
  */


  async open({ ...options
  }) {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    this.browser = await _puppeteer.default.launch(options);
  }
  /**
  * Closes the puppeteer instance if the instance has launched.
  *
  * @returns {Promise<any>}
  *
  * @example
  *
  * import { Browser } from '@movement-mortgage/Scrappy';
  *
  * const browser = new Browser();
  * 
  * browser.open({ headless: true });
  *
  * browser.close();
  *
  */


  async close() {
    if (this.browser) {
      return await this.browser.close();
    }
  }

}

exports.Manager = Manager;