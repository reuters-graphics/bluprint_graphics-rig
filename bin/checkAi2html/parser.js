const { Parse } = require('tar');
const path = require('path');
const { github } = require('./constants');

const deRoot = (filePath) => {
  const fileParts = filePath.split(path.sep);
  fileParts.shift();
  return fileParts.join(path.sep);
};

const getParser = (resolve, reject, fs) => {
  const archive = {};

  return new Parse({
    filter: path => (
      deRoot(path) === github.TEMPLATE ||
      deRoot(path) === github.SCRIPT
    ),
    onentry: (entry) => {
      const entryPath = deRoot(entry.path);
      archive[entryPath] = [];
      entry.on('data', c => archive[entryPath].push(c));
    },
  })
    .on('error', reject)
    .on('end', () => {
      Object.keys(archive).forEach((filePath) => {
        const fileBuffer = Buffer.concat(archive[filePath]);
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, fileBuffer);
      });
      resolve();
    });
};

module.exports = getParser;
