import '../scss/main.scss';

// IF we're in an iframe...
const isEmbedded = window.location !== window.parent.location;
// You can write code specific to embeds like this...
if (isEmbedded) {
  try {
    window.childFrame.sendHeight();
  } catch (err) {
    console.log('pym not found.');
  }
}

// Get the current locale: en, es, de, etc.
// const { lang } = document.documentElement;
// // ... use it to import text or data ...
// import(`Locales/${lang}/article/text.md`).then((text) => {
//   console.log(text.intro);
// });
