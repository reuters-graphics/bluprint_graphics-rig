const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const getPkgProp = require('../../../config/utils/getPackageProp');
const sleep = require('../utils/sleep');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const getDeskLocation = () => {
  const { desk } = getPkgProp('reuters');
  return encodeURIComponent(desk.toLowerCase());
};

const fetchLocationData = async(token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching location');

  const URI = `${serviceUrl}/rngs/codes/location/${getDeskLocation()}`;

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
