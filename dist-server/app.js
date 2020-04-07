"use strict";

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _serveFavicon = _interopRequireDefault(require("serve-favicon"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _appLogger = _interopRequireDefault(require("./core/logger/app-logger"));

var _morgan = _interopRequireDefault(require("morgan"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _connect = _interopRequireDefault(require("./db/connect"));

var _services = _interopRequireDefault(require("./routes/services.route"));

var _strategy = _interopRequireDefault(require("./routes/strategy.route"));

var _email = _interopRequireDefault(require("./routes/email.route"));

var _currency = _interopRequireDefault(require("./routes/currency.route"));

var _order = _interopRequireDefault(require("./routes/order.route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
_appLogger["default"].stream = {
  write: function write(message, encoding) {
    _appLogger["default"].info(message);
  }
};
(0, _connect["default"])();
app.use((0, _serveFavicon["default"])(_path["default"].join(__dirname, '../public', 'favicon.ico')));
app.use((0, _cors["default"])());
app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].json());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../frontend/dist/pwa')));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../certificate')));
app.use((0, _morgan["default"])("dev", {
  "stream": _appLogger["default"].stream
})); // import wallet from './routes/wallet.route'

app.get('/api', function (req, res) {
  res.json({
    message: 'Welcome to the API'
  });
}); // app.use('/api/wallet', wallet);

app.use('/api/email', _email["default"]);
app.use('/api/strategy', _strategy["default"]);
app.use('/api/services', _services["default"]);
app.use('/api/currency', _currency["default"]);
app.use('/api/order', _order["default"]);
app.use('/api/certificate', _express["default"]["static"](_path["default"].join(__dirname, '../certificate')));
app.get('/test', function (req, res) {
  res.send('Test endpoint!');
});
app.use('*', _express["default"]["static"](_path["default"].join(__dirname, '../frontend/dist/pwa'))); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);

  _appLogger["default"].error('ERROR - ' + err);
});
module.exports = app;