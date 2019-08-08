"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Steps = require("./Steps");

class Manager {
  constructor() {
    this.pages = new Map();
  }

  add({
    id,
    steps,
    props
  }) {
    if (!this.pages.has(`${id}`)) {
      this.pages.set(`${id}`, new _Steps.Manager(steps, props));
    }
  }

  remove({
    id
  }) {
    if (this.pages.has(id)) {
      this.pages.remove(id);
    }
  }

}

exports.Manager = Manager;
(0, _defineProperty2.default)(Manager, "pages", void 0);