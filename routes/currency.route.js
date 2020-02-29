import express from 'express'
import currency from "../controllers/currency.controller"

const router = express.Router()

router.get('/update', (req, res) => {
  currency.update(req, res)
})

router.get('/list', (req, res) => {
  currency.list(req, res)
})

router.get('/:provider?', (req, res) => {
  currency.get(req, res)
})

export default router
