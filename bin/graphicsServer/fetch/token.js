const fs = require('fs');
const axios = require('axios');
const os = require('os');
const path = require('path');
const { serviceUrl } = require('../constants/locations');

const getCredentials = () => {
  const credFilePath = path.join(os.homedir(), '.servercredentials');
  const credFile = fs.readFileSync(credFilePath);
  return JSON.parse(credFile);
};

const getSamlToken = async() => {
  const { username, password } = getCredentials();

  const payload = {
    apiId: username,
    apiKey: password,
    service: 'https://editdata.thomsonreuters.com/gfx/_vti_bin/spx/esp/graphics.svc/rngs',
  };

  try {
    const { data } = await axios.post('https://sts.editdata.thomsonreuters.com/svc/api.svc/GetToken', payload);
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async() => {
  const token = await getSamlToken();

  const payload = { token };

  try {
    const { data } = await axios.post(`${serviceUrl}/_trust`, payload);
    return data;
  } catch (e) {
    throw new Error(e);
  }
};
