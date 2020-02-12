const path = require('path');
const os = require('os');

module.exports = {
  github: {
    TEMPLATE: 'Reuters-Template/ai2hmtl-template_newrig.ait',
    SCRIPT: 'ai2html_newrig.js',
  },
  system: {
    TEMPLATE: path.resolve(__dirname, '../../project-files/ai2html-template.ait'),
    SCRIPT: path.resolve(os.homedir(), 'Applications/Adobe Illustrator 2020/Presets/en_US/Scripts/ai2html_newrig.js'),
  },
};
