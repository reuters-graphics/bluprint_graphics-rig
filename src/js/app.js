import '../scss/main.scss';

const isEmbedded = window.location !== window.parent.location;
const { lang } = document.documentElement;

// IF we're in an iframe...
// You can write code specific to embeds like this...
if (isEmbedded) {
  window.childFrame.sendHeight();
}
