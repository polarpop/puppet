import { Manager as Steps } from './Steps';
import utils from './utils';
import * as commands from './commands';
import { EventEmitter } from 'events';
import safeEval from 'safe-eval';
import puppeteer from 'puppeteer';

exports.utils = utils;

exports.commands = commands;

exports.Scrappy = class Scrappy extends EventEmitter {

  /**
  * The Map of pages in this instance.
  */
  pages = new Map();

  /**
  * The browser instance from the `BrowserManager`. Used to launch
  * a new browser.
  */
  browser;

  /**
  * The options you want to use for the puppeteer instance.
  */
  options = { headless: false };

  isRunning = false;

  currentlyRunning = new Map();

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

    this.options = opts || { headless: false };
    
    this.once('end', this.#onBrowserClose.bind(this));
    this.once('start', this.#onBrowserOpen.bind(this));

    this.on('page-start', this.#onPageStart.bind(this));
    this.on('page-error', this.#onPageError.bind(this));
    this.on('page-data', this.#onPageData.bind(this));
    this.on('page-end', this.#onPageEnd.bind(this));
  }

  #onBrowserClose = async () => {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isRunning = false;
    }
  };

  #onBrowserOpen = async () => {
    if (this.isRunning) return;
    
    this.isRunning = true;
  };

  #onPageStart = async ({ page, steps, id }) => {
    this.currentlyRunning.set(`${id}`, page);
    return await this.runSteps(id, page, steps);
  };

  #onPageEnd = async (id, errors) => {
    if (this.currentlyRunning.has(`${id}`)) {
      let page = this.currentlyRunning.get(`${id}`);
      await page.close();
      this.currentlyRunning.delete(`${id}`);
    }

    if (this.currentlyRunning.size === 0) {
      this.emit('end', errors);
    }
    return Promise.resolve();
  };

  #onPageError = (id, err) => {
    this.emit('error', { from: id, error: err });
  };

  #onPageData = ({ id, data }) => {
    this.emit('data', { from: id,  results: data });
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
  addPage(id, steps, props={}) {
    if (!this.pages.has(`${id}`) && !this.isRunning) {
      this.pages.set(`${id}`, new Steps(steps, props));
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
    };
  }

  async runSteps(id, page, steps) {
    let errors = [];
    if (steps instanceof Map) {
      for (let [ key, value ] of steps.entries()) {
        let args = value;
        let func = key.replace(/:[0-9]+$/, '');
        if (/evaluate/.test(key)) {
          let fn = safeEval(args[0]);
          args = [fn, ...args.slice(1)];
        }

        try {
          let results = await page[func](...args);
          if (/evaluate/.test(key)) {
            this.emit('page-data', { id, data: results })
          }
        } catch(e) {
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

  #runMultiple = async () => {
    for (let [ key, value ] of this.pages.entries()) {
      let page = await this.browser.newPage();
      this.emit('page-start', { page, steps: value.steps, id: key });
    }
    return Promise.resolve(true);
  };

  #runSingle = async (id) => {
    if (this.pages.has(id)) {
      let page = await this.browser.newPage();
      let instance = this.pages.get(id);
      this.emit('page-start', { page, steps: instance.steps, id });
    }
  };

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
    this.browser = await puppeteer.launch(this.options);
    this.emit('start');
    if (!pageId) {
      await this.#runMultiple();
    } else {
      await this.#runSingle(pageId)
    }
  }
}