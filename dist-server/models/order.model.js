"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _nacl = require("../utils/nacl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var OrderSchema = _mongoose["default"].Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  checkHash: String,
  sendHash: String,
  merchantOrderId: String,
  status: String,
  meta: _mongoose["default"].Mixed,
  date: {
    type: Date,
    "default": Date.now
  },
  vendorUrl: String,
  strategy: String,
  product: _mongoose["default"].Mixed,
  value: String,
  coin: String
}, {
  collection: 'Order'
});

var OrderModel = _mongoose["default"].model('Order', OrderSchema);

OrderModel.createNew = function (orderData) {
  orderData.hash = (0, _nacl.getRandomHashHEX)(4);
  var order = new OrderModel(orderData);
  return order.save();
};

var _default = OrderModel;
exports["default"] = _default;