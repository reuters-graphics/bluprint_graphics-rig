const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchConfigData = async(token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching language');

  const URI = `${serviceUrl}/rngs/app`;

  const headers = { Authorization: token };

  try {
    const { data } = await axios.get(URI, { headers });

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying fetching languages');
      await sleep();
      return fetchConfigData(token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(token, locale) => {
  const { languages } = await fetchConfigData(token);

  const langs = {};

  languages.forEach(language => {
    langs[language.isoCode] = language;
  });

  // We default to english for languages not yet in connect
  if (!(locale in langs)) langs[locale] = langs.en;

  return langs;
};
