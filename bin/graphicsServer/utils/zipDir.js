const archiver = require('archiver');
const Stream = require('stream');

const createZip = (localDir, zipDir, resolve, reject) => {
  const writer = new Stream.Writable();
  const chunks = [];

  writer._write = (chunk, encoding, next) => {
    chunks.push(chunk); next();
  };

  const archive = archiver('zip');

  archive.on('error', e => reject(e));
  archive.on('end', () => resolve(Buffer.concat(chunks)));

  archive.pipe(writer);
  archive.directory(localDir, zipDir);
  archive.finalize();
};

module.exports = async(localDir, zipDir) => new Promise((resolve, reject) =>
  createZip(localDir, zipDir, resolve, reject));
