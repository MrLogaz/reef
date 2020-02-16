import express from 'express'
import startegy from '../strategy'

const router = express.Router()

router.post('/:strategyName/:method?', (req, res) => {
  console.log(req.params)
  let strategyName = req.params.strategyName.toLowerCase()
  let method = req.params.method ? req.params.method.toLowerCase() : 'pay'
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

export default router
