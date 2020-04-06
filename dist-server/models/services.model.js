"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ServicesSchema = _mongoose["default"].Schema({
  provider: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tgAccounts: [String],
  token: String
}, {
  collection: 'Services'
});

var ServicesModel = _mongoose["default"].model('Services', ServicesSchema);

ServicesModel.createService = function (createService) {
  return createService.save();
};

var _default = ServicesModel;
exports["default"] = _default;