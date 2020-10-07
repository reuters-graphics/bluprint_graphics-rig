const path = require('path');
const sharp = require('sharp');
const getLocaleProp = require('../../config/utils/getLocaleProp');

const ROOT = path.resolve(__dirname, '../../');

module.exports = async(locale) => {
  const localeProp = getLocaleProp(locale);

  const LOCALE_IMAGE_PATH = localeProp('image.path');

  const IMAGE = path.resolve(ROOT, `dist/${locale}`, LOCALE_IMAGE_PATH);

  const MEDIA_PACK = path.resolve(ROOT, `packages/${locale}/media-interactive/`);

  await sharp(IMAGE).toFormat('png').toFile(path.resolve(MEDIA_PACK, '_gfxpreview.png'));
};
