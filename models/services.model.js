import mongoose from 'mongoose';

const ServicesSchema = mongoose.Schema({
  nonce: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  provider: {
    type: String
  },
  tgAccounts: [String],
  token: String
}, {collection : 'Services'});

let ServicesModel = mongoose.model('Services', ServicesSchema);

ServicesModel.createService = createService => {
  return createService.save()
}

export default ServicesModel
