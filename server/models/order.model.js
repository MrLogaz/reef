import mongoose from 'mongoose'
import { getRandomHashHEX } from '../utils/nacl'

const OrderSchema = mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  checkHash: String,
  sendHash: String,
  merchantOrderId: String,
  status: String,
  meta: mongoose.Mixed,
  date: {
    type: Date,
    default: Date.now
  },
  vendorUrl: String,
  strategy: String,
  product: mongoose.Mixed,
  value: String,
  coin: String
}, {collection : 'Order'})

let OrderModel = mongoose.model('Order', OrderSchema)

OrderModel.createNew = orderData => {
  orderData.hash = getRandomHashHEX(4)
  let order = new OrderModel(orderData)
  return order.save()
}

export default OrderModel
