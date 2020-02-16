import nacl from 'tweetnacl'
import { toBase64, createBox, openBox, getNewNonce, getHashMsg, getRandomHashHEX } from '../utils/nacl'
import Wallet from '../models/wallet.model'
import logger from '../core/logger/app-logger'

const controller = {};

controller.get = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ hash: req.params.hash });
    if (wallet) res.json(wallet);
    else res.status(404).json({status: 404})
  } catch (err) {
    logger.error('Error in getting wallet - ' + err);
    res.send('Wallet get error - ' + req.params.hash);
  }
}

controller.add = async (req, res) => {
  // console.log(req.body)
  let hash = getRandomHashHEX(4) // 4 байта = 4 294 967 296, // 5 байтов = 1 099 511 627 776
  let walletBox = createBox(req.body.priv, process.env.NACL_NONCE, process.env.NACL_KEY)

  let walletOpen = openBox(walletBox, process.env.NACL_NONCE, process.env.NACL_KEY)

  res.json({
    hash: hash,
    start: req.body.priv,
    privatBox: walletBox,
    private: walletOpen
  })
}
//   let walletToAdd = new Wallet({
//     privat: req.body.name
//   });
//   try {
//     const savedWallet = await Wallet.add(walletToAdd);
//     logger.info('Adding wallet...');
//     res.send('added: ' + savedWallet);
//   } catch (err) {
//     logger.error('Error in getting wallet - ' + err);
//     res.send('Got error in add');
//   }
// }

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