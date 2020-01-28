const fs = require('fs');
const path = require('path');

module.exports = (graphic) => {
  const PATH = path.resolve(__dirname, '../../../config/logs/graphic.json');
  fs.writeFileSync(PATH, JSON.stringify(graphic, null, 2));
};
