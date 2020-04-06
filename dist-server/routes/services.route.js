"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _biptophone = _interopRequireDefault(require("../controllers/biptophone.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import servicesController from "../controllers/services.controller"
var router = _express["default"].Router();

var whitelist = ['http://localhost:8080', 'http://localhost:3000'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    callback(null, true);
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  // preflightContinue: true,
  optionsSuccessStatus: 204
};
router.options('*', (0, _cors["default"])(corsOptions)); // BipToPhone

router.get('/biptophone/', (0, _cors["default"])(corsOptions), function (req, res) {
  _biptophone["default"].getCurrence(req, res);
});
router.post('/biptophone/code', (0, _cors["default"])(corsOptions), function (req, res) {
  _biptophone["default"].getCode(req, res);
});
router.post('/biptophone/validate', (0, _cors["default"])(corsOptions), function (req, res) {
  _biptophone["default"].validate(req, res);
});
var _default = router;
exports["default"] = _default;