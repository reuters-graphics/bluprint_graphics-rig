const fs = require('fs');
const axios = require('axios');
const os = require('os');
const path = require('path');
const { serviceUrl } = require('../constants/locations');
const catchRetry = require('../utils/catchRetry');

const getCredentials = () => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/graphics-server.json');
  const credFile = fs.readFileSync(credFilePath);
  return JSON.parse(credFile);
};

const getSamlToken = async() => {
  const { username, password } = getCredentials();

  const payload = {
    apiId: username,
    apiKey: password,
    service: `${serviceUrl}/rngs`,
  };

  try {
    const { data } = await axios.post('https://sts.editdata.thomsonreuters.com/svc/api.svc/GetToken', payload);
    return data;
  } catch (e) { return catchRetry(e); }
};

module.exports = async() => {
  const token = await getSamlToken();

  const payload = { token };

  try {
    const { data } = await axios.post(`${serviceUrl}/_trust`, payload);
    return data;
  } catch (e) { return catchRetry(e); }
};
