import ReferralTool from './component';

const URL = 'https://d3sl9l9bcxfb5q.cloudfront.net/json/mw-highlights';

const getLatest = async() => fetch(URL)
  .then(response => response)
  .then(data => console.log(data.text()));

/* eslint-disable no-new */
new ReferralTool({
  target: document.getElementById('related-links-container'),
});

const latestReferrals = getLatest();

console.log('LATEST', latestReferrals);
