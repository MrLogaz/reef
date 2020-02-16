import mongoose from 'mongoose';

const ServicesSchema = mongoose.Schema({
  provider: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tgAccounts: [String],
  token: String
}, {collection : 'Services'});

let ServicesModel = mongoose.model('Services', ServicesSchema);

ServicesModel.createService = createService => {
  return createService.save()
}

export default ServicesModel
