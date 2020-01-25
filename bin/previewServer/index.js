const liveServer = require('live-server');
const portfinder = require('portfinder');
const path = require('path');
const open = require('open');
const ngrok = require('ngrok');
const logger = require('../../config/utils/logger')('Build packages');

const argv = require('yargs').argv;

portfinder.basePort = 8000;

portfinder.getPortPromise()
  .then(async port => {
    liveServer.start({
      port,
      open: false,
      root: path.resolve(__dirname, '../../dist'),
    });
    open(`http://localhost:${port}/en/`);

    logger.info(`⚡ Server started at {yellow ${`http://localhost:${port}`}}`);

    // If passing --ngrok, we'll open up a tunnel
    if (argv.ngrok) {
      const url = await ngrok.connect({
        addr: port,
      });
      open(`${url}/en/`, { background: true });
      logger.info(`⚡ Ngrok preview at {yellow ${url}}`);
    }
  });
