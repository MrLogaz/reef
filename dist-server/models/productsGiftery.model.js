"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ProductsGifterySchema = _mongoose["default"].Schema({
  id: Number,
  title: String,
  brief: String,
  supplier_id: Number,
  categories: [Number],
  faces: [Number],
  face_step: String,
  digital_acceptance: String,
  face_min: Number,
  face_max: Number,
  disclaimer: String,
  image_url: String
}, {
  collection: 'ProductsGiftery'
});

var ProductsGifteryModel = _mongoose["default"].model('ProductsGiftery', ProductsGifterySchema);

ProductsGifteryModel.saveAarray = function (docArray) {
  var total = docArray.length;
  var result = [];
  return new Promise(function (resolve, reject) {
    var saveAll = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var doc;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                doc = new ProductsGifteryModel(docArray.pop());
                doc.save(function (err, saved) {
                  if (err) reject(err);
                  result.push(saved[0]);
                  if (--total) saveAll();else return resolve('Saved ' + result.length + ' products');
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function saveAll() {
        return _ref.apply(this, arguments);
      };
    }();

    saveAll();
  });
};

var _default = ProductsGifteryModel;
exports["default"] = _default;