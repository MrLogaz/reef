import express from "express"
import cors from "cors"
import sendpulsController from "../controllers/sendpuls.controller"
const router = express.Router()

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}
router.options('*', cors(corsOptions))

router.post('/solo', cors(corsOptions), (req, res) => {
  sendpulsController.sendSolo(req, res);
})

export default router
