import mongoose from 'mongoose';

const WalletSchema = mongoose.Schema({
  nonce: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  private: {
    type: String
  },
  username: {
    type: String
  },
  from: {
    type: String
  },
  project: {
    type: Boolean,
    default: false
  },
}, {collection : 'Wallet'});

let WalletModel = mongoose.model('Wallet', WalletSchema);

WalletModel.add = walletToAdd => {
  return walletToAdd.save();
}

export default WalletModel;