const fs = require('fs');
const path = require('path');
const axios = require('axios');
const scrape = require('html-metadata');
const { reuters } = require('../../package.json');
const logger = require('../../config/utils/logger')('Get Referrals');

const ROOT = path.resolve(__dirname, '../../');

const URL = 'https://d3sl9l9bcxfb5q.cloudfront.net/json/mw-highlights';

const getLatest = () => axios.get(URL).then(response => response.data.map(d => d.link));

const getMetadata = (link) => scrape(link).then(metadata => metadata);

const getMeta = async(numLinks = 4) => {
  const { referrals } = reuters;

  const latest = await getLatest();

  const links = referrals.length < numLinks ?
    referrals.concat(latest.slice(0, numLinks - referrals.length)) :
    referrals.slice(0, numLinks);

  return Promise.all(links.map(async(url) => {
    const { openGraph } = await getMetadata(url);
    const { title, image, description } = openGraph;
    logger.info(`📌 ${title}`);
    return ({
      url,
      title,
      description,
      image: image.url,
    });
  }));
};

const getReferrals = async() => {
  logger.info('Getting referral metadata for latest stories...');

  const metadata = await getMeta();

  const filepath = path.resolve(ROOT, 'src/js/tools/referrals/metadata.json');

  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));

  logger.info('✅ Done.\n');
};

getReferrals();
