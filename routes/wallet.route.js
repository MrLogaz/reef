import express from 'express'
import walletController from '../controllers/wallet.controller'

const router = express.Router()

router.get('/:hash', (req, res) => {
  walletController.get(req, res)
})

router.post('/', (req, res) => {
  walletController.add(req, res)
})

router.delete('/delete', (req, res) => {
  walletController.delete(req, res)
})

export default router
