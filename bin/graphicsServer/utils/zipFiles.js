const archiver = require('archiver');
const Stream = require('stream');

const createZip = (files, resolve, reject) => {
  const writer = new Stream.Writable();
  const chunks = [];

  writer._write = (chunk, encoding, next) => {
    chunks.push(chunk); next();
  };

  const archive = archiver('zip');

  archive.on('error', e => reject(e));
  archive.on('end', () => resolve(Buffer.concat(chunks)));

  archive.pipe(writer);

  Object.keys(files).forEach((name) => {
    archive.append(files[name], { name });
  });

  archive.finalize();
};

module.exports = async(files) => new Promise((resolve, reject) =>
  createZip(files, resolve, reject));
