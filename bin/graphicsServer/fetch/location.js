const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const getPkgProp = require('../../../config/utils/getPackageProp');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const getDeskLocation = () => {
  const { desk } = getPkgProp('reuters');
  return encodeURIComponent(desk.toLowerCase());
};

const fetchLocationData = async(token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching location');

  const retryPost = async() => {
    logger.warn('Retrying fetching location');
    await sleep(); retry += 1;
    return fetchLocationData(token);
  };

  const URI = `${serviceUrl}/rngs/codes/location/${getDeskLocation()}`;

  const headers = { Authorization: token };
  const params = { limit: 1 };

  try {
    const { data } = await axios.get(URI, { headers, params });

    if (data.hasError) return retryPost();
    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(token) => {
  const locations = await fetchLocationData(token);
  return locations[0];
};
