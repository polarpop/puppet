"use strict";

var _Steps = require("./Steps");

var _events = require("events");

var _safeEval = _interopRequireDefault(require("safe-eval"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _temp, _onBrowserClose, _onBrowserOpen, _onPageStart, _onPageEnd, _onPageError, _onPageData, _runMultiple, _runSingle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

exports.Scrappy = (_temp = class Scrappy extends _events.EventEmitter {
  constructor(opts) {
    super();

    _defineProperty(this, "pages", new Map());

    _defineProperty(this, "browser", void 0);

    _defineProperty(this, "options", {
      headless: false
    });

    _defineProperty(this, "isRunning", false);

    _defineProperty(this, "currentlyRunning", new Map());

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
    this.once('end', _classPrivateFieldGet(this, _onBrowserClose).bind(this));
    this.once('start', _classPrivateFieldGet(this, _onBrowserOpen).bind(this));
    this.on('page-start', _classPrivateFieldGet(this, _onPageStart).bind(this));
    this.on('page-error', _classPrivateFieldGet(this, _onPageError).bind(this));
    this.on('page-data', _classPrivateFieldGet(this, _onPageData).bind(this));
    this.on('page-end', _classPrivateFieldGet(this, _onPageEnd).bind(this));
  }

  addPage(id, steps, props) {
    if (!this.pages.has(`${id}`) && !this.isRunning) {
      this.pages.set(`${id}`, new _Steps.Manager(steps, props));
    }
  }

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

  async run(pageId) {
    this.browser = await _puppeteer.default.launch(this.options);
    this.emit('start');

    if (!pageId) {
      await _classPrivateFieldGet(this, _runMultiple).call(this);
    } else {
      await _classPrivateFieldGet(this, _runSingle).call(this, pageId);
    }

    return Promise.resolve(true);
  }

}, _onBrowserClose = new WeakMap(), _onBrowserOpen = new WeakMap(), _onPageStart = new WeakMap(), _onPageEnd = new WeakMap(), _onPageError = new WeakMap(), _onPageData = new WeakMap(), _runMultiple = new WeakMap(), _runSingle = new WeakMap(), _temp);