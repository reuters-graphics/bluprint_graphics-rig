const winston = require('winston');
const chalk = require('chalk');
const path = require('path');
const emojiStrip = require('emoji-strip');
const stripColor = require('strip-color');
const argv = require('yargs').argv;

const { silent } = argv;

module.exports = (processName = 'Graphics Rig') => {
  const label = chalk`{green ${processName}:}`;

  const consoleFormat = winston.format.printf(({ level, message }) => {
    if (level === 'error') return chalk`${label} {bgRed ERROR} ${message}`;
    if (level === 'warn') return chalk`${label} {bgYellow warn} ${message}`;
    if (level === 'info') return chalk`${label} {bgGreen info} ${message}`;
    return chalk`${label} {cyan ${level}} ${message}`;
  });

  const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
    if (!message) return;
    return `${timestamp}: [${processName.toUpperCase()}] ${level}: ${emojiStrip(stripColor(message)).trim()}`;
  });

  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: consoleFormat,
        level: silent ? 'error' : 'info',
      }),
      new winston.transports.File({
        filename: path.resolve(__dirname, '../../logs/process.log'),
        level: 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          fileFormat
        ),
      }),
      new winston.transports.File({
        filename: path.resolve(__dirname, '../../logs/error.log'),
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          fileFormat
        ),
      }),
    ],
  });
};
