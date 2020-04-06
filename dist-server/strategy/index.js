"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _giftery = _interopRequireDefault(require("./aggregator/giftery"));

var _biptophone = _interopRequireDefault(require("./PSP/biptophone"));

var _flatfm = _interopRequireDefault(require("./PSP/flatfm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// All merchant
// PSP payment service provider
var _default = {
  biptophone: _biptophone["default"],
  flatfm: _flatfm["default"],
  giftery: _giftery["default"]
};
exports["default"] = _default;