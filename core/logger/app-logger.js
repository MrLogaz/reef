import * as winston from 'winston'
import * as rotate from 'winston-daily-rotate-file'
import config from '../config/config.dev'
import * as fs from 'fs';

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const alignedWithColorsAndTime = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {
      const {
        timestamp, level, message, ...args
      } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    }),
);

let logger = winston.createLogger({
    level: 'info',
    exitOnError: false,
    transports: [
        new (winston.transports.Console)({
            format: alignedWithColorsAndTime
        }),
        new winston.transports.DailyRotateFile({
            filename: config.logFileName,
            dirname: config.logFileDir,
            maxsize: 20971520, //20MB
            maxFiles: 25,
            datePattern: '.dd-MM-yyyy'
        })
    ]
});

export default logger;