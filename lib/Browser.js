"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

class Manager {
  constructor() {
    (0, _defineProperty2.default)(this, "browser", void 0);
  }

  async open({ ...options
  }) {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    this.browser = await _puppeteer.default.launch(options);
  }

  async close() {
    if (this.browser) {
      return await this.browser.close();
    }
  }

}

exports.Manager = Manager;