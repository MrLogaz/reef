import mongoose from 'mongoose'

const CurrencySchema = mongoose.Schema({
  provider: String,
  biptorub: Number,
  rubtobip: Number,
  average: Number
}, {collection : 'Currency'})

let CurrencyModel = mongoose.model('Currency', CurrencySchema)

CurrencyModel.updateProvider = item => {
  item.average = Math.round(((item.biptorub + item.rubtobip) / 2) * 100) / 100
  return CurrencyModel.updateOne({ provider: item.provider }, item, { upsert: true })
}

export default CurrencyModel
