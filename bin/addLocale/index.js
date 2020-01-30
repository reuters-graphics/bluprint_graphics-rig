const prompts = require('prompts');
const ISO6391 = require('iso-639-1');
const zipObject = require('lodash/zipObject');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const getLocales = require('../../config/utils/getLocales');

const locales = getLocales();

const langs = ISO6391.getAllNames();
const codes = ISO6391.getAllCodes();

const langsObj = zipObject(langs, codes);

const filteredLangs = langs.filter(l => locales.indexOf(ISO6391.getCode(l)) < 0);

const addLocale = async() => {
  const { locale } = await prompts({
    type: 'autocomplete',
    name: 'locale',
    message: 'What language would you like to add to this project?',
    choices: filteredLangs.map((lang) => ({
      value: langsObj[lang],
      title: lang,
    })),
  });

  if (!locale) return;

  const EN_DIR = path.resolve(__dirname, '../../locales/en/');
  const LOCALE_DIR = path.resolve(__dirname, `../../locales/${locale}/`);

  const files = glob.sync('**/*', { cwd: EN_DIR, nodir: true });

  files.forEach((file) => {
    const COPY_FILE = path.join(EN_DIR, file);
    const NEW_FILE = path.join(LOCALE_DIR, file);
    fs.mkdirSync(path.dirname(NEW_FILE), { recursive: true });
    fs.copyFileSync(COPY_FILE, NEW_FILE);
  });
};

addLocale();
