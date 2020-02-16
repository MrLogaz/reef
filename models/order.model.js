import mongoose from 'mongoose'

const OrderSchema = mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  checkHash: String,
  address: String,
  meta: mongoose.Mixed,
  date: {
    type: Date,
    default: Date.now
  }
  project: {
    type: Boolean,
    default: false
  },
  projectUrl: String,
  strategy: String
}, {collection : 'Order'})

let OrderSchema = mongoose.model('Order', OrderSchema)

OrderSchema.add = orderToAdd => {
  return orderToAdd.save()
}

export default OrderSchema
