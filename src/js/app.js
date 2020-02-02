import '../scss/main.scss';

import greeting from './greeting.ejs';
import { t } from 'ttag';

const isEmbedded = window.location !== window.parent.location;

const p = document.getElementById('app').appendChild(document.createElement('p'));
const d = document.getElementById('app').appendChild(document.createElement('div'));

p.innerHTML = t`I'm translatable in JavaScript!`;
d.innerHTML = greeting({ name: t`Friend` });

// We're in an iframe
if (isEmbedded) {
  window.childFrame.sendHeight();
}
