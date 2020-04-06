"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SENDER = void 0;

var _minterJsSdk = require("minter-js-sdk");

var minterGate = new _minterJsSdk.Minter({
  apiType: 'gate',
  baseURL: 'https://gate-api.minter.network/api/v1/'
});

var SENDER = function SENDER(payload) {
  var txParams = {
    chainId: 1,
    data: payload.data,
    gasCoin: payload.gasCoin || 'BIP',
    payload: payload.message || ''
  };

  switch (payload.type) {
    case 'send':
      txParams.type = _minterJsSdk.TX_TYPE.SEND;
      break;

    case 'multisend':
      txParams.type = _minterJsSdk.TX_TYPE.MULTISEND;
      break;

    case 'delegate':
      txParams.type = _minterJsSdk.TX_TYPE.DELEGATE;
      break;

    case 'check':
      txParams.type = _minterJsSdk.TX_TYPE.REDEEM_CHECK;
      break;

    case 'sell':
      txParams.type = _minterJsSdk.TX_TYPE.SELL;
      break;

    case 'buy':
      txParams.type = _minterJsSdk.TX_TYPE.BUY;
      break;

    default:
      txParams.type = _minterJsSdk.TX_TYPE.SEND;
      break;
  }

  return new Promise(function (resolve, reject) {
    minterGate.postTx(txParams).then(function (txHash) {
      console.log(payload.type + ' created: ' + txHash);
      resolve(txHash);
    })["catch"](function (error) {
      console.log(error);
      reject(error);
    });
  });
};

exports.SENDER = SENDER;