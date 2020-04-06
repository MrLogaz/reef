import express from "express"
import cors from "cors"
import emailSENDGRID from "../controllers/emailSENDGRID.controller"
const router = express.Router()

var whitelist = ['http://localhost:8080', 'http://localhost:3000', 'https://reef.mn']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}
router.options('*', cors(corsOptions))

router.post('/solo', cors(corsOptions), (req, res) => {
  emailSENDGRID.sendSolo(req, res);
})

export default router
