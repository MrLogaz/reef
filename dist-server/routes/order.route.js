"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _order = _interopRequireDefault(require("../controllers/order.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/list', function (req, res) {
  _order["default"].list(req, res);
});
router.get('/:hash', function (req, res) {
  _order["default"].get(req, res);
});
var _default = router;
exports["default"] = _default;