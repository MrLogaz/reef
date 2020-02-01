import Mongoose from 'mongoose';
import logger from '../core/logger/app-logger'
import config from '../core/config/config.dev'

Mongoose.Promise = global.Promise;
Mongoose.set('useFindAndModify', false);
Mongoose.set('useUnifiedTopology', true);
const DB_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: process.env.NODE_ENV !== "production"
};

const connectToDb = async () => {
  try {
    await Mongoose.connect(config.DB_CONNECTION_STRING, DB_options);
    logger.info('Connected to mongo!!!');
  }
  catch (err) {
    logger.error('Could not connect to MongoDB');
  }
}

export default connectToDb;