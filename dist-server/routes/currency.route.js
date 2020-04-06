"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _currency = _interopRequireDefault(require("../controllers/currency.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/update', function (req, res) {
  _currency["default"].update(req, res);
});
router.get('/list', function (req, res) {
  _currency["default"].list(req, res);
});
router.get('/:provider?', function (req, res) {
  _currency["default"].get(req, res);
});
var _default = router;
exports["default"] = _default;