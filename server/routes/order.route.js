import express from 'express'
import order from "../controllers/order.controller"

const router = express.Router()

router.get('/list', (req, res) => {
  order.list(req, res)
})

router.get('/:hash', (req, res) => {
  order.get(req, res)
})

export default router
