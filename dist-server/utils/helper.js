"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = void 0;

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

exports.sleep = sleep;