import { Minter, TX_TYPE } from 'minter-js-sdk'
import { generateWallet } from 'minterjs-wallet'

const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v1/' })
// const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://api.minter.one/' })
// const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://texasnet.node-api.minter.network/' })
// const minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/' })

export const sender = payload => {
  let txParams = {
    chainId: 1,
    data: payload.data,
    gasCoin: payload.gasCoin || 'BIP',
    payload: payload.payload || ''
  }
  switch (payload.type) {
    case 'send':
      txParams.type = TX_TYPE.SEND
      break
    case 'multisend':
      txParams.type = TX_TYPE.MULTISEND
      break
    case 'delegate':
      txParams.type = TX_TYPE.DELEGATE
      break
    case 'check':
      txParams.type = TX_TYPE.REDEEM_CHECK
      break
    case 'sell':
      txParams.type = TX_TYPE.SELL
      break
    case 'buy':
      txParams.type = TX_TYPE.BUY
      break
    default:
      txParams.type = TX_TYPE.SEND
      break
  }
  return new Promise((resolve, reject) => {
    minterGate.postTx(txParams, { privateKey: process.env.BANK_KEY }).then(txHash => {
      console.log(payload.type + ' created: ' + txHash)
      resolve(txHash)
    }).catch(error => {
      console.log(payload.type + ' failed')
      reject(error)
    })
  })
}

export const redeemCheck = async (check) => {
  const txData = {
    type: 'check',
    data: {
      check: check,
      password: 'pass'
    },
    gasCoin: 'BIP'
  }
  console.log(txData)
  const checkHash = await sender(txData)
  return checkHash
}

// export const checkToWallet = async (check, password) => {
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
