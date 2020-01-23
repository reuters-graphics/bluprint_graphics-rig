const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();

let retry = 0;

const getUserLocation = () => {
  const location = 'New York';
  return encodeURIComponent(location.toLowerCase());
};

const fetchLocationData = async(token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching location');

  const URI = `${serviceUrl}/rngs/codes/location/${getUserLocation()}`;

  const headers = { Authorization: token };
  const params = { limit: 1 };

  try {
    const { data } = await axios.get(URI, { headers, params });

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying fetching location');
      await sleep();
      return fetchLocationData(token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(token) => {
  const locations = await fetchLocationData(token);
  return locations[0];
};
