"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

var _appLogger = _interopRequireDefault(require("../core/logger/app-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_mail["default"].setApiKey(process.env.SENDGRID_API_KEY);

var controller = {};
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var encodeChar = function encodeChar(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
};

controller.sendSolo = function (req, res) {
  var mailTo = req.body.email;
  var from = encodeChar(req.body.from || 'Ваш друг');
  var username = encodeChar(req.body.username || 'Счастливчик');
  var value = encodeChar(req.body.value);
  var giftLink = req.body.link; // console.log(from, username, value)
  // console.log(giftLink)

  var msg = {
    to: mailTo,
    from: 'REEF Push <no-reply@reef.mn>',
    templateId: 'd-c5cec07eb1034a76b7def9a1975aeb3c',
    dynamic_template_data: {
      subject: from + " отправил вам подарок",
      username: username,
      from: from,
      value: value,
      link: giftLink
    }
  };

  _mail["default"].send(msg).then(function () {
    res.json({
      status: 'OK'
    });
  })["catch"](function (error) {
    _appLogger["default"].error(error);

    res.status(500);
    res.json({
      status: 500,
      message: 'Ошибка Sendgrid'
    });
  });
};

var _default = controller;
exports["default"] = _default;