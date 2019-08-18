/**
* The valid steps that can be used from puppeteer. Not all of the page steps are included
* in this array since some are not necessary for this application.
*
* @type {string[]}
*/
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
  'type',
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

/** @class Steps */
export class Manager {

  /**
  * The map for steps in the step instance.
  *
  * @property {Map<string, string[]|string>}
  *
  */
  steps = new Map();

  /**
  * Creates a property for this instance based on the `props` parameter,
  * and sets the steps map for this instance.
  *
  * @param {Array<object<string[]|string>>} steps A array of objects that have house the function
  * name and arguments of that function from puppeteer.
  *
  * @param {Object<string, string>} props A object of properties you wish to include on this instance
  * the value of each element must be a string.
  *
  * @returns {void}
  *
  */
  constructor([ ...steps ], props={}) {
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

  /** @private */
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
            if (this[`${item}`]) {
              let i = this[item];
              return i;
            } else {
              return item;
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