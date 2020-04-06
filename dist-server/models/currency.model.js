"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CurrencySchema = _mongoose["default"].Schema({
  provider: String,
  biptorub: Number,
  rubtobip: Number,
  average: Number
}, {
  collection: 'Currency'
});

var CurrencyModel = _mongoose["default"].model('Currency', CurrencySchema);

CurrencyModel.updateProvider = function (item) {
  item.average = Math.round((item.biptorub + item.rubtobip) / 2 * 100) / 100;
  return CurrencyModel.updateOne({
    provider: item.provider
  }, item, {
    upsert: true
  });
};

var _default = CurrencyModel;
exports["default"] = _default;