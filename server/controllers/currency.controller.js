import Currency from '../models/currency.model'
import axios from 'axios'
import parser from 'fast-xml-parser'

const controller = {}

controller.update = async (req, res) => {
  try {
    const cashxcashRates = await axios.get('https://cash-x-cash.com/request-exportxml.xml')
    if (parser.validate(cashxcashRates.data) === true) {
      const removed = await Currency.deleteMany({})
      const jsonObj = parser.parse(cashxcashRates.data, true)
      const biptorubIndex = jsonObj.rates.item.findIndex(item => item.to === 'TCSBRUB' && item.from === 'BIP')
      const rubtobipIndex = jsonObj.rates.item.findIndex(item => item.to === 'BIP' && item.from === 'TCSBRUB')
      const volatility = 0.90
      const cashxcash = {
        provider: 'base',
        name: 'cashxcash',
        biptorub: Math.round(jsonObj.rates.item[biptorubIndex].out * volatility * 100) / 100,
        rubtobip: jsonObj.rates.item[rubtobipIndex].in,
      } 
      const updated = await Currency.updateProvider(cashxcash)
      res.json({
        status: 'Currency updated',
        updated: updated,
        removed: removed
      })
    } else throw 'Failed validate'
  } catch (err) {
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

controller.list = async (req, res) => {
  try {
    const currencyData = await Currency.find({}, { _id: 0, __v: 0 })
    res.json(currencyData)
  } catch (err) {
    res.json({
      status: 'Failed',
      error: err
    })
  }
}
controller.get = async (req, res) => {
  try {
    let findReq = { provider: 'base' }
    if (req.params.provider) find.provider = req.params.provider
    const currencyData = await Currency.findOne(findReq, { _id: 0, __v: 0 })
    res.json({
      biptorub: currencyData.biptorub
    })
  } catch (err) {
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

export default controller
