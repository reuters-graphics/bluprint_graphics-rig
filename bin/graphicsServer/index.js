const ServerRequest = require('./serverRequest');
const logLocaleUrls = require('./utils/logLocaleUrls');
const getLocales = require('../../config/utils/getLocales');
const logger = require('../../config/utils/logger')('Graphics Server');
const argv = require('yargs').argv;

const locales = getLocales();

const { update: updateOnly, create: createOnly, publish } = argv;

const publishGraphic = async() => {
  // Publishes the entire pack...
  if (publish) {
    const request = new ServerRequest('en');
    await request.publish();
    locales.forEach(locale => logLocaleUrls(locale));
    return;
  }
  for (const i in locales) {
    const locale = locales[i];
    const request = new ServerRequest(locale);
    if (updateOnly) {
      await request.update();
    } else if (createOnly) {
      await request.create();
    } else {
      await request.create();
      await request.update();
    }
  }

  logger.info('✅ Done.\n');
};

publishGraphic();
