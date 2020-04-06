"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _appLogger = _interopRequireDefault(require("../core/logger/app-logger"));

var _config = _interopRequireDefault(require("../core/config/config.dev"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_mongoose["default"].Promise = global.Promise;

_mongoose["default"].set('useFindAndModify', false);

_mongoose["default"].set('useUnifiedTopology', true);

var DB_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: process.env.NODE_ENV !== "production"
};

var connectToDb = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _mongoose["default"].connect(_config["default"].DB_CONNECTION_STRING, DB_options);

          case 3:
            _appLogger["default"].info('Connected to mongo!!!');

            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);

            _appLogger["default"].error('Could not connect to MongoDB');

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function connectToDb() {
    return _ref.apply(this, arguments);
  };
}();

var _default = connectToDb;
exports["default"] = _default;