import express from 'express'
import startegy from '../strategy'

const router = express.Router()

router.get('/:strategyName/:method?', (req, res) => {
  let strategyName = req.params.strategyName.toLowerCase()
  let method = req.params.method ? req.params.method.toLowerCase() : 'status'
  if (startegy.hasOwnProperty(strategyName)) {
    if (startegy[strategyName].hasOwnProperty(method)) {
      startegy[strategyName][method](req, res)
    } else {
      res.json({
        status: 'Error',
        message: 'Method "' + method + '" is not found'
      })
    }
  } else {
    res.json({
      status: 'Error',
      message: 'Strategy "' + strategyName + '" is not found'
    })
  }
})
router.post('/:strategyName/pay', (req, res) => {
  let strategyName = req.params.strategyName.toLowerCase()
  if (startegy.hasOwnProperty(strategyName)) {
      startegy[strategyName]['pay'](req, res)
  } else {
    res.json({
      status: 'Error',
      message: 'Strategy "' + strategyName + '" is not found'
    })
  }
})

export default router
