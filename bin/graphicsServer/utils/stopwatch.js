const Stopwatch = require('statman-stopwatch');
const chalk = require('chalk');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = class Timer {
  constructor(start = true, startMessage = 'Timing...') {
    this.stopwatch = new Stopwatch(start);
    logger.info(chalk`⏱️  {cyan ${startMessage}}`);
  }

  log() {
    const t = parseInt(this.stopwatch.read() / 1000);
    logger.info(chalk`⏱️  {cyan ${t} seconds}...`);
  }

  stop() {
    this.stopwatch.stop();
    const t = parseInt(this.stopwatch.read() / 1000);
    logger.info(chalk`🏁  {cyan ${t} seconds}.`);
  }

  start() {
    this.stopwatch.start();
  }

  restart() {
    this.time();
    this.start();
  }
};
