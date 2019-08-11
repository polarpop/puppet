"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

const VALID_STEP_METHODS = ['$', '$$', '$$eval', '$eval', '$x', 'accessibility', 'addScriptTag', 'addStyleTag', 'authenticate', 'bringToFront', 'browser', 'browserContext', 'click', 'close', 'content', 'cookies', 'coverage', 'deleteCookie', 'emulate', 'emulateMedia', 'evaluate', 'evaluateHandle', 'evaluateOnNewDocument', 'exposeFunction', 'focus', 'frames', 'goBack', 'goForward', 'goto', 'hover', 'isClosed', 'mainFrame', 'metrics', 'pdf', 'queryObjects', 'reload', 'screenshot', 'select', 'setBypassCSP', 'setCacheEnabled', 'setContent', 'setCookie', 'setDefaultNavigationTimeout', 'setDefaultTimeout', 'setExtraHTTPHeaders', 'setGeolocation', 'setRequestInterception', 'setUserAgent', 'tap', 'type', 'target', 'title', 'url', 'viewport', 'waitFor', 'waitForFileChooser', 'waitForFunction', 'waitForNavigation', 'waitForRequest', 'waitForResponse', 'waitForSelector', 'waitForXPath', 'workers'];

class Manager {
  constructor([..._steps], { ...props
  }) {
    _setSteps.add(this);

    _defineProperty(this, "steps", new Map());

    if (Object.keys(props).length > 0) {
      let entries = Object.entries(props);

      for (let [key, value] of entries) {
        if (typeof value === 'string') {
          this[key] = value;
        }
      }
    }

    _classPrivateMethodGet(this, _setSteps, _setSteps2).call(this, _steps);
  }

}

exports.Manager = Manager;

var _setSteps = new WeakSet();

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
          if (this[`${item}`]) {
            let i = this[item];
            return i;
          } else {
            return item;
          }
        });
      } else if (typeof value === 'string') {
        v = [`${value}`];
      }

      if (k && v && VALID_STEP_METHODS.includes(`${key}`)) {
        this.steps.set(k, v);
      }
    }
  }
};