"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stat = exports.readdir = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readdir = _util.default.promisify(_fs.default.readdir);

exports.readdir = readdir;

const stat = _util.default.promisify(_fs.default.stat);

exports.stat = stat;