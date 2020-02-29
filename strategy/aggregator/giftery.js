import axios from 'axios'
import Big from 'big.js'
import crypto from 'crypto'
import { TX_TYPE, decodeCheck } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
import { sleep } from '../../utils/helper'
import { sender, checkToWallet } from '../../utils/minter'

import Order from '../../models/order.model'
import Categories from '../../models/categoriesGiftery.model'
import Products from '../../models/productsGiftery.model'
import Currency from '../../models/currency.model'

const merchant = {
  api: 'https://ssl-api.giftery.ru'
}

const requestGiftery = async (method = 'test', dataReq = '') => {
  const dataReqUrl = dataReq === '' ? '' : '&data=' + JSON.stringify(dataReq)
  // const dataReqUrl = new URLSearchParams(dataReq).toString()
  const secret = method + dataReqUrl + process.env.GIFTERY_KEY
  const SIG = crypto.createHash('sha256').update(secret).digest('hex');
  const sendData = `id=${process.env.GIFTERY_ID}&cmd=${method}${dataReqUrl}&sig=${SIG}&in=json&out=json`
  console.log(method + ' ////////////////')
  console.log(merchant.api + '/?' + sendData)

  let { data } = await axios.get(merchant.api + '/?' + sendData)
  return data
}


// -------------------
// Methods

const pay = async (req, res) => {
  const decode = decodeCheck(req.body.check)
  const currencyData = await Currency.findOne({ provider: 'base' })
  let amount = new Big(req.body.face).div(currencyData.biptorub)
  if (amount.eq(decode.value)) {
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
    try {
      const checkHash = await sender(txData)
      console.log(checkHash)
      let origin = req.get('origin') ? req.get('origin') : 'API'

      const makeMerchantOrder = {
        product_id: req.body.product,
        email_to: req.body.email,
        face: req.body.face,
        comment: checkHash
      }
      const merchantOrderId = await requestGiftery('makeOrder', makeMerchantOrder)
      const orderData = {
        checkHash: checkHash,
        address: req.body.address,
        status: 'process',
        vendorUrl: origin,
        strategy: 'giftery',
        product: req.body.product,
        face: req.body.face,
        merchantOrderId: merchantOrderId.data.id
      }
      const newOrder = await Order.createNew(orderData)
      res.json({
        method: 'Pay',
        checkHash: checkHash,
        orderHash: newOrder.hash,
        merchantOrderId: merchantOrderId,
        status: 'process'
      })
    } catch (error) {
      console.log(error)
      res.status(500)
      res.json({
        method: 'Pay',
        status: 'Error',
        error: error
      })
    }
  } else {
    res.status(500)
    res.json({
      method: 'Pay',
      status: 'Failed',
      error: 'Check value not valid'
    })
  }
}

const validate = async (req, res) => {
  res.json({
    method: 'Validate'
  })
}
const status = async (req, res) => {
  let getStatus = await requestGiftery('test')
  res.json({
    method: 'Status',
    strategy: req.params.strategyName,
    status: getStatus
  })
}

// ----------------
// Custom methods

const getProducts = async (req, res) => {
  try {
    const categoriesData = await Categories.find({
      products_count: { $gt: 0 }
    }, { _id: 0 })
    const productsData = await Products.find({}, { _id: 0, supplier_id: 0, __v: 0 })
    res.json({
      status: 'OK',
      categories: categoriesData,
      products: productsData
    })
  } catch (err) {
    res.status(500)
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

const testorder = async (req, res) => {
  const makeMerchantOrder = {
    product_id: 13711,
    face: 169,
    comment: 'checkHash',
    email_to: 'mrlogaz@gmail.com'
  }
  try {
    const orderData = await requestGiftery('makeOrder', makeMerchantOrder)
    res.json({
      status: 'OK',
      orderData: orderData
    })
  } catch (err) {
    res.status(500)
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

const getCertificate = async (req, res) => {
  try {
    const orderData = await Order.findOne({ hash: req.body.hash })
    const certificateData = await requestGiftery('getCertificate', { queue_id: orderData.merchantOrderId })
    // const certificateData = await requestGiftery('getCertificate', { queue_id: 926688 })
    res.json({
      status: 'OK',
      certificateData
    })
  } catch (err) {
    res.status(500)
    res.json({
      status: 'Failed',
      error: err
    })
  }
}
const getBalance = async (req, res) => {
  try {
    const balanceData = await requestGiftery('getBalance')
    res.json({
      status: 'OK',
      balanceData: balanceData
    })
  } catch (err) {
    res.status(500)
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

const updateGiftery = async (req, res) => {
  try {
    const removedCategories = await Categories.deleteMany({})
    const removedProducts = await Products.deleteMany({})
    const categoriesData = await requestGiftery('getCategories')
    const categoriesSaved = await Categories.saveAarray(categoriesData.data)
    const productsData = await requestGiftery('getProducts')
    const productsSaved = await Products.saveAarray(productsData.data)
    res.json({
      status: 'OK',
      removedCategories: removedCategories,
      removedProducts: removedProducts,
      categoriesSaved: categoriesSaved,
      productsSaved: productsSaved
    })
  } catch (err) {
    res.status(500)
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

export default {
  pay,
  validate,
  status,
  // testorder,
  certificate: getCertificate,
  update: updateGiftery,
  products: getProducts,
  balance: getBalance
}
