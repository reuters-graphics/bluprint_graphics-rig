const d3 = Object.assign({}, require('d3-time-format'), require('d3-fetch'));

export const defaultOrder = [
  'Trump',
  'Walsh',
  'Weld',
  'Biden',
  'Sanders',
  'Warren',
  'Klobuchar',
  'Bloomberg',
  'Buttigieg',
  'Yang',
  'Gabbard',
  'Steyer',
  'Patrick',
  'Bennet',
  'Delaney',
  'Booker',
  'Harris',
  'Castro',
  'Williamson',
];

export const candColors = {
  'NO RESULTS': 'elex-lightest-gray',
  'NO POLLING PLACES': 'elex-light-gray',
  Biden: 'elex-blue',
  Sanders: 'elex-yellow',
  Buttigieg: 'elex-green',
  Warren: 'elex-orange',
  Klobuchar: 'elex-purple',
  Yang: 'elex-light-blue',
  Patrick: 'elex-light-blue',
  Bennet: 'elex-light-blue',
  Delaney: 'elex-light-blue',
  Gabbard: 'elex-light-blue',
  Booker: 'elex-light-blue',
  Harris: 'elex-light-blue',
  Castro: 'elex-light-blue',
  Williamson: 'elex-light-blue',
  Steyer: 'elex-teal',
  Uncommitted: 'elex-gray',
  Bloomberg: 'elex-magenta',
  Trump: 'elex-orange',
  Weld: 'elex-yellow',
  Walsh: 'elex-red',
  'Other-dem': 'elex-light-blue',
  'Other-rep': 'elex-light-red',
  'Write-ins-dem': 'elex-light-blue',
  'Write-ins-rep': 'elex-light-red',
};

export const hasPhoto = {
  Biden: true,
  Sanders: true,
  Buttigieg: true,
  Warren: true,
  Klobuchar: true,
  Yang: true,
  Patrick: true,
  Bennet: true,
  Delaney: true,
  Gabbard: true,
  Booker: true,
  Harris: true,
  Castro: true,
  Williamson: true,
  Steyer: true,
  Bloomberg: true,
  Trump: true,
  Weld: true,
  Walsh: true,
};

// these should be rgb because the winner view converts to rgba
export const colors = {
  'elex-purple': 'rgb(127, 97, 201)',
  'elex-yellow': 'rgb(255, 210, 3)',
  'elex-green': 'rgb(114, 191, 46)',
  'elex-turqoise': 'rgb(0, 175, 189)',
  'elex-orange': 'rgb(249, 136, 0)',
  'elex-blue': 'rgb(33, 142, 205)',
  'elex-light-blue': 'rgb(219, 241, 255)',
  'elex-red': 'rgb(234, 33, 52)',
  'elex-maroon': 'rgb(185, 0, 0)',
  'elex-magenta': 'rgb(193,43,111)',
  'elex-teal': 'rgb(0,178,148)',
  white: 'rgb(255, 255, 255)',
  'elex-gray': 'rgb(147, 149, 152)',
  'elex-lightest-gray': 'rgb(239,239,239)',
  'elex-light-gray': 'rgb(199, 199, 199)',
  'elex-light-red': '#fde1dc',
};

export function getCandidateColor(lastName, party) {
  let colorKey = candColors[lastName];

  if (!colorKey) {
    colorKey = candColors[`Other-${party}`];
  }

  return colors[colorKey];
}

//Add leading zeros to integers and return them as strings.
export function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

//Round a number to a specified decimal place
export function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export function formatTimeStamp(ts) {
  var dt = new Date(ts);

  dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);

  var offset = -240; //Timezone offset for EST in minutes.
  var estDate = new Date(dt.getTime() + offset * 60 * 1000);

  let date = d3.timeFormat('%b. %e')(estDate);
  let time = d3.timeFormat('%-I:%M %p')(estDate);

  return `<span class="updated">Updated</span> ${date}, <span class='time-here'>${time} ET</span> `;
}

export function shortTime(ts) {
  var dt = new Date(ts);

  dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);

  var offset = -240; //Timezone offset for EST in minutes.
  var estDate = new Date(dt.getTime() + offset * 60 * 1000);

  let time = d3.timeFormat('%-I:%M %p')(estDate);

  return time;
}

export function lpad(n) {
  let s = n.toString();
  if (s.length === 1) {
    return '0' + s;
  } else {
    return s;
  }
}

export function getQueries(arr) {
  let queryVals = {};

  arr.forEach((query) => {
    queryVals[query] = checkParam(query) ? checkParam(query) : null;
  });

  return queryVals;
}

export function checkParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function updateParam(key, val) {
  let newUrl = getNewUrl(key, val);

  if (history.pushState) {
    window.history.pushState(
      {
        path: newUrl,
      },
      '',
      newUrl
    );
  }
}

export function getNewUrl(key, value, baseOnly) {
  let uri = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;

  if (baseOnly == true) {
    uri = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }

  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  var separator = uri.indexOf('?') !== -1 ? '&' : '?';

  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return uri + separator + key + '=' + value;
  }
}

export function sortAll(resultsData) {
  Object.keys(resultsData.results).forEach((st) => {
    Object.keys(resultsData.results[st]).forEach((geoid) => {
      Object.keys(resultsData.results[st][geoid]).forEach((party) => {
        resultsData.results[st][geoid][party].candidates.sort((a, b) => {
          return b['P'] - a['P'];
        });
      });
    });
  });

  return resultsData;
}

export function checkPollClose(fips, raceKey, raceMeta) {
  /* ========================= */
  /* CHECK IF POLLS ARE CLOSED */
  /* ∨-------∨-------∨------- */
  let pollsAreClosed = true;
  if (raceMeta && raceMeta[fips] && raceMeta[fips][raceKey]) {
    pollsAreClosed = raceMeta[fips][raceKey].pollsAreClosed;
  }
  /* ========================= */

  return pollsAreClosed;
}

export async function dynamicImport(path) {
  let jsonFile = await d3.json(`${path}`).then((data) => {
    return data;
  });

  return jsonFile;
}

export function getZeros(origData) {
  let string = JSON.stringify(origData);
  let zerosData = JSON.parse(string);

  Object.keys(zerosData.results).forEach((stfips) => {
    let stateObj = zerosData.results[stfips];

    Object.keys(stateObj['0']).forEach((raceKey) => {
      stateObj['0'][raceKey].candidates.forEach((d) => {
        Object.keys(d['Q']).forEach((qKey) => {
          d['Q'][qKey] = 0;
        });
      });
    });

    Object.keys(stateObj).forEach((cofips) => {
      let countyData = stateObj[cofips];

      Object.keys(countyData).forEach((raceKey) => {
        let raceData = countyData[raceKey];

        raceData.totals['P'] = 0;
        raceData.precincts['pRep'] = 0;

        raceData.candidates.forEach((d) => {
          d['P'] = 0;
        });
      });
    });
  });

  zerosData.raceCalls = {};

  console.log(JSON.stringify(zerosData));
}
