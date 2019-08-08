import puppeteer from 'puppeteer';

/** @class Browser */
export class Manager {

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
  browser;

  /**
  * The manager instance for opening and closing the
  * puppeteer instance.
  *
  * @constructor
  *
  * @returns {void}
  *
  */
  constructor() {}

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
  async open({ ...options }) {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    this.browser = await puppeteer.launch(options);
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