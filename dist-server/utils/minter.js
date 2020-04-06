"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redeemCheck = exports.sender = void 0;

var _minterJsSdk = require("minter-js-sdk");

var _minterjsWallet = require("minterjs-wallet");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var minterGate = new _minterJsSdk.Minter({
  apiType: 'gate',
  baseURL: 'https://gate-api.minter.network/api/v1/'
}); // const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://api.minter.one/' })
// const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://texasnet.node-api.minter.network/' })
// const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/' })

var sender = function sender(payload) {
  var txParams = {
    chainId: 1,
    data: payload.data,
    gasCoin: payload.gasCoin || 'BIP',
    payload: payload.payload || ''
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
    minterGate.postTx(txParams, {
      privateKey: process.env.BANK_KEY
    }).then(function (txHash) {
      console.log(payload.type + ' created: ' + txHash);
      resolve(txHash);
    })["catch"](function (error) {
      console.log(payload.type + ' failed');
      reject(error);
    });
  });
};

exports.sender = sender;

var redeemCheck = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(check) {
    var txData, checkHash;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            txData = {
              type: 'check',
              data: {
                check: check,
                password: 'pass'
              },
              gasCoin: 'BIP'
            };
            console.log(txData);
            _context.next = 4;
            return sender(txData);

          case 4:
            checkHash = _context.sent;
            return _context.abrupt("return", checkHash);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function redeemCheck(_x) {
    return _ref.apply(this, arguments);
  };
}(); // export const checkToWallet = async (check, password) => {
//   const wallet = generateWallet()
//   const privateKey = wallet.getPrivateKeyString()
//   try {
//     const txHash = await sender({
//       privateKey: privateKey,
//       type: 'check',
//       data: { check, password }
//     })
//     return {
//       txHash,
//       privateKey
//     }
//   } catch (error) {
//     return error
//   }
// }


exports.redeemCheck = redeemCheck;