import puppeteer from 'puppeteer';

export class Manager {

  browser;

  constructor() {}

  async open({ ...options }) {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    this.browser = await puppeteer.launch(options);
  }

  async close() {
    if (this.browser) {
      return await this.browser.close();
    }
  }
}