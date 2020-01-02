const cheerio = require('cheerio');
const createElement = require('create-html-element');

const getTagString = (name, attributes = {}, html = '') => createElement({ name, attributes, html });

module.exports = class MetataggerPlugin {
  constructor(options) {
    this.options = options;
  }

  addMetatag = (attributes) => {
    this.$('head').append(getTagString('meta', attributes));
  };

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data) => {
          this.$ = cheerio.load(data.html);

          [{
            property: 'og:title',
            content: 'My newest page title',
          }].map(this.addMetatag);

          data.html = this.$.html();
          return data;
        }
      );
    });
  }
};
