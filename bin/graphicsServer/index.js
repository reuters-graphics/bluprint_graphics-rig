const logger = require('../../config/utils/logger')('Graphics Server');
const GraphicPack = require('./graphicPack');
const argv = require('yargs').argv;

const { update: updateOnly, create: createOnly, publish } = argv;

const publishGraphic = async() => {
  const graphic = new GraphicPack();

  try {
    if (publish) {
      await graphic.publishGraphic();
    } else {
      if (updateOnly) {
        await graphic.updatePack();
        await graphic.updateGraphicEditions();
      } else if (createOnly) {
        await graphic.createPack();
        await graphic.createGraphicEditions();
      } else {
        await graphic.createPack();
        await graphic.createGraphicEditions();
        await graphic.updatePack();
        await graphic.updateGraphicEditions();
      }
    }

    logger.info('✅ Done.\n');
  } catch (e) {
    logger.error(e.toString());
    process.exit(1);
  }
};

publishGraphic();
