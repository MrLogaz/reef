"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var winston = _interopRequireWildcard(require("winston"));

var rotate = _interopRequireWildcard(require("winston-daily-rotate-file"));

var _config = _interopRequireDefault(require("../config/config.dev"));

var fs = _interopRequireWildcard(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var dir = _config["default"].logFileDir;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

var alignedWithColorsAndTime = winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.align(), winston.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');
  return "".concat(ts, " [").concat(level, "]: ").concat(message, " ").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));
var logger = winston.createLogger({
  level: 'info',
  exitOnError: false,
  transports: [new winston.transports.Console({
    format: alignedWithColorsAndTime
  }), new winston.transports.DailyRotateFile({
    filename: _config["default"].logFileName,
    dirname: _config["default"].logFileDir,
    maxsize: 20971520,
    //20MB
    maxFiles: 25,
    datePattern: '.dd-MM-yyyy'
  })]
});
var _default = logger;
exports["default"] = _default;