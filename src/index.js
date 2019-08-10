import { Manager as Browser } from './Browser';
import { Manager as Pages } from './Page';
import safeEval from 'safe-eval';

/** @class Scrappy */
exports.Scrappy = class Scrappy {
  /**
  * Creates the browser manager instance. Which has the property of 
  * `browser` as an alias for the puppeteer instance.
  *
  * @private
  *
  * @property {Browser}
  *
  */
  #BrowserManager = new Browser();

  /**
  * Creates the page manager instance. Which houses all pages within the
  * puppeteer instance.
  *
  * @private
  *
  * @property {Pages}
  *
  */
  #PageManager = new Pages();

  /**
  * The Map of pages in the `PageManager` property.
  *
  * @property {Pages.pages|undefined}
  *
  */
  pages;

  /**
  * The browser instance from the `BrowserManager`. Used to launch
  * a new browser.
  *
  * @property {Browser.browser|undefined}
  *
  */
  browser;

  /**
  * The options you want to use for the puppeteer instance.
  * 
  * @private
  *
  */
  #browserOpts = {};

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
  constructor({ ...browserOpts }) {
    this.#browserOpts = browserOpts;
    this.pages = this.#PageManager.pages;
    this.browser = this.#BrowserManager.browser;
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
    this.#PageManager.add({ id, steps, props });
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
    this.#PageManager.remove({ id });
  }

  async runSteps(page, steps) {
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
          await page[func](...args);
        } catch(e) {
          errors.push(e.message);
        }
      }
    } else if (!steps) {
      errors.push('You cannot have 0 steps for a page.');
    }
    if (errors.length > 0) {
      return errors;
    } else {
      return true;
    }
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
    let errors = [];
    if (!this.browser) {
      this.browser = await this.#BrowserManager.open(this.#browserOpts);
    }

    let page;

    if (!pageId) {
      for (let [ key, value ] of this.pages.entries()) {
        page = await this.browser.newPage();
        
        let runs = await this.runSteps(page, value.steps);
        
        if (typeof runs === 'array') {
          errors = [...errors, ...runs];
        }
      }
    } else if (this.pages.has(pageId)) {
      page = await this.browser.newPage();
      let instance = this.pages.get(`${pageId}`);
      let single = await this.runSteps(page, instance.steps);
      if (typeof single === 'array') {
        errors = [...errors, ...runs];
      }
    } else {
      throw new Error(`The page ${pageId} does not exist, please make sure you added the page.`);
    }
    console.log(errors);
    return await this.#BrowserManager.close();
  }
}

exports.Pages = Pages;

exports.Browser = Browser;