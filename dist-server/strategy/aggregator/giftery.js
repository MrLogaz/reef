"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _big = _interopRequireDefault(require("big.js"));

var _crypto = _interopRequireDefault(require("crypto"));

var _fs = require("fs");

var _minterJsSdk = require("minter-js-sdk");

var _minterjsUtil = require("minterjs-util");

var _helper = require("../../utils/helper");

var _minter = require("../../utils/minter");

var _order = _interopRequireDefault(require("../../models/order.model"));

var _categoriesGiftery = _interopRequireDefault(require("../../models/categoriesGiftery.model"));

var _productsGiftery = _interopRequireDefault(require("../../models/productsGiftery.model"));

var _currency = _interopRequireDefault(require("../../models/currency.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var merchant = {
  api: 'https://ssl-api.giftery.ru'
};

var requestGiftery = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var method,
        dataReq,
        dataReqOrigin,
        dataReqUrl,
        secret,
        SIG,
        sendData,
        _yield$axios$get,
        data,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'test';
            dataReq = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
            dataReqOrigin = dataReq === '' ? '' : JSON.stringify(dataReq);
            dataReqUrl = dataReq === '' ? '' : '&data=' + JSON.stringify(dataReq);
            secret = method + dataReqOrigin + process.env.GIFTERY_KEY;
            SIG = _crypto["default"].createHash('sha256').update(secret).digest('hex');
            sendData = "id=".concat(process.env.GIFTERY_ID, "&cmd=").concat(method).concat(dataReqUrl, "&sig=").concat(SIG, "&in=json&out=json");
            _context.next = 9;
            return _axios["default"].get(merchant.api + '/?' + sendData);

          case 9:
            _yield$axios$get = _context.sent;
            data = _yield$axios$get.data;
            return _context.abrupt("return", data);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function requestGiftery() {
    return _ref.apply(this, arguments);
  };
}(); // -------------------
// Methods


var pay = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var checkData, currencyData, amount, checkHash, vendorUrl, makeMerchantOrder, merchantOrderId, orderData, newOrder;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req.body);
            checkData = (0, _minterJsSdk.decodeCheck)(req.body.check);
            _context2.next = 4;
            return _currency["default"].findOne({
              provider: 'base'
            });

          case 4:
            currencyData = _context2.sent;
            amount = new _big["default"](req.body.product.face).div(currencyData.biptorub).round();
            console.log(amount.toString(), checkData.value);

            if (!amount.lte(checkData.value)) {
              _context2.next = 34;
              break;
            }

            _context2.prev = 8;
            _context2.next = 11;
            return (0, _minter.redeemCheck)(req.body.check);

          case 11:
            checkHash = _context2.sent;
            console.log(checkHash);
            vendorUrl = req.get('origin') ? req.get('origin') : 'API';
            makeMerchantOrder = {
              product_id: req.body.product.merchantId,
              email_to: 'mrlogaz@gmail.com',
              face: req.body.product.face,
              comment: checkHash
            };
            _context2.next = 17;
            return requestGiftery('makeOrder', makeMerchantOrder);

          case 17:
            merchantOrderId = _context2.sent;

            if (!(merchantOrderId.status === "ok")) {
              _context2.next = 26;
              break;
            }

            orderData = {
              checkHash: checkHash,
              vendorUrl: vendorUrl,
              status: 'process',
              strategy: 'giftery',
              product: req.body.product,
              value: checkData.value,
              coin: checkData.coin,
              merchantOrderId: merchantOrderId.data.id
            };
            _context2.next = 22;
            return _order["default"].createNew(orderData);

          case 22:
            newOrder = _context2.sent;
            res.json({
              action: req.pushAction,
              status: 'process',
              checkHash: checkHash,
              orderHash: newOrder.hash
            });
            _context2.next = 27;
            break;

          case 26:
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: merchantOrderId
            });

          case 27:
            _context2.next = 32;
            break;

          case 29:
            _context2.prev = 29;
            _context2.t0 = _context2["catch"](8);
            // console.log(error)
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context2.t0
            });

          case 32:
            _context2.next = 35;
            break;

          case 34:
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: 'Check value not valid'
            });

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 29]]);
  }));

  return function pay(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var validate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.json({
              action: req.pushAction
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function validate(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var statusOrder = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var getStatus;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return requestGiftery('getStatus', {
              id: req.body.id
            });

          case 2:
            getStatus = _context4.sent;
            res.json({
              action: req.pushAction,
              merchantOrderId: req.body.id,
              status: getStatus
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function statusOrder(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var status = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var getStatus;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return requestGiftery('test');

          case 2:
            getStatus = _context5.sent;
            res.json({
              action: req.pushAction,
              strategy: req.params.strategyName,
              status: getStatus
            });

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function status(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}(); // ----------------
// Custom methods


var getProducts = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var categoriesData, productsData;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _categoriesGiftery["default"].find({
              products_count: {
                $gt: 0
              }
            }, {
              _id: 0
            });

          case 3:
            categoriesData = _context6.sent;
            _context6.next = 6;
            return _productsGiftery["default"].find({}, {
              _id: 0,
              supplier_id: 0,
              __v: 0
            });

          case 6:
            productsData = _context6.sent;
            res.json({
              action: req.pushAction,
              status: 'OK',
              categories: categoriesData,
              products: productsData
            });
            _context6.next = 13;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context6.t0
            });

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));

  return function getProducts(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

var testorder = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var makeMerchantOrder, orderData;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            makeMerchantOrder = {
              product_id: 13797,
              face: 50,
              email_to: 'mrlogaz@gmail.com'
            };
            _context7.prev = 1;
            _context7.next = 4;
            return requestGiftery('makeOrder', makeMerchantOrder);

          case 4:
            orderData = _context7.sent;
            res.json({
              action: req.pushAction,
              status: 'OK',
              orderData: orderData
            });
            _context7.next = 11;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](1);
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context7.t0
            });

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 8]]);
  }));

  return function testorder(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var getCode = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var codeData;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return requestGiftery('getCode', {
              queue_id: req.body.queue_id
            });

          case 3:
            codeData = _context8.sent;
            res.json(codeData);
            _context8.next = 10;
            break;

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8["catch"](0);
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context8.t0
            });

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 7]]);
  }));

  return function getCode(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();

var getCertificate = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var orderData, certificateData, writeFile, saveOrderStatus;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log(req.body.hash);
            _context9.prev = 1;
            _context9.next = 4;
            return _order["default"].findOne({
              hash: req.body.hash
            });

          case 4:
            orderData = _context9.sent;
            _context9.next = 7;
            return requestGiftery('getCertificate', {
              queue_id: orderData.merchantOrderId
            });

          case 7:
            certificateData = _context9.sent;

            if (!(certificateData.status === 'ok')) {
              _context9.next = 20;
              break;
            }

            _context9.next = 11;
            return _fs.promises.writeFile('./certificate/' + req.body.hash + '.pdf', certificateData.data.certificate, {
              encoding: 'base64'
            });

          case 11:
            writeFile = _context9.sent;
            //, function(err) {
            console.log('File created: ' + req.body.hash + '.pdf');
            orderData.status = 'success';
            _context9.next = 16;
            return orderData.save();

          case 16:
            saveOrderStatus = _context9.sent;
            res.json({
              action: req.pushAction,
              certificate: req.body.hash
            });
            _context9.next = 21;
            break;

          case 20:
            res.status(400).json(certificateData);

          case 21:
            _context9.next = 26;
            break;

          case 23:
            _context9.prev = 23;
            _context9.t0 = _context9["catch"](1);
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context9.t0
            });

          case 26:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 23]]);
  }));

  return function getCertificate(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();

var getBalance = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    var balanceData;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return requestGiftery('getBalance');

          case 3:
            balanceData = _context10.sent;
            res.json({
              action: req.pushAction,
              status: 'OK',
              balanceData: balanceData
            });
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](0);
            res.status(418).json({
              action: req.pushAction,
              status: 'Error',
              error: _context10.t0
            });

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 7]]);
  }));

  return function getBalance(_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}();

var updateGiftery = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
    var removedCategories, removedProducts, categoriesData, categoriesSaved, productsData, productsSaved;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _categoriesGiftery["default"].deleteMany({});

          case 3:
            removedCategories = _context11.sent;
            _context11.next = 6;
            return _productsGiftery["default"].deleteMany({});

          case 6:
            removedProducts = _context11.sent;
            _context11.next = 9;
            return requestGiftery('getCategories');

          case 9:
            categoriesData = _context11.sent;
            _context11.next = 12;
            return _categoriesGiftery["default"].saveAarray(categoriesData.data);

          case 12:
            categoriesSaved = _context11.sent;
            _context11.next = 15;
            return requestGiftery('getProducts');

          case 15:
            productsData = _context11.sent;
            _context11.next = 18;
            return _productsGiftery["default"].saveAarray(productsData.data);

          case 18:
            productsSaved = _context11.sent;
            res.json({
              action: req.pushAction,
              status: 'OK',
              removedCategories: removedCategories,
              removedProducts: removedProducts,
              categoriesSaved: categoriesSaved,
              productsSaved: productsSaved
            });
            _context11.next = 25;
            break;

          case 22:
            _context11.prev = 22;
            _context11.t0 = _context11["catch"](0);
            res.status(400).json({
              action: req.pushAction,
              status: 'Error',
              error: _context11.t0
            });

          case 25:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 22]]);
  }));

  return function updateGiftery(_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}();

var _default = {
  pay: pay,
  validate: validate,
  status: status,
  // testorder,
  order: statusOrder,
  // code: getCode,
  certificate: getCertificate,
  update: updateGiftery,
  products: getProducts,
  balance: getBalance
};
exports["default"] = _default;