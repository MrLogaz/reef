import express from 'express'
import startegy from '../strategy'

const router = express.Router()

router.post('/test/:method?', (req, res) => {
  res.json({
    status: 'Test',
    method: req.params.method
  })
})

router.post('/:strategyName/:method?', (req, res) => {
  const strategyName = req.params.strategyName.toLowerCase()
  const method = req.params.method ? req.params.method.toLowerCase() : 'status'
  req.pushAction = strategyName + '/' + method
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
