const md = require('markdown-it')({
  typographer: true,
  html: true,
});
const mdAttrs = require('markdown-it-attrs');
const mdSpans = require('markdown-it-bracketed-spans');

md.use(mdAttrs);
md.use(mdSpans);

const removeBlockMarkers = (str) => str.slice()
  .replace(/^<<[ ]?[a-zA-Z]{1}[a-zA-Z-0-9]*[ ]?>>/gm, '')
  .replace(/^<<>>/gm, '');

module.exports = function(source) {
  const regex = /<<[ ]?[a-zA-Z]{1}[a-zA-Z-0-9]*[ ]?>>.+?<<>>/gs;

  const blockMatches = source.match(regex);

  if (!blockMatches) return `module.exports = ${JSON.stringify(md.render(source))}`;

  const rendered = {};

  blockMatches.forEach((blockMatch) => {
    const regex = /^<<[ ]?([a-zA-Z]{1}[a-zA-Z-0-9]*)[ ]?>>/;
    const blockKey = blockMatch.match(regex)[1];
    rendered[blockKey] = md.render(removeBlockMarkers(blockMatch));
  });

  return `module.exports = ${JSON.stringify(rendered)}`;
};
