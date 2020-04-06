"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

var _nacl = require("../utils/nacl");

var _wallet = _interopRequireDefault(require("../models/wallet.model"));

var _appLogger = _interopRequireDefault(require("../core/logger/app-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var controller = {};

controller.get = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var wallet;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _wallet["default"].findOne({
              hash: req.params.hash
            });

          case 3:
            wallet = _context.sent;
            if (wallet) res.json(wallet);else res.status(404).json({
              status: 404
            });
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            _appLogger["default"].error('Error in getting wallet - ' + _context.t0);

            res.send('Wallet get error - ' + req.params.hash);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

controller.add = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var hash, walletBox, walletOpen;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // console.log(req.body)
            hash = (0, _nacl.getRandomHashHEX)(4); // 4 байта = 4 294 967 296, // 5 байтов = 1 099 511 627 776

            walletBox = (0, _nacl.createBox)(req.body.priv, process.env.NACL_NONCE, process.env.NACL_KEY);
            walletOpen = (0, _nacl.openBox)(walletBox, process.env.NACL_NONCE, process.env.NACL_KEY);
            res.json({
              hash: hash,
              start: req.body.priv,
              privatBox: walletBox,
              "private": walletOpen
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //   let walletToAdd = new Wallet({
//     privat: req.body.name
//   });
//   try {
//     const savedWallet = await Wallet.add(walletToAdd);
//     logger.info('Adding wallet...');
//     res.send('added: ' + savedWallet);
//   } catch (err) {
//     logger.error('Error in getting wallet - ' + err);
//     res.send('Got error in add');
//   }
// }


controller["delete"] = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var walletNonce, removedWallet;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            walletNonce = req.body.nonce;
            _context3.prev = 1;
            _context3.next = 4;
            return _wallet["default"].remove({
              nonce: walletNonce
            });

          case 4:
            removedWallet = _context3.sent;

            _appLogger["default"].info('Deleted wallet - ' + removedWallet);

            res.send('Wallet successfully deleted');
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);

            _appLogger["default"].error('Failed to delete wallet - ' + _context3.t0);

            res.send('Delete failed..!');

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = controller;
exports["default"] = _default;