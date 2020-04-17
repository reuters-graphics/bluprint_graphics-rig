const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../../');

module.exports = (locale) => {
  const MEDIA_ROOT = path.resolve(ROOT, `packages/${locale}/media-${locale}`);
  const PUBLIC_ROOT = path.resolve(ROOT, `packages/${locale}/public-${locale}`);
  fs.renameSync(
    path.join(MEDIA_ROOT, 'interactive/embed.html'),
    path.join(MEDIA_ROOT, 'interactive/index.html')
  );
  fs.renameSync(
    path.join(MEDIA_ROOT, 'media-interactive/public/embed.html'),
    path.join(MEDIA_ROOT, 'media-interactive/public/index.html')
  );
  fs.unlinkSync(
    path.join(PUBLIC_ROOT, 'interactive/embed.html')
  );
};
