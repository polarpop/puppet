"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _Browser = require("./Browser");

var _Page = require("./Page");

/** @class Scrappy */
class Scrappy {
  /**
  * Creates the browser manager instance. Which has the property of 
  * `browser` as an alias for the puppeteer instance.
  *
  * @property
  *
  * @private
  *
  * @type {Browser}
  *
  */

  /**
  * Creates the page manager instance. Which houses all pages within the
  * puppeteer instance.
  *
  * @property
  *
  * @private
  *
  * @type {Pages}
  *
  */

  /**
  * The Map of pages in the `PageManager` property.
  *
  * @property
  *
  * @type {Pages.pages|undefined}
  *
  */

  /**
  * The browser instance from the `BrowserManager`. Used to launch
  * a new browser.
  *
  * @property
  *
  * @type {Browser.browser|undefined}
  *
  */

  /**
  * The options you want to use for the puppeteer instance.
  * 
  * @property
  * 
  * @private
  *
  */

  /**
  * Manages the puppeteer browser instance, can add pages, can delete pages,
  * and can run the pages either by specific ID or all at once.
  *
  * @constructor
  *
  * @params {Object} browserOpts The options used for the puppeteer launch instance. See https://github.com/GoogleChrome/puppeteer
  * for further details
  *
  * @returns {void}
  *
  */
  constructor({ ...browserOpts
  }) {
    _BrowserManager.set(this, {
      writable: true,
      value: new _Browser.Manager()
    });

    _PageManager.set(this, {
      writable: true,
      value: new _Page.Manager()
    });

    (0, _defineProperty2.default)(this, "pages", void 0);
    (0, _defineProperty2.default)(this, "browser", void 0);

    _browserOpts.set(this, {
      writable: true,
      value: {}
    });

    (0, _classPrivateFieldSet2.default)(this, _browserOpts, browserOpts);
    this.pages = (0, _classPrivateFieldGet2.default)(this, _PageManager).pages;
    this.browser = (0, _classPrivateFieldGet2.default)(this, _BrowserManager).browser;
  }
  /**
  * Adds a page instance to the page manager. When using the Scrappy.run method
  * this will iterate through the `PageManager` property pages instance.
  *
  * @param {String} id The unique id for the page you are trying to add.
  *
  * @param {Object[]<string|string[]>} steps An array of objects with the key
  * of the command you are attempting to run in the puppeteer instance and the
  * value of the steps which can either be a string or an array of strings.
  *
  * @param {Object<string>} props The properties you want to set for each step.
  * Generally, these are dynamic values such as a username and password input.
  *
  * @returns {void}
  *
  * @example
  *
  * import uuid from 'uuid/v4';
  * import Scrappy from '@movement-mortgage/Scrappy';
  *
  * const pageId = uuid();
  * const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];
  *
  * const props = { password: 'This is a dynamic value password' };
  *
  * const scrappy = new Scrappy({ headless: false });
  *
  * scrappy.addPage(pageId, steps, props);
  *
  * scrappy.run();
  *
  * // or
  *
  * scrappy.run(pageId) 
  *
  */


  addPage(id, steps, props) {
    (0, _classPrivateFieldGet2.default)(this, _PageManager).add({
      id,
      steps,
      props
    });
  }
  /**
  * Removes the page from the `PageManager` instance. When you use the `run` method next time,
  * the page that was removed will not be run.
  *
  * @param {string} id The id of the page you want to remove.
  *
  * @returns {void}
  *
  * @example
  *
  * import uuid from 'uuid/v4';
  * import Scrappy from '@movement-mortgage/Scrappy';
  *
  * const pageId = uuid();
  * const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];
  *
  * const props = { password: 'This is a dynamic value password' };
  *
  * const scrappy = new Scrappy({ headless: false });
  *
  * scrappy.addPage(pageId, steps, props);
  *
  * scrappy.run();
  *
  * // or
  *
  * scrappy.run(pageId);
  *
  * // Now let's remove the page
  * scrappy.removePage(pageId);
  *
  * console.log(scrappy.pages.has(pageId)) // outputs false
  *
  * // That page will no longer appear.
  * scrappy.run();
  *
  */


  removePage(id) {
    (0, _classPrivateFieldGet2.default)(this, _PageManager).remove({
      id
    });
  }
  /**
  * Launches the puppeteer instance from the `BrowserManager` if one does
  * not already exists. Iterates through all pages in the `PageManager` property
  * instance, or if the optional parameter of `pageId` is defined, then just run
  * that one page.
  *
  * @param {string?} pageId The id of the page that you want to run, if the page does not exist
  * then throw an error, if the page id is undefined then run all pages in the `PageManager` property.
  *
  * @returns {Promise<any>} returns the close method of the `BrowserManager` property.
  *
  * @example
  *
  * import uuid from 'uuid/v4';
  * import Scrappy from '@movement-mortgage/Scrappy';
  *
  * const pageId = uuid();
  * const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];
  *
  * const props = { password: 'This is a dynamic value password' };
  *
  * const scrappy = new Scrappy({ headless: false });
  *
  * // see `addPage` method for further details
  * scrappy.addPage(pageId, steps, props);
  *
  * scrappy.run();
  *
  * // or
  *
  * scrappy.run(pageId);
  *
  */


  async run(pageId) {
    if (!this.browser) {
      this.browser = await (0, _classPrivateFieldGet2.default)(this, _BrowserManager).open((0, _classPrivateFieldGet2.default)(this, _browserOpts));
    }

    let page;

    if (!pageId) {
      for (let [key, value] of this.pages.entries()) {
        page = await this.browser.newPage();

        for (let [k, v] of value.steps.entries()) {
          try {
            await page[k.replace(/:[0-9]+$/, '')](...v);
          } catch (e) {}
        }
      }
    } else if (this.pages.has(pageId)) {
      page = await this.browser.newPage();
      let instance = this.pages.get(`${pageId}`);

      for (let [ky, vl] of instance.steps.entries()) {
        try {
          await page[ky.replace(/:[0-9]+$/, '')](...vl);
        } catch (e) {}
      }
    } else {
      throw new Error(`The page ${pageId} does not exist, please make sure you added the page.`);
    }

    return await (0, _classPrivateFieldGet2.default)(this, _BrowserManager).close();
  }

}

var _BrowserManager = new WeakMap();

var _PageManager = new WeakMap();

var _browserOpts = new WeakMap();

exports.Pages = _Page.Manager;
exports.Browser = _Browser.Manager;
exports.Scrappy = Scrappy;