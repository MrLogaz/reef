import 'dotenv/config';
import express from 'express';
const app = express();

import path from 'path';
import cors from "cors";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import createError from 'http-errors';
import connectToDb from './db/connect';

logger.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};

connectToDb();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/frontend/dist/pwa')));
app.use(morgan("dev", { "stream": logger.stream }));

import wallet from './routes/wallet.route'
import services from './routes/services.route'
import email from './routes/email.route'

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
})
// app.use('/api/wallet', wallet);
app.use('/api/email', email);
app.use('/api/services', services);
app.get('/test', (req, res) => {
  res.send('Test endpoint!');
});

app.use('/', express.static(path.join(__dirname, '/frontend/dist/pwa')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  logger.error('ERROR - ' + err);
});

module.exports = app;
