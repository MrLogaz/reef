"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _strategy = _interopRequireDefault(require("../strategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/test/:method?', function (req, res) {
  res.json({
    status: 'Test',
    method: req.params.method
  });
});
router.post('/:strategyName/:method?', function (req, res) {
  var strategyName = req.params.strategyName.toLowerCase();
  var method = req.params.method ? req.params.method.toLowerCase() : 'status';
  req.pushAction = strategyName + '/' + method;

  if (_strategy["default"].hasOwnProperty(strategyName)) {
    if (_strategy["default"][strategyName].hasOwnProperty(method)) {
      _strategy["default"][strategyName][method](req, res);
    } else {
      res.json({
        status: 'Error',
        message: 'Method "' + method + '" is not found'
      });
    }
  } else {
    res.json({
      status: 'Error',
      message: 'Strategy "' + strategyName + '" is not found'
    });
  }
});
var _default = router;
exports["default"] = _default;