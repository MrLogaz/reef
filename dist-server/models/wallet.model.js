"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WalletSchema = _mongoose["default"].Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  "private": String,
  address: String,
  meta: {
    username: String,
    from: String,
    message: String
  },
  project: {
    type: Boolean,
    "default": false
  },
  stats: {
    counter: Number,
    visits: Number
  },
  strategy: [String]
}, {
  collection: 'Wallet'
});

var WalletModel = _mongoose["default"].model('Wallet', WalletSchema);

WalletModel.add = function (walletToAdd) {
  return walletToAdd.save();
};

var _default = WalletModel;
exports["default"] = _default;