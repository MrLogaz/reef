"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _big = _interopRequireDefault(require("big.js"));

var _minterJsSdk = require("minter-js-sdk");

var _minterjsUtil = require("minterjs-util");

var _helper = require("../../utils/helper");

var _minter = require("../../utils/minter");

var _order = _interopRequireDefault(require("../../models/order.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var merchant = {
  api: 'https://flat.fm/api/users/wallet/address'
};

var getAddress = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userData) {
    var sendData, _yield$axios$post, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sendData = {
              user_id: userData.user_id
            };
            _context.prev = 1;
            _context.next = 4;
            return _axios["default"].post(merchant.api, sendData);

          case 4:
            _yield$axios$post = _context.sent;
            data = _yield$axios$post.data;
            console.log('------------ data');
            console.log(data);

            if (!data.address) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", data.address);

          case 12:
            return _context.abrupt("return", false);

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", false);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 15]]);
  }));

  return function getAddress(_x) {
    return _ref.apply(this, arguments);
  };
}(); // -------------------
// Methods


var pay = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req.body);
            res.json({
              action: req.pushAction,
              status: 'No pay method for Flat.fm'
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function pay(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var validate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var validateRes;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getAddress(req.body);

          case 2:
            validateRes = _context3.sent;
            res.json({
              action: req.pushAction,
              validate: validateRes
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function validate(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var status = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var cursRes;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getCurs();

          case 2:
            cursRes = _context4.sent;
            res.json({
              action: req.pushAction,
              curs: cursRes
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function status(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}(); // ----------------
// Custom methods


var _default = {
  pay: pay,
  validate: validate,
  status: status
};
exports["default"] = _default;