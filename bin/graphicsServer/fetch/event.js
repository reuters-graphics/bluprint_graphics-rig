const axios = require('axios');
const querystring = require('querystring');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();

let retry = 0;

const fetchEventsData = async(slug, locale, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching event');

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
      retry += 1;
      logger.warn('Retrying fetching event');
      await sleep();
      return fetchEventsData(slug, locale, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(slug, locale, token) => {
  const data = await fetchEventsData(slug, locale, token);
  // best matched event is the first one
  const bestMatchedEvent = data.Events.filter(e => slug.indexOf(e.Slugline) === 0)[0];
  return bestMatchedEvent;
};
