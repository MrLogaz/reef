import axios from 'axios'
import Big from 'big.js'
import { TX_TYPE, decodeCheck } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
import { sleep } from '../../utils/helper'
import { sender, redeemCheck } from '../../utils/minter'
import Order from '../../models/order.model'

const merchant = {
  api: 'https://biptophone.ru/api.php',
  address: 'Mx403b763ab039134459448ca7875c548cd5e80f77',
  minBip: 1
}
const headersConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
const feeCheck = getFeeValue(TX_TYPE.REDEEM_CHECK)
const feeSend = getFeeValue(TX_TYPE.SEND, { payload: '03esf0' })

const validateFn = async userData => {
  if (userData.phone.match(/\d/g).length < 10) return false

  const sendData = 'validation=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(merchant.api, sendData, headersConfig)
  if (data.isvalid && data.isvalid === '1') return true
  else return false
}
const getCode = async userData => {
  const sendData = 'contact=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(merchant.api, sendData, headersConfig)
  if (data.keyword) return data.keyword
  else return false
}
const getCurs = async () => {
  const sendData = 'curs=1&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(merchant.api, sendData, headersConfig)
  return data
}

// -------------------
// Methods

const pay = async (req, res) => {
  console.log(req.body)
  const checkData = decodeCheck(req.body.check)
  let amount = new Big(checkData.value)
  if (amount.gte(Big(feeSend).plus(1)) && checkData.coin === 'BIP') {
    try {
      const validateRes = await validateFn(req.body.meta)
      if (validateRes) {
        let codeRes = await getCode(req.body.meta)
        if (codeRes) {
          const checkHash = await redeemCheck(req.body.check)
          let vendorUrl = req.get('origin') ? req.get('origin') : 'API'
          await sleep(2000)
          let sendHash = await sender({
            type: 'send',
            data: {
              to: merchant.address,
              value: Big(checkData.value).minus(feeSend).toString(),
              coin: 'BIP'
            },
            payload: codeRes
          })
          const orderData = {
            checkHash,
            sendHash,
            vendorUrl,
            status: 'success',
            strategy: 'biptophone',
            product: {
              name: 'To phone'
            },
            meta: req.body.meta,
            value: checkData.value,
            coin: checkData.coin,
            merchantOrderId: codeRes
          }
          const newOrder = await Order.createNew(orderData)
          res.json({
            action: req.pushAction,
            status: 'OK',
            checkHash,
            sendHash,
            order: newOrder.hash
          })
        } else {
          res.status(400).json({
            action: req.pushAction,
            status: 'Error',
            error: 'Biptophone, code error'
          })
        }
      } else {
        res.status(400).json({
          action: req.pushAction,
          status: 'Error',
          error: 'Validate error'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(418).json({
        action: req.pushAction,
        status: 'Error',
      })
    }
  } else {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: 'Minimum 1 bip + ' + feeSend + ' fee'
    })
  }
}
const payOld = async (req, res) => {
  const check = decodeCheck(req.body.check)
  console.log(req.body)
  if (check.coin === 'BIP' && Big(check.value).minus(feeSend).gte(1)) {
    const validateRes = await validateFn(req.body.meta)
    if (validateRes) {
      let codeRes = await getCode(req.body.meta)
      if (codeRes) {
        try {
          const txData = {
            type: 'check',
            privateKey: process.env.BANK_KEY,
            data: {
              check: req.body.check,
              password: 'pass'
            },
            chainId: decode.chainId,
            gasCoin: 'BIP'
          }
          // old
          let checkWallet = await checkToWallet(req.body.check, req.body.pass)
          await sleep(6000)
          let txHashPay = await sender({
            privateKey: checkWallet.privateKey,
            type: 'send',
            data: {
              to: merchant.address,
              value: Big(check.value).minus(feeSend).toString(),
              coin: 'BIP'
            },
            payload: codeRes
          })
          res.json({
            action: req.pushAction,
            checkHash: checkWallet.txHash,
            validate: validateRes,
            txHashPay: txHashPay
          })
        } catch (error) {
          res.json({
            action: req.pushAction,
            status: 'Error',
            error: error
          })
        }
      }
    } else {
      res.status(400).json({
        action: req.pushAction,
        validate: false
      })
    }
  } else {
    res.status(400).json({
      action: req.pushAction,
      validate: false,
      message: 'Check value must be greater than 1'
    })
  }
}

const validate = async (req, res) => {
  let validateRes = await validateFn(req.body.data)
  res.json({
    action: req.pushAction,
    validate: validateRes
  })
}

const status = async (req, res) => {
  let cursRes = await getCurs()
  res.json({
    action: req.pushAction,
    curs: cursRes
  })
}

// ----------------
// Custom methods

const rubtobip = async (req, res) => {
  if (req.body.value) {
    let cursRes = await getCurs()
    let calcBip = Big(req.body.value).div(cursRes.RUB).plus(feeSend)
    res.json({
      action: req.pushAction,
      rub: req.body.value,
      bip: calcBip.toString()
    })
  } else {
    res.status(400).json({
      action: req.pushAction,
      message: 'Value not found'
    })
  }
}


export default {
  pay,
  validate,
  status,
  rubtobip
}
