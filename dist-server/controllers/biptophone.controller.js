"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _appLogger = _interopRequireDefault(require("../core/logger/app-logger"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Wallet from '../models/wallet.model'
var controller = {};
var hostApi = 'https://biptophone.ru/api.php';

controller.getCurrence = function (req, res) {
  var sendData = "curs=1&key1=" + process.env.SERVICES_BIPTOPHONE;
  var config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  _axios["default"].post(hostApi, sendData, config).then(function (response) {
    res.json(response.data);
  })["catch"](function (err) {
    _appLogger["default"].error('BipToPhone - ' + err);

    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
};

controller.getCode = function (req, res) {
  var sendData = 'contact=1&phone=' + req.body.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE;
  var config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  _axios["default"].post(hostApi, sendData, config).then(function (response) {
    res.json(response.data);
  })["catch"](function (err) {
    _appLogger["default"].error('BipToPhone - ' + err);

    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
};

controller.validate = function (req, res) {
  var sendData = 'validation=1&phone=' + req.body.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE;
  var config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  _axios["default"].post(hostApi, sendData, config).then(function (response) {
    res.json(response.data);
  })["catch"](function (err) {
    _appLogger["default"].error('BipToPhone - ' + err);

    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}; // try {
//   const response = await axios.post(hostApi, sendData);
//   const jsonText = JSON.stringify(response);
//   const objResponse = JSON.parse(jsonText);
//   // console.log(objResponse.data);
//   // res.send(objResponse)
//   res.status(200).json({
//     code: '200',
//     message: 'BipToPhone bad Request',
//     error: response
//   })
// } catch (err) {
//   logger.error('BipToPhone - ' + err);
//   // res.json('BipToPhone - ' + err);
//   res.status(500).json({
//     code: '500',
//     message: 'BipToPhone bad Request',
//     error: err
//   })
// }


var _default = controller;
exports["default"] = _default;