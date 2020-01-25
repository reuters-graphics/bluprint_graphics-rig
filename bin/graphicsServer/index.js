const ServerRequest = require('./serverRequest');
const getLocales = require('../../config/utils/getLocales');
const logger = require('../../config/utils/logger')('Graphics Server');
const argv = require('yargs').argv;

let publishLocales = getLocales();

const { update: updateOnly, create: createOnly, locale: specificLocale } = argv;

if (specificLocale) {
  publishLocales = publishLocales.indexOf(specificLocale) > -1 ? [specificLocale] : [];
}

const publishGraphic = async() => {
  for (const i in publishLocales) {
    const locale = publishLocales[i];
    const request = new ServerRequest(locale);
    if (updateOnly) {
      await request.updateOnly();
    } else if (createOnly) {
      await request.create();
    } else {
      await request.publish();
    }
  }

  logger.info('✅ Done.\n');
};

publishGraphic();
