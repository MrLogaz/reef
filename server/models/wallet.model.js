import mongoose from 'mongoose'

const WalletSchema = mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  private: String,
  address: String,
  meta: {
    username: String,
    from: String,
    message: String
  },
  project: {
    type: Boolean,
    default: false
  },
  stats: {
    counter: Number,
    visits: Number
  },
  strategy: [String]
}, {collection : 'Wallet'})

let WalletModel = mongoose.model('Wallet', WalletSchema)

WalletModel.add = walletToAdd => {
  return walletToAdd.save()
}

export default WalletModel
