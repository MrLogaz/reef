"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHashMsg = exports.openBox = exports.createBox = exports.getNewNonce = exports.getNewKey = exports.getRandomHashHEX = exports.getRandomHashB64 = exports.fromBase64 = exports.toBase64 = exports.toHex = void 0;

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

var _tweetnaclUtil = _interopRequireDefault(require("tweetnacl-util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var toHex = function toHex(byteArray) {
  return Array.from(byteArray, function (_byte) {
    return ('0' + (_byte & 0xFF).toString(16)).slice(-2);
  }).join('');
};

exports.toHex = toHex;

var toBase64 = function toBase64(msg) {
  return _tweetnaclUtil["default"].encodeBase64(msg);
};

exports.toBase64 = toBase64;

var fromBase64 = function fromBase64(msg) {
  return _tweetnaclUtil["default"].decodeBase64(msg);
};

exports.fromBase64 = fromBase64;

var getRandomHashB64 = function getRandomHashB64(length) {
  return _tweetnaclUtil["default"].encodeBase64(_tweetnacl["default"].randomBytes(length));
};

exports.getRandomHashB64 = getRandomHashB64;

var getRandomHashHEX = function getRandomHashHEX(length) {
  return toHex(_tweetnacl["default"].randomBytes(length));
};

exports.getRandomHashHEX = getRandomHashHEX;

var getNewKey = function getNewKey() {
  return _tweetnacl["default"].randomBytes(_tweetnacl["default"].secretbox.keyLength);
};

exports.getNewKey = getNewKey;

var getNewNonce = function getNewNonce() {
  return _tweetnacl["default"].randomBytes(_tweetnacl["default"].secretbox.nonceLength);
};

exports.getNewNonce = getNewNonce;

var createBox = function createBox(msg, nonce, key) {
  return _tweetnaclUtil["default"].encodeBase64(_tweetnacl["default"].secretbox(_tweetnaclUtil["default"].decodeUTF8(msg), _tweetnaclUtil["default"].decodeBase64(nonce), _tweetnaclUtil["default"].decodeBase64(key)));
};

exports.createBox = createBox;

var openBox = function openBox(msg, nonce, key) {
  return _tweetnaclUtil["default"].encodeUTF8(_tweetnacl["default"].secretbox.open(_tweetnaclUtil["default"].decodeBase64(msg), _tweetnaclUtil["default"].decodeBase64(nonce), _tweetnaclUtil["default"].decodeBase64(key)));
};

exports.openBox = openBox;

var getHashMsg = function getHashMsg(msg) {
  return _tweetnaclUtil["default"].encodeBase64(_tweetnacl["default"].hash(_tweetnaclUtil["default"].decodeUTF8(msg)));
};

exports.getHashMsg = getHashMsg;