"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

var _commandLineUtils = require("./commandLineUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  colors: _colors.default,
  getPagesFromPageDir: _commandLineUtils.getPagesFromPageDir,
  parseCommaSeparated: _commandLineUtils.parseCommaSeparated,
  getPagesDir: _commandLineUtils.getPagesDir,
  commandEmitter: _commandLineUtils.commandEmitter
};
exports.default = _default;