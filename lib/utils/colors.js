"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  error: text => _chalk.default.red(text),
  success: text => _chalk.default.green(text),
  info: text => _chalk.default.blue(text),
  verbose: text => _chalk.default.yellow(text)
};
exports.default = _default;