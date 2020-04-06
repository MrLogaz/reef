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
  api: 'https://biptophone.ru/api.php',
  address: 'Mx403b763ab039134459448ca7875c548cd5e80f77',
  minBip: 1
};
var headersConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
var feeCheck = (0, _minterjsUtil.getFeeValue)(_minterJsSdk.TX_TYPE.REDEEM_CHECK);
var feeSend = (0, _minterjsUtil.getFeeValue)(_minterJsSdk.TX_TYPE.SEND, {
  payload: '03esf0'
});

var validateFn = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userData) {
    var sendData, _yield$axios$post, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(userData.phone.match(/\d/g).length < 10)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", false);

          case 2:
            sendData = 'validation=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE;
            _context.next = 5;
            return _axios["default"].post(merchant.api, sendData, headersConfig);

          case 5:
            _yield$axios$post = _context.sent;
            data = _yield$axios$post.data;

            if (!(data.isvalid && data.isvalid === '1')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", true);

          case 11:
            return _context.abrupt("return", false);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validateFn(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCode = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userData) {
    var sendData, _yield$axios$post2, data;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sendData = 'contact=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE;
            _context2.next = 3;
            return _axios["default"].post(merchant.api, sendData, headersConfig);

          case 3:
            _yield$axios$post2 = _context2.sent;
            data = _yield$axios$post2.data;

            if (!data.keyword) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", data.keyword);

          case 9:
            return _context2.abrupt("return", false);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getCode(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getCurs = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var sendData, _yield$axios$post3, data;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sendData = 'curs=1&key1=' + process.env.SERVICES_BIPTOPHONE;
            _context3.next = 3;
            return _axios["default"].post(merchant.api, sendData, headersConfig);

          case 3:
            _yield$axios$post3 = _context3.sent;
            data = _yield$axios$post3.data;
            return _context3.abrupt("return", data);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getCurs() {
    return _ref3.apply(this, arguments);
  };
}(); // -------------------
// Methods


var pay = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var checkData, amount, validateRes, codeRes, checkHash, vendorUrl, sendHash, orderData, newOrder;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(req.body);
            checkData = (0, _minterJsSdk.decodeCheck)(req.body.check);
            amount = new _big["default"](checkData.value);

            if (!(amount.gte((0, _big["default"])(feeSend).plus(1)) && checkData.coin === 'BIP')) {
              _context4.next = 41;
              break;
            }

            _context4.prev = 4;
            _context4.next = 7;
            return validateFn(req.body.meta);

          case 7:
            validateRes = _context4.sent;

            if (!validateRes) {
              _context4.next = 32;
              break;
            }

            _context4.next = 11;
            return getCode(req.body.meta);

          case 11:
            codeRes = _context4.sent;

            if (!codeRes) {
              _context4.next = 29;
              break;
            }

            _context4.next = 15;
            return (0, _minter.redeemCheck)(req.body.check);

          case 15:
            checkHash = _context4.sent;
            vendorUrl = req.get('origin') ? req.get('origin') : 'API';
            _context4.next = 19;
            return (0, _helper.sleep)(2000);

          case 19:
            _context4.next = 21;
            return (0, _minter.sender)({
              type: 'send',
              data: {
                to: merchant.address,
                value: (0, _big["default"])(checkData.value).minus(feeSend).toString(),
                coin: 'BIP'
              },
              payload: codeRes
            });

          case 21:
            sendHash = _context4.sent;
            orderData = {
              checkHash: checkHash,
              sendHash: sendHash,
              vendorUrl: vendorUrl,
              status: 'success',
              strategy: 'biptophone',
              product: {
                name: 'To phone'
              },
              meta: req.body.meta,
              value: checkData.value,
              coin: checkData.coin,
              merchantOrderId: codeRes
            };
            _context4.next = 25;
            return _order["default"].createNew(orderData);

          case 25:
            newOrder = _context4.sent;
            res.json({
              action: req.pushAction,
              status: 'OK',
              checkHash: checkHash,
              sendHash: sendHash,
              order: newOrder.hash
            });
            _context4.next = 30;
            break;

          case 29:
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: 'Biptophone, code error'
            });

          case 30:
            _context4.next = 33;
            break;

          case 32:
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: 'Validate error'
            });

          case 33:
            _context4.next = 39;
            break;

          case 35:
            _context4.prev = 35;
            _context4.t0 = _context4["catch"](4);
            console.log(_context4.t0);
            res.status(418).json({
              action: req.pushAction,
              status: 'Error'
            });

          case 39:
            _context4.next = 42;
            break;

          case 41:
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: 'Minimum 1 bip + ' + feeSend + ' fee'
            });

          case 42:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 35]]);
  }));

  return function pay(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var payOld = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var check, validateRes, codeRes, txData, checkWallet, txHashPay;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            check = (0, _minterJsSdk.decodeCheck)(req.body.check);
            console.log(req.body);

            if (!(check.coin === 'BIP' && (0, _big["default"])(check.value).minus(feeSend).gte(1))) {
              _context5.next = 32;
              break;
            }

            _context5.next = 5;
            return validateFn(req.body.meta);

          case 5:
            validateRes = _context5.sent;

            if (!validateRes) {
              _context5.next = 29;
              break;
            }

            _context5.next = 9;
            return getCode(req.body.meta);

          case 9:
            codeRes = _context5.sent;

            if (!codeRes) {
              _context5.next = 27;
              break;
            }

            _context5.prev = 11;
            txData = {
              type: 'check',
              privateKey: process.env.BANK_KEY,
              data: {
                check: req.body.check,
                password: 'pass'
              },
              chainId: decode.chainId,
              gasCoin: 'BIP'
            }; // old

            _context5.next = 15;
            return checkToWallet(req.body.check, req.body.pass);

          case 15:
            checkWallet = _context5.sent;
            _context5.next = 18;
            return (0, _helper.sleep)(6000);

          case 18:
            _context5.next = 20;
            return (0, _minter.sender)({
              privateKey: checkWallet.privateKey,
              type: 'send',
              data: {
                to: merchant.address,
                value: (0, _big["default"])(check.value).minus(feeSend).toString(),
                coin: 'BIP'
              },
              payload: codeRes
            });

          case 20:
            txHashPay = _context5.sent;
            res.json({
              action: req.pushAction,
              checkHash: checkWallet.txHash,
              validate: validateRes,
              txHashPay: txHashPay
            });
            _context5.next = 27;
            break;

          case 24:
            _context5.prev = 24;
            _context5.t0 = _context5["catch"](11);
            res.json({
              action: req.pushAction,
              status: 'Error',
              error: _context5.t0
            });

          case 27:
            _context5.next = 30;
            break;

          case 29:
            res.status(400).json({
              action: req.pushAction,
              validate: false
            });

          case 30:
            _context5.next = 33;
            break;

          case 32:
            res.status(400).json({
              action: req.pushAction,
              validate: false,
              message: 'Check value must be greater than 1'
            });

          case 33:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[11, 24]]);
  }));

  return function payOld(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

var validate = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var validateRes;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return validateFn(req.body.data);

          case 2:
            validateRes = _context6.sent;
            res.json({
              action: req.pushAction,
              validate: validateRes
            });

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function validate(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

var status = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var cursRes;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getCurs();

          case 2:
            cursRes = _context7.sent;
            res.json({
              action: req.pushAction,
              curs: cursRes
            });

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function status(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}(); // ----------------
// Custom methods


var rubtobip = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var cursRes, calcBip;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!req.body.value) {
              _context8.next = 8;
              break;
            }

            _context8.next = 3;
            return getCurs();

          case 3:
            cursRes = _context8.sent;
            calcBip = (0, _big["default"])(req.body.value).div(cursRes.RUB).plus(feeSend);
            res.json({
              action: req.pushAction,
              rub: req.body.value,
              bip: calcBip.toString()
            });
            _context8.next = 9;
            break;

          case 8:
            res.status(400).json({
              action: req.pushAction,
              message: 'Value not found'
            });

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function rubtobip(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();

var _default = {
  pay: pay,
  validate: validate,
  status: status,
  rubtobip: rubtobip
};
exports["default"] = _default;