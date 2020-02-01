import Wallet from '../models/wallet.model'
import logger from '../core/logger/app-logger'

const controller = {};

controller.get = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ nonce: req.params.nonce });
    if (wallet) res.json(wallet);
    else res.status(404).json({status: 404})
  } catch (err) {
    logger.error('Error in getting wallet - ' + err);
    res.send('Wallet get error - ' + req.params.nonce);
  }
}

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