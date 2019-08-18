"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commandEmitter = exports.getPagesFromPageDir = exports.getPagesDir = exports.parseCommaSeparated = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _events = require("events");

var _colors = _interopRequireDefault(require("./colors"));

var _promiseUtils = require("./promiseUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parseCommaSeparated = (value, prev) => {
  if (/\,/.test(value)) {
    return value.split(',');
  }

  return [];
};

exports.parseCommaSeparated = parseCommaSeparated;

const getPagesDir = dir => {
  if (!dir) return process.cwd();
  return _path.default.resolve(dir);
};

exports.getPagesDir = getPagesDir;

const getPagesFromPageDir = async ({
  dir,
  excluded = [],
  runs = 1
}) => {
  let pages = new Map();
  let excludes = [...excluded, 'package.json'];
  let filenames;

  try {
    filenames = await (0, _promiseUtils.readdir)(dir);
  } catch (e) {
    console.log(e);
    throw e;
  }

  ;

  if (filenames) {
    filenames = filenames.filter(filename => !excludes.includes(filename) && _path.default.parse(filename).ext === '.json');

    for (var i in filenames) {
      let filepath = _path.default.resolve(dir, filenames[i]);

      let _stat = await (0, _promiseUtils.stat)(filepath);

      if (_stat) {
        if (_stat.isFile()) {
          let module = await require(filepath);

          if (module.hasOwnProperty('steps')) {
            let name = _path.default.parse(filenames[i]).name;

            if (pages.has(name)) {
              name = `${name}_${(0, _v.default)()}`;
            }

            let steps = module.steps;
            pages.set(name, steps);

            if (runs > 1) {
              if (runs > 5) throw new Error('You cannot have more than 5 runs running concurrently.\nPlease run in single mode or limit the amount of concurrent tests to 5.');

              for (let r = 1; r < runs; r++) {
                pages.set(`${name}${r}`, module.steps);
              }
            }
          }
        }
      }
    }
  }

  return await pages;
};

exports.getPagesFromPageDir = getPagesFromPageDir;
const commandEmitter = new _events.EventEmitter();
exports.commandEmitter = commandEmitter;