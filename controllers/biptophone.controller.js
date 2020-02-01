// import Wallet from '../models/wallet.model'
import logger from '../core/logger/app-logger'
import axios from 'axios'

const controller = {};
const hostApi = 'https://biptophone.ru/api.php';

controller.getCurrence = (req, res) => {
    const sendData = "curs=1&key1=" + process.env.SERVICES_BIPTOPHONE
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    axios.post(hostApi, sendData, config).then(response => {
      res.json(response.data);
    }).catch(err => {
      logger.error('BipToPhone - ' + err);
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
}
controller.getCode = (req, res) => {
    const sendData = 'contact=1&phone=' + req.body.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    axios.post(hostApi, sendData, config).then(response => {
      res.json(response.data);
    }).catch(err => {
      logger.error('BipToPhone - ' + err);
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
}
controller.validate = (req, res) => {
    const sendData = 'validation=1&phone=' + req.body.phone + '&key1=' + process.env.SERVICES_BIPTOPHONE
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    axios.post(hostApi, sendData, config).then(response => {
      res.json(response.data);
    }).catch(err => {
      logger.error('BipToPhone - ' + err);
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
}
  // try {
  //   const response = await axios.post(hostApi, sendData);
  //   const jsonText = JSON.stringify(response);
  //   const objResponse = JSON.parse(jsonText);
  //   // console.log(objResponse.data);
  //   // res.send(objResponse)
  //   res.status(200).json({
  //     code: '200',
  //     message: 'BipToPhone bad Request',
  //     error: response
  //   })
  // } catch (err) {
  //   logger.error('BipToPhone - ' + err);
  //   // res.json('BipToPhone - ' + err);
  //   res.status(500).json({
  //     code: '500',
  //     message: 'BipToPhone bad Request',
  //     error: err
  //   })
  // }

controller.add = async (req, res) => {
  let walletToAdd = new Wallet({
    name: req.body.name
  });
  try {
    const savedWallet = await Wallet.add(walletToAdd);
    logger.info('Adding wallet...');
    res.send('added: ' + savedWallet);
  } catch (err) {
    logger.error('Error in getting wallet - ' + err);
    res.send('Got error in add');
  }
}

controller.delete = async (req, res) => {
  let walletNonce = req.body.nonce;
  try{
    const removedWallet = await Wallet.remove({ nonce: walletNonce });
    logger.info('Deleted wallet - ' + removedWallet);
    res.send('Wallet successfully deleted');
  } catch (err) {
    logger.error('Failed to delete wallet - ' + err);
    res.send('Delete failed..!');
  }
}

export default controller;