"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = void 0;

var _utils = _interopRequireDefault(require("./utils"));

var _ = require("./");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = async instance => {
  let start = new Date();
  let opts = {
    headless: instance.headless,
    noOutput: instance.noOutput,
    excludedPages: instance.excludedPages,
    pagesDir: _utils.default.getPagesDir(instance.pagesDir)
  };

  try {
    let pages = await _utils.default.getPagesFromPageDir({
      dir: opts.pagesDir,
      excluded: opts.excludedPages,
      runs: opts.runs
    });

    if (pages) {
      const scrappy = new _.Scrappy({
        headless: opts.headless
      });
      scrappy.on('end', () => {
        let end = new Date();
        let difference = start.getTime() - end.getTime();
        difference = difference / 1000;
        difference = Math.abs(difference);
        let successMessage = `
          Successfully completed your webscrapes

          Time Taken: ${difference} seconds
        `;
        console.log(_utils.default.colors.success(successMessage));
      });

      if (!opts.noOutput) {
        scrappy.on('data', data => {
          console.log('Message: ' + _utils.default.colors.verbose(JSON.stringify(data)));
        });
      }

      scrappy.on('error', err => {
        _utils.default.commandEmitter.emit('error', err, false);
      });

      for (let [key, value] of pages.entries()) {
        await scrappy.addPage(`${key}`, value);
      }

      await scrappy.run();
    }
  } catch (e) {
    _utils.default.commandEmitter.emit('error', e);
  }
};

exports.run = run;