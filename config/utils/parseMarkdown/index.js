const md = require('markdown-it')({
  typographer: true,
  html: true,
});
const mdAttrs = require('markdown-it-attrs');
const mdSpans = require('markdown-it-bracketed-spans');
const mustache = require('mustache');

md.use(mdAttrs);
md.use(mdSpans);

const renderMarkdown = (markdownString, context = {}) => {
  const contextRich = mustache.render(markdownString, context);
  return md.render(contextRich);
};

module.exports = renderMarkdown;
