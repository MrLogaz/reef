import axios from 'axios'
import Big from 'big.js'
import { TX_TYPE, decodeCheck } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
import { sleep } from '../../utils/helper'
import { sender, redeemCheck } from '../../utils/minter'
import Order from '../../models/order.model'

const merchant = {
  api: 'https://flat.fm/api/users/wallet/address'
}
const getAddress = async userData => {
  const sendData = { user_id: userData.user_id }
  try {
    let { data } = await axios.post(merchant.api, sendData)
    console.log('------------ data')
    console.log(data)
    if (data.address) return data.address
    else return false
  } catch (error) {
    return false
  }
}

// -------------------
// Methods

const pay = async (req, res) => {
  console.log(req.body)
  res.json({
    action: req.pushAction,
    status: 'No pay method for Flat.fm'
  })
}

const validate = async (req, res) => {
  let validateRes = await getAddress(req.body)
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

export default {
  pay,
  validate,
  status
}
