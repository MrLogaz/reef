import Order from '../models/order.model'

const controller = {}

controller.list = async (req, res) => {
  try {
    const ordersData = await Order.find({}, { _id: 0, __v: 0, hash: 0 })
    res.json(ordersData)
  } catch (err) {
    res.json({
      status: 'Failed',
      error: err
    })
  }
}

controller.get = async (req, res) => {
  if (req.params.hash) {
    try {
      const ordersData = await Order.find({ hash: req.params.hash }, { _id: 0, __v: 0 })
      res.json(ordersData)
    } catch (err) {
      res.json({
        status: 'Failed',
      })
    }
  } else {
    res.json({
      status: 'Failed',
      error: 'Hash not found'
    })
  }
}

export default controller
