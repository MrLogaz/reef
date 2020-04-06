"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _emailSENDGRID = _interopRequireDefault(require("../controllers/emailSENDGRID.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var whitelist = ['http://localhost:8080', 'http://localhost:3000', 'https://reef.mn'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
};
router.options('*', (0, _cors["default"])(corsOptions));
router.post('/solo', (0, _cors["default"])(corsOptions), function (req, res) {
  _emailSENDGRID["default"].sendSolo(req, res);
});
var _default = router;
exports["default"] = _default;