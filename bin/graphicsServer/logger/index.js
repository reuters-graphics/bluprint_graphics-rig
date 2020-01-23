const winston = require('winston');
const chalk = require('chalk');
const argv = require('yargs').argv;

const label = chalk`{green GraphicsServer:}`;

const format = winston.format.printf(({ level, message }) => {
  if (level === 'error') return chalk`${label} {bgRed ERROR} ${message}`;
  if (level === 'warn') return chalk`${label} {bgYellow warn} ${message}`;
  if (level === 'info') return chalk`${label} {bgGreen info} ${message}`;
  return chalk`${label} {cyan ${level}} ${message}`;
});

module.exports = () => winston.createLogger({
  level: argv.verbose ? 'info' : 'error',
  format,
  transports: [
    new winston.transports.Console(),
  ],
});
