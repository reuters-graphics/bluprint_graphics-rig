const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

const queryLocation = async(locationString, token) => {
  logger.info('Querying location');
  const headers = { Authorization: `Bearer ${token}` };

  const queryString = encodeURIComponent(locationString);

  const { data } = await axios.get(`${GRAPHICS_API}/typeahead/v1/locations?query=${queryString}`, { headers });

  if (data.length === 0) return null;

  const { rcsId } = data[0];

  return rcsId;
};

module.exports = async(locationString, token) => {
  logger.info('Fetching location');
  const locationId = await queryLocation(locationString, token);

  if (!locationId) return null;

  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await axios.get(`${GRAPHICS_API}/typeahead/v1/locations/${locationId}`, { headers });
  return data;
};
