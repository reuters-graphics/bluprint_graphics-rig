const liveServer = require('live-server');
const portfinder = require('portfinder');
const path = require('path');
const open = require('open');
const ngrok = require('ngrok');
const chalk = require('chalk');

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

    console.log(chalk`\n\n⚡ Server started at {yellow ${`http://localhost:${port}`}}\n\n`);

    // If passing --ngrok, we'll open up a tunnel
    if (argv.ngrok) {
      const url = await ngrok.connect({
        addr: port,
      });
      open(`${url}/en/`, { background: true });
      console.log(chalk`\n\n⚡ Ngrok preview at {yellow ${url}}\n\n`);
    }
  });
