"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _currency = _interopRequireDefault(require("../models/currency.model"));

var _axios = _interopRequireDefault(require("axios"));

var _fastXmlParser = _interopRequireDefault(require("fast-xml-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var controller = {};

controller.update = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var cashxcashRates, removed, jsonObj, biptorubIndex, rubtobipIndex, volatility, cashxcash, updated;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios["default"].get('https://cash-x-cash.com/request-exportxml.xml');

          case 3:
            cashxcashRates = _context.sent;

            if (!(_fastXmlParser["default"].validate(cashxcashRates.data) === true)) {
              _context.next = 19;
              break;
            }

            _context.next = 7;
            return _currency["default"].deleteMany({});

          case 7:
            removed = _context.sent;
            jsonObj = _fastXmlParser["default"].parse(cashxcashRates.data, true);
            biptorubIndex = jsonObj.rates.item.findIndex(function (item) {
              return item.to === 'TCSBRUB' && item.from === 'BIP';
            });
            rubtobipIndex = jsonObj.rates.item.findIndex(function (item) {
              return item.to === 'BIP' && item.from === 'TCSBRUB';
            });
            volatility = 0.90;
            cashxcash = {
              provider: 'base',
              name: 'cashxcash',
              biptorub: Math.round(jsonObj.rates.item[biptorubIndex].out * volatility * 100) / 100,
              rubtobip: jsonObj.rates.item[rubtobipIndex]["in"]
            };
            _context.next = 15;
            return _currency["default"].updateProvider(cashxcash);

          case 15:
            updated = _context.sent;
            res.json({
              status: 'Currency updated',
              updated: updated,
              removed: removed
            });
            _context.next = 20;
            break;

          case 19:
            throw 'Failed validate';

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            res.json({
              status: 'Failed',
              error: _context.t0
            });

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 22]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

controller.list = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var currencyData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _currency["default"].find({}, {
              _id: 0,
              __v: 0
            });

          case 3:
            currencyData = _context2.sent;
            res.json(currencyData);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            res.json({
              status: 'Failed',
              error: _context2.t0
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

controller.get = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var findReq, currencyData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            findReq = {
              provider: 'base'
            };
            if (req.params.provider) find.provider = req.params.provider;
            _context3.next = 5;
            return _currency["default"].findOne(findReq, {
              _id: 0,
              __v: 0
            });

          case 5:
            currencyData = _context3.sent;
            res.json({
              biptorub: currencyData.biptorub
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            res.json({
              status: 'Failed',
              error: _context3.t0
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = controller;
exports["default"] = _default;