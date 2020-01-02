import '../scss/main.scss';

import greeting from './greeting.ejs';
import { t } from 'ttag';

const p = document.getElementById('app').appendChild(document.createElement('p'));
const d = document.getElementById('app').appendChild(document.createElement('div'));

// These are some comments
p.innerHTML = t`I'm translatable in JavaScript!`;
d.innerHTML = greeting({ name: t`Friend` });
//! This is a saved comment
