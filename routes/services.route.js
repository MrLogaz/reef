import express from "express";
import cors from "cors";
// import servicesController from "../controllers/services.controller"
import biptophoneController from "../controllers/biptophone.controller"
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

router.get('/biptophone/', cors(corsOptions), (req, res) => {
  biptophoneController.getCurrence(req, res);
});
router.post('/biptophone/code', cors(corsOptions), (req, res) => {
  biptophoneController.getCode(req, res);
});
router.post('/biptophone/validate', cors(corsOptions), (req, res) => {
  biptophoneController.validate(req, res);
});

router.post('/', (req, res) => {
  biptophoneController.add(req, res);
});


export default router;