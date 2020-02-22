const axios = require('axios');
const querystring = require('querystring');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchEventsData = async(slug, locale, token) => {
  if (retry > maxRetry) {
    logger.error('Max retries exceeded fetching event.');
    return null;
  }

  const retryPost = async() => {
    logger.warn('Retrying fetching event');
    await sleep(); retry += 1;
    return fetchEventsData(slug, locale, token);
  };

  const URI = `${serviceUrl}/rngs/events/search`;

  const payload = querystring.stringify({
    DateFilter: 'week',
    EventName: slug,
    IncludeDeleted: false,
    ExcludeNics: true,
    IncludeMetadata: false,
    LanguageCode: locale,
    Pagination: {
      Ascending: true,
      CurrentPage: 1,
      PageSize: 1,
      SortingKey: 'relevance',
      TotalPages: 1,
    },
  });

  const headers = { Authorization: token };

  try {
    const response = await axios.post(URI, payload, { headers });

    const { data } = response;

    if (
      response.status !== 200 ||
      data.hasError ||
      !data.Events
    ) {
      return retryPost();
    }
    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(slug, locale, token) => {
  const data = await fetchEventsData(slug, locale, token);
  if (!data || data.Events.length === 0) return null;
  // best matched event is the first one
  const bestMatchedEvent = data.Events.filter(e => slug.indexOf(e.Slugline) === 0)[0];
  return bestMatchedEvent;
};
