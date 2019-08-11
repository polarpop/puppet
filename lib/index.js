"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _Steps = require("./Steps");

var _events = require("events");

var _safeEval = _interopRequireDefault(require("safe-eval"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _temp, _onBrowserClose, _onBrowserOpen, _onPageStart, _onPageEnd, _onPageError, _onPageData, _runMultiple, _runSingle;

exports.Scrappy = (_temp = class Scrappy extends _events.EventEmitter {
  /**
  * The Map of pages in this instance.
  */

  /**
  * The browser instance from the `BrowserManager`. Used to launch
  * a new browser.
  */

  /**
  * The options you want to use for the puppeteer instance.
  */

  /**
  * Manages the puppeteer browser instance, can add pages, can delete pages,
  * and can run the pages either by specific ID or all at once.
  *
  * @constructor
  *
  * @params {Object} opts The options used for the puppeteer launch instance. See https://github.com/GoogleChrome/puppeteer
  * for further details
  *
  * @returns {void}
  *
  */
  constructor(opts) {
    super();
    (0, _defineProperty2.default)(this, "pages", new Map());
    (0, _defineProperty2.default)(this, "browser", void 0);
    (0, _defineProperty2.default)(this, "options", {
      headless: false
    });
    (0, _defineProperty2.default)(this, "isRunning", false);
    (0, _defineProperty2.default)(this, "currentlyRunning", new Map());

    _onBrowserClose.set(this, {
      writable: true,
      value: async () => {
        if (this.browser) {
          await this.browser.close();
          this.browser = null;
          this.isRunning = false;
        }
      }
    });

    _onBrowserOpen.set(this, {
      writable: true,
      value: async () => {
        if (this.isRunning) return;
        this.isRunning = true;
      }
    });

    _onPageStart.set(this, {
      writable: true,
      value: async ({
        page,
        steps,
        id
      }) => {
        this.currentlyRunning.set(`${id}`, page);
        await this.runSteps(id, page, steps);
      }
    });

    _onPageEnd.set(this, {
      writable: true,
      value: async (id, errors) => {
        if (this.currentlyRunning.has(`${id}`)) {
          let page = this.currentlyRunning.get(`${id}`);
          await page.close();
          this.currentlyRunning.delete(`${id}`);
        }

        if (this.currentlyRunning.size === 0) {
          this.emit('end', errors);
        }
      }
    });

    _onPageError.set(this, {
      writable: true,
      value: (id, err) => {
        this.emit('error', {
          from: id,
          error: err
        });
      }
    });

    _onPageData.set(this, {
      writable: true,
      value: ({
        id,
        data
      }) => {
        this.emit('data', {
          from: id,
          results: data
        });
      }
    });

    _runMultiple.set(this, {
      writable: true,
      value: async () => {
        for (let [key, value] of this.pages.entries()) {
          let page = await this.browser.newPage();
          this.emit('page-start', {
            page,
            steps: value.steps,
            id: key
          });
        }

        return Promise.resolve(true);
      }
    });

    _runSingle.set(this, {
      writable: true,
      value: async id => {
        if (this.pages.has(id)) {
          let page = await this.browser.newPage();
          let instance = this.pages.get(id);
          this.emit('page-start', {
            page,
            steps: instance.steps,
            id
          });
        }
      }
    });

    this.options = opts || {
      headless: false
    };
    this.once('end', (0, _classPrivateFieldGet2.default)(this, _onBrowserClose).bind(this));
    this.once('start', (0, _classPrivateFieldGet2.default)(this, _onBrowserOpen).bind(this));
    this.on('page-start', (0, _classPrivateFieldGet2.default)(this, _onPageStart).bind(this));
    this.on('page-error', (0, _classPrivateFieldGet2.default)(this, _onPageError).bind(this));
    this.on('page-data', (0, _classPrivateFieldGet2.default)(this, _onPageData).bind(this));
    this.on('page-end', (0, _classPrivateFieldGet2.default)(this, _onPageEnd).bind(this));
  }

  /**
  * Adds a page instance to the page manager. When using the Scrappy.run method
  * this will iterate through the `PageManager` property pages instance.
  *
  * @param {String} id The unique id for the page you are trying to add.
  *
  * @param {Array<object<string[]|string>>} steps An array of objects with the key
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
  * import Scrappy from '@movement-mortgage/scrappy';
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
    if (!this.pages.has(`${id}`) && !this.isRunning) {
      this.pages.set(`${id}`, new _Steps.Manager(steps, props));
    }
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
  * import Scrappy from '@movement-mortgage/scrappy';
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
    if (this.pages.has(id) && !this.isRunning) {
      this.pages.delete(id);
    }

    ;
  }

  async runSteps(id, page, steps) {
    let errors = [];

    if (steps instanceof Map) {
      for (let [key, value] of steps.entries()) {
        let args = value;
        let func = key.replace(/:[0-9]+$/, '');

        if (/evaluate/.test(key)) {
          let fn = (0, _safeEval.default)(args[0]);
          args = [fn, ...args.slice(1)];
        }

        try {
          let results = await page[func](...args);

          if (/evaluate/.test(key)) {
            this.emit('page-data', {
              id,
              data: results
            });
          }
        } catch (e) {
          errors.push(e.message);
        }
      }
    } else if (!steps) {
      errors.push('You cannot have 0 steps for a page.');
    }

    let hasErrors;

    if (errors.length > 0) {
      hasErrors = errors;
    }

    this.emit('page-end', id, hasErrors);
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
  * import Scrappy from '@movement-mortgage/scrappy';
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
    this.browser = await _puppeteer.default.launch(this.options);
    this.emit('start');

    if (!pageId) {
      await (0, _classPrivateFieldGet2.default)(this, _runMultiple).call(this);
    } else {
      await (0, _classPrivateFieldGet2.default)(this, _runSingle).call(this, pageId);
    }

    return Promise.resolve(true);
  }

}, _onBrowserClose = new WeakMap(), _onBrowserOpen = new WeakMap(), _onPageStart = new WeakMap(), _onPageEnd = new WeakMap(), _onPageError = new WeakMap(), _onPageData = new WeakMap(), _runMultiple = new WeakMap(), _runSingle = new WeakMap(), _temp);