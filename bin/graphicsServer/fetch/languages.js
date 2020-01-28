const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchLanguagesData = async(token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching languages');

  const retryPost = async() => {
    logger.warn('Retrying fetching languages');
    await sleep(); retry += 1;
    return fetchLanguagesData(token);
  };

  const URI = `${serviceUrl}/rngs/app`;

  const headers = { Authorization: token };

  try {
    const { data } = await axios.get(URI, { headers });

    if (data.hasError) return retryPost(token);

    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(token, locale) => {
  const { languages } = await fetchLanguagesData(token);

  const langs = {};

  languages.forEach(language => {
    langs[language.isoCode] = language;
  });

  // We default to english for languages not yet in Connect
  if (!(locale in langs)) langs[locale] = langs.en;

  return langs;
};
