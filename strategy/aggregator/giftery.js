import axios from 'axios'
import Big from 'big.js'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import { TX_TYPE, decodeCheck } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
import { sleep } from '../../utils/helper'
import { sender, redeemCheck } from '../../utils/minter'

import Order from '../../models/order.model'
import Categories from '../../models/categoriesGiftery.model'
import Products from '../../models/productsGiftery.model'
import Currency from '../../models/currency.model'

const merchant = {
  api: 'https://ssl-api.giftery.ru'
}

const requestGiftery = async (method = 'test', dataReq = '') => {
  const dataReqOrigin = dataReq === '' ? '' : JSON.stringify(dataReq)
  const dataReqUrl = dataReq === '' ? '' : '&data=' + JSON.stringify(dataReq)
  const secret = method + dataReqOrigin + process.env.GIFTERY_KEY
  const SIG = crypto.createHash('sha256').update(secret).digest('hex');
  const sendData = `id=${process.env.GIFTERY_ID}&cmd=${method}${dataReqUrl}&sig=${SIG}&in=json&out=json`

  let { data } = await axios.get(merchant.api + '/?' + sendData)
  return data
}


// -------------------
// Methods

const pay = async (req, res) => {
  console.log(req.body)
  const checkData = decodeCheck(req.body.check)
  const currencyData = await Currency.findOne({ provider: 'base' })
  let amount = new Big(req.body.product.face).div(currencyData.biptorub).round()
  console.log(amount.toString(), checkData.value)
  if (amount.lte(checkData.value)) {
    try {
      const checkHash = await redeemCheck(req.body.check)
      console.log(checkHash)
      let vendorUrl = req.get('origin') ? req.get('origin') : 'API'
      const makeMerchantOrder = {
        product_id: req.body.product.merchantId,
        email_to: 'mrlogaz@gmail.com',
        face: req.body.product.face,
        comment: checkHash
      }
      const merchantOrderId = await requestGiftery('makeOrder', makeMerchantOrder)
      if (merchantOrderId.status === "ok") {
        const orderData = {
          checkHash,
          vendorUrl,
          status: 'process',
          strategy: 'giftery',
          product: req.body.product,
          value: checkData.value,
          coin: checkData.coin,
          merchantOrderId: merchantOrderId.data.id
        }
        const newOrder = await Order.createNew(orderData)
        res.json({
          action: req.pushAction,
          status: 'process',
          checkHash,
          orderHash: newOrder.hash
        })
      } else {
        res.status(400).json({
          action: req.pushAction,
          status: 'Error',
          error: merchantOrderId
        })
      }
    } catch (error) {
      // console.log(error)
      res.status(400).json({
        action: req.pushAction,
        status: 'Error',
        error: error
      })
    }
  } else {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: 'Check value not valid'
    })
  }
}

const validate = async (req, res) => {
  res.json({
    action: req.pushAction
  })
}
const statusOrder = async (req, res) => {
  let getStatus = await requestGiftery('getStatus', { id: req.body.id })
  res.json({
    action: req.pushAction,
    merchantOrderId: req.body.id,
    status: getStatus
  })
}
const status = async (req, res) => {
  let getStatus = await requestGiftery('test')
  res.json({
    action: req.pushAction,
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
      action: req.pushAction,
      status: 'OK',
      categories: categoriesData,
      products: productsData
    })
  } catch (err) {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: err
    })
  }
}

const testorder = async (req, res) => {
  const makeMerchantOrder = {
    product_id: 13797,
    face: 50,
    email_to: 'mrlogaz@gmail.com'
  }
  try {
    const orderData = await requestGiftery('makeOrder', makeMerchantOrder)
    res.json({
      action: req.pushAction,
      status: 'OK',
      orderData: orderData
    })
  } catch (err) {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: err
    })
  }
}

const getCode = async (req, res) => {
  try {
    // const orderData = await Order.findOne({ hash: req.body.hash })
    // const certificateData = await requestGiftery('getCertificate', { queue_id: orderData.merchantOrderId })
    const codeData = await requestGiftery('getCode', { queue_id: req.body.queue_id })
    res.json(codeData)
  } catch (err) {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: err
    })
  }
}
const getCertificate = async (req, res) => {
  console.log(req.body.hash)
  try {
    const orderData = await Order.findOne({ hash: req.body.hash })
    const certificateData = await requestGiftery('getCertificate', { queue_id: orderData.merchantOrderId })
    if (certificateData.status === 'ok') {
      const writeFile = await fs.writeFile('./certificate/' + req.body.hash + '.pdf', certificateData.data.certificate, { encoding: 'base64' })//, function(err) {
      console.log('File created: ' + req.body.hash + '.pdf')
      orderData.status = 'success'
      const saveOrderStatus = await orderData.save()
      res.json({
        action: req.pushAction,
        certificate: req.body.hash
      })
    } else {
      res.status(400).json(certificateData)
    }
  } catch (err) {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: err
    })
  }
}
const getBalance = async (req, res) => {
  try {
    const balanceData = await requestGiftery('getBalance')
    res.json({
      action: req.pushAction,
      status: 'OK',
      balanceData: balanceData
    })
  } catch (err) {
    res.status(418).json({
      action: req.pushAction,
      status: 'Error',
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
      action: req.pushAction,
      status: 'OK',
      removedCategories: removedCategories,
      removedProducts: removedProducts,
      categoriesSaved: categoriesSaved,
      productsSaved: productsSaved
    })
  } catch (err) {
    res.status(400).json({
      action: req.pushAction,
      status: 'Error',
      error: err
    })
  }
}

export default {
  pay,
  validate,
  status,
  // testorder,
  order: statusOrder,
  // code: getCode,
  certificate: getCertificate,
  update: updateGiftery,
  products: getProducts,
  balance: getBalance
}
