import Order from '../models/order.model'

const controller = {}

controller.list = async (req, res) => {
  try {
    const ordersData = await Order.find({}, { _id: 0, __v: 0 })
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
      let findReq = { provider: 'base' }
      if (req.params.provider) find.provider = req.params.hash
      const currencyData = await Currency.findOne(findReq, { _id: 0, __v: 0 })
      res.json({
        biptorub: currencyData.average
      })
    } catch (err) {
      res.json({
        status: 'Failed',
        error: err
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
