import axios from 'axios'
import Big from 'big.js'
import { TX_TYPE, decodeCheck } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
import { sender, checkToWallet } from '../../utils/minter'
import httpInfo from '../../utils/httpInfo'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const hostApi = 'https://biptophone.ru/api.php'
const headersConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
const minBip = 1
const feeCheck = getFeeValue(TX_TYPE.REDEEM_CHECK)
const feeSend = getFeeValue(TX_TYPE.SEND, { payload: '03esf0' })

const validateFn = async userData => {
  if (userData.phone.match(/\d/g).length < 10) return false

  const sendData = 'validation=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(hostApi, sendData, headersConfig)
  if (data.isvalid && data.isvalid === '1') return true
  else return false
}
const getCode = async userData => {
  const sendData = 'contact=1&phone=' + userData.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(hostApi, sendData, headersConfig)
  if (data.keyword) return data.keyword
  else return false
}
const getCurs = async () => {
  const sendData = 'curs=1&key1=' + process.env.SERVICES_BIPTOPHONE
  let { data } = await axios.post(hostApi, sendData, headersConfig)
  return data
}

// -------------------
// Methods

const pay = async (req, res) => {
  const check = decodeCheck(req.body.check)
  if (check.coin === 'BIP' && Big(check.value).minus(feeSend).gte(1)) {
    const validateRes = await validateFn(req.body.data)
    if (validateRes) {
      let codeRes = await getCode(req.body.data)
      if (codeRes) {
        try {
          let checkWallet = await checkToWallet(req.body.check, req.body.pass)
          await sleep(5000)
          let txHashPay = await sender({
            privateKey: checkWallet.privateKey,
            type: 'send',
            data: {
              to: 'Mx403b763ab039134459448ca7875c548cd5e80f77',
              value: Big(check.value).minus(feeSend).toString(),
              coin: 'BIP'
            },
            payload: codeRes
          })
          res.json({
            method: 'Pay',
            checkHash: checkWallet.txHash,
            validate: validateRes,
            txHashPay: txHashPay
          })
        } catch (error) {
          res.json({
            method: 'Pay',
            status: 'Error',
            error: error
          })
        }
      }
    } else {
      res.status(400).json({
        method: 'Pay',
        validate: false
      })
    }
  } else {
    res.status(400).json({
      method: 'Pay',
      validate: false,
      message: 'Check value must be greater than 1'
    })
  }
}

const validate = async (req, res) => {
  let validateRes = await validateFn(req.body.data)
  res.json({
    method: 'Validate',
    validate: validateRes
  })
}

const status = async (req, res) => {
  let cursRes = await getCurs()
  res.json({
    method: 'Status',
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
      method: 'RubToBip',
      rub: req.body.value,
      // curs: cursRes.RUB,
      bip: calcBip.toString()
    })
  } else {
    res.status(400).json({
      method: 'RubToBip',
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
