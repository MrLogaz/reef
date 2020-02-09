import express from "express";
import cors from "cors";
// import servicesController from "../controllers/services.controller"
import biptophoneController from "../controllers/biptophone.controller"
import minterpayController from "../controllers/minterpay.controller"
const router = express.Router()

var whitelist = ['http://localhost:8080', 'http://localhost:3000']

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}
router.options('*', cors(corsOptions))

// BipToPhone
router.get('/biptophone/', cors(corsOptions), (req, res) => {
  biptophoneController.getCurrence(req, res);
});
router.post('/biptophone/code', cors(corsOptions), (req, res) => {
  biptophoneController.getCode(req, res);
});
router.post('/biptophone/validate', cors(corsOptions), (req, res) => {
  biptophoneController.validate(req, res);
});

// MinterPay
// router.post('/minterpay', cors(corsOptions), (req, res) => {
//   minterpayController.send(req, res);
// });

export default router;