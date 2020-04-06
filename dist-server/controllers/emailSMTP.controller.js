"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _appLogger = _interopRequireDefault(require("../core/logger/app-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var controller = {};
var transporterData = {
  host: process.env.EMAIL_SMTP_SERVER,
  port: parseInt(process.env.EMAIL_SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_NOREPLY,
    pass: process.env.EMAIL_SMTP_PASS
  },
  logger: true,
  debug: true
};

var transporter = _nodemailer["default"].createTransport(transporterData);

controller.sendSolo = function (req, res) {
  console.log(transporterData);

  function main() {
    return _main.apply(this, arguments);
  }

  function _main() {
    _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var mailTo, username, giftLink, mailOptions, info;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mailTo = req.body.email;
              username = req.body.username;
              giftLink = req.body.link;
              mailOptions = {
                from: process.env.EMAIL_SMTP_NOREPLY,
                to: mailTo,
                subject: "\u041F\u043E\u0434\u0430\u0440\u043E\u043A \u0434\u043B\u044F ".concat(username),
                text: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 ".concat(giftLink)
              };
              _context.next = 6;
              return transporter.sendMail({
                from: '"Reef" <' + process.env.EMAIL_SMTP_NOREPLY + '>',
                to: 'mrlogaz@gmail.com',
                subject: "Hello ✔",
                text: "Hello",
                html: "<b>Hello</b>"
              });

            case 6:
              info = _context.sent;
              console.log("Message sent: %s", info.messageId);
              res.json({
                info: info
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _main.apply(this, arguments);
  }

  main()["catch"](function (error) {
    _appLogger["default"].error(error);

    res.json({
      error: error
    });
  });
};

var _default = controller;
exports["default"] = _default;