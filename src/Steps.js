
const VALID_STEP_METHODS = [
  '$',
  '$$',
  '$$eval',
  '$eval',
  '$x',
  'accessibility',
  'addScriptTag',
  'addStyleTag',
  'authenticate',
  'bringToFront',
  'browser',
  'browserContext',
  'click',
  'close',
  'content',
  'cookies',
  'coverage',
  'deleteCookie',
  'emulate',
  'emulateMedia',
  'evaluate',
  'evaluateHandle',
  'evaluateOnNewDocument',
  'exposeFunction',
  'focus',
  'frames',
  'goBack',
  'goForward',
  'goto',
  'hover',
  'isClosed',
  'mainFrame',
  'metrics',
  'pdf',
  'queryObjects',
  'reload',
  'screenshot',
  'select',
  'setBypassCSP',
  'setCacheEnabled',
  'setContent',
  'setCookie',
  'setDefaultNavigationTimeout',
  'setDefaultTimeout',
  'setExtraHTTPHeaders',
  'setGeolocation',
  'setRequestInterception',
  'setUserAgent',
  'tap',
  'target',
  'title',
  'url',
  'viewport',
  'waitFor',
  'waitForFileChooser',
  'waitForFunction',
  'waitForNavigation',
  'waitForRequest',
  'waitForResponse',
  'waitForSelector',
  'waitForXPath',
  'workers'
];

export class Manager {

  steps = new Map();

  constructor([ ...steps ], { ...props }) {
    if ((Object.keys(props)).length > 0) {
      let entries = Object.entries(props);

      for (let [ key, value ] of entries) {
        if (typeof value === 'string') {
          this[key] = value;
        }
      }
    }

    this.#setSteps(steps);
  }

  #setSteps(steps=[]) {
    for (let i in steps) {
      let entry = Object.entries(steps[i]);
      let k;
      let v;
      for (let [ key, value ] of entry) {
        if (this.steps.has(key)) {
          k = `${key}:${i}`;
          
        } else {
          k = key;
        }
        if (Array.isArray(value)) {
          v = value.map(item => {
            if (this.hasOwnProperty(item.toLowerCase())) {
              return `${this[`${item.toLowerCase()}`]}`;
            } else {
              return `${item}`;
            }
          });
        } else if (typeof value === 'string') {
          v = [ `${value}` ];
        }
        if (k && v && VALID_STEP_METHODS.includes(`${key}`)) {
          this.steps.set(k, v);
        }
        
      }
    }
  }
}