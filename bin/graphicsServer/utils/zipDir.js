const archiver = require('archiver');
const Stream = require('stream');
const fs = require('fs');
const path = require('path');

const createZip = (localDir, zipDir, resolve, reject) => {
  const writer = new Stream.Writable();
  const chunks = [];

  writer._write = (chunk, encoding, next) => {
    chunks.push(chunk); next();
  };

  // TEMPORARY until zips are supported in the server...
  if (localDir.slice(-10, -3) === '/media-') {
    const zip = path.join(localDir, 'media-interactive/app.zip');
    if (fs.existsSync(zip)) fs.unlinkSync(zip);
  }

  const archive = archiver('zip');

  archive.on('error', e => reject(e));
  archive.on('end', () => resolve(Buffer.concat(chunks)));

  archive.pipe(writer);
  archive.directory(localDir, zipDir);
  archive.finalize();
};

module.exports = async(localDir, zipDir) => new Promise((resolve, reject) =>
  createZip(localDir, zipDir, resolve, reject));
