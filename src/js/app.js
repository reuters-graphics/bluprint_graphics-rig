/* ================================== */
/* CUSTOMIZE PROJECT HERE */
/* ================================== */

import activeStates from './config-2020-06-23.js';

let config = {
  title: 'June 23 contests',
  embedTitle: 'June 23 contests',
  stateFips: '36',
  active: activeStates['36'],
  party: 'dem',
  dateString: 'June 23rd',
  subhead: 'Live primary and caucus results | June 23, 2020',
  pollsClose: 'First polls close at 7:00 PM ET',
  //dataUrl: "./data/output_20200602_zeros.json",
  dataUrl:
    '//graphics.thomsonreuters.com/2020-US-elex/20200623/output_20200623.json',
  delsUrl:
    '//graphics.thomsonreuters.com/2020-US-elex/2020Primaries/2020Primaries_delNatSum.json',
  isLive: true,
};

/* ================================== */

import '../scss/main.scss';

import { t } from 'ttag';

const isEmbedded = window.location !== window.parent.location;

const d3 = Object.assign(
  {},
  require('d3-selection'),
  require('d3-time-format'),
  require('d3-fetch'),
  require('d3-timer'),
  require('d3-format')
);

const debounce = require('debounce');

import trElex from './trElex.js';
import makeTimer from './trElex-timer.js';
import makeGrid from './trElex-grid.js';
import makeDels from './trElex-dels.js';
import Choices from 'choices.js';

import taskbar from './templates/trElex-taskbar.ejs';
import header from './templates/trElex-header.ejs';
import headerEmbed from './templates/trElex-headerEmbed.ejs';
import stateRace from './templates/trElex-nationalRaces.ejs';
import counter from './templates/trElex-counter.ejs';
import dropdown from './templates/trElex-dropdown.ejs';
import elexRelated from './templates/trElex-related.ejs';
// import arrowIMG from './static/img/dropdown-arrow.png';

let theCharts = [];
let windowWidth = window.innerWidth;

/* ==================== */
/* QUERY STRING LOGIC */
/* ==================== */

let queryStrings = [
  'party',
  'debug',
  'screenshot',
  'state',
  'tableOnly',
  'delegatesOnly',
  'homepage',
  'stateOnly',
];

let qVals = trElex.elexUtils.getQueries(queryStrings);

let loadOnState = null;

let hasEmbedTag = d3.select('.container').classed('embed');

/* ==================== */
/* GLOBAL ELEMENTS */
/* ==================== */

let theTimer, theDropdown, theMap, theTable, theSelect, theDels;
let statesLookup = {};

function setQueries() {
  config.party = qVals.party === 'rep' ? 'rep' : 'dem';

  Object.keys(activeStates).forEach((fips) => {
    let obj = activeStates[fips];
    statesLookup[obj.postal] = fips;
  });

  if (qVals.tableOnly && qVals.tableOnly === 'true') {
    d3.selectAll('.container').classed('table-only', true);
  }

  if (qVals.delegatesOnly && qVals.delegatesOnly === 'true') {
    d3.selectAll('.container').classed('dels-only', true);
  }

  if (qVals.stateOnly && qVals.stateOnly === 'true') {
    d3.selectAll('.container').classed('state-only', true);
  }

  if (qVals.party && qVals.party === 'rep') {
    d3.selectAll('.container').classed('rep', true);
  }

  if (qVals.screenshot && qVals.screenshot === 'true') {
    d3.selectAll('.container').classed('screenshot', true);
    if (qVals.tableOnly && qVals.tableOnly === 'true') {
      // d3.select('.graphic-title').html('Super Tuesday')
    }
  }

  if (qVals.homepage && qVals.homepage === 'true') {
    d3.selectAll('.container').classed('homepage', true);
  }
}

function init() {
  setQueries();

  if (
    (qVals.tableOnly && qVals.tableOnly == 'true') ||
    (qVals.delegatesOnly && qVals.delegatesOnly == 'true') ||
    hasEmbedTag
  ) {
    d3.select('.row.header').html(
      headerEmbed({
        config: config,
      })
    );
  } else {
    d3.select('.row.header').html(
      header({
        config: config,
      })
    );
  }

  /* ================ */
  /* ELECTION RELATED */
  /* ================ */

  d3.json('//d3sl9l9bcxfb5q.cloudfront.net/json/al-2020-related').then(
    (data) => {
      d3.select('#related-links-container').html(
        elexRelated({
          text: data,
        })
      );
    }
  );

  /* ================ */
  /* TIMER */
  /* ================ */

  theTimer = new makeTimer({
    element: '.counter',
    length: 30,
    speed: 1000,
    onZero: () => {
      theTimer.timer.stop();
      theTimer.runTimer();
      getNewData();
    },
  });

  getNewData();
  theTimer.runTimer();
}

/* ==================== */
/* DATA FETCHER */
/* ==================== */

function getNewData() {
  let cache = new Date().getTime();

  Promise.all([
    d3.json(`${config.dataUrl}?cache=${cache}`),
    d3.json(`${config.delsUrl}?cache=${cache}`),
    //d3.json("//graphics.thomsonreuters.com/2020-US-elex/20200602EndOfNight/output_20200602EndOfNight.json")
  ]).then(([resultsData, delsData]) => {
    //console.log(JSON.stringify(test.raceMeta));

    // delete resultsData.results['39'];
    // delete resultsData.raceMeta['10'];
    // delete activeStates['39'];

    // trElex.elexUtils.getZeros(resultsData);

    if (qVals.debug === 'true') {
      console.log(resultsData);
    }

    //If charts don't exist yet, make them.
    if (theCharts.length === 0) {
      main(resultsData, delsData);
    } else {
      updateCharts(resultsData, delsData);
    }
  });
}

function loadTemplates(resultsData) {
  let pKeys = {
    D: 'dem',
    R: 'rep',
    E: 'dem',
  };

  Object.keys(resultsData.raceMeta).forEach((fips) => {
    let stateObj = resultsData.raceMeta[fips];

    Object.keys(stateObj).forEach((raceKey) => {
      let party = pKeys[raceKey];
      let d = stateObj[raceKey];

      let shortTime = trElex.elexUtils.shortTime(d.pollClose);

      if (raceKey === 'P') {
        return true;
      }

      activeStates[fips][`${party}Display`] = d.name;
      activeStates[fips][`${party}Key`] = raceKey;
      activeStates[fips]['pollsClose'] = shortTime;
      activeStates[fips]['state'] = d.state;
      activeStates[fips]['postal'] = d.postal;
      activeStates[fips][`${party}Dels`] = d.numNatConvDelg;
    });
  });

  if (qVals.state) {
    let val = qVals.state;
    let fips = statesLookup[val];

    if (statesLookup[val] && activeStates[fips][`${config.party}Key`]) {
      config.active = activeStates[fips];
      config.stateFips = fips;
      config.loadOnState = true;
    }
  }

  /* ================ */
  /* LOAD TEMPLATES */
  /* ================ */

  d3.select('#taskbar-container').html(
    taskbar({
      active: 'none', //CHOICES: 'results', 'calendar', 'running', or 'issues'
    })
  );

  console.log(config);
  d3.select('.main').html(
    stateRace({
      config: config,
    })
  );

  console.log(config.active);

  d3.select('.counter-div').html(
    counter({
      config: config,
    })
  );

  if (qVals.delegatesOnly && qVals.delegatesOnly === 'true') {
    d3.selectAll('.graphic-title').html(`${config.dateString} delegate totals`);
  }

  /* ================= */
  /* SET DROPDOWN MENU */
  /* ================= */

  let selectSeries = [];

  Object.keys(activeStates).forEach((fips) => {
    let obj = activeStates[fips];
    obj.fips = fips;
    obj.value = obj.fips;
    obj.label = obj.state;
    selectSeries.push(obj);
  });

  selectSeries = selectSeries
    .sort((a, b) => {
      return a.sort - b.sort;
    })
    .filter((d) => {
      return d[`${config.party}Key`];
    });

  d3.select('.dropdown-row').html(dropdown());

  theSelect = d3.select('.dropdown-row select');

  theSelect.on('change', (d, i, e) => {
    var fips = d3.select(e[i]).node().value;
    updateView(fips, 'dropdown');
  });

  //creates a non-native dropdown using choices.js
  theDropdown = new Choices(theSelect.node(), {
    choices: selectSeries,
    searchEnabled: false,
    itemSelectText: '',
  });

  d3.select('.choices__inner').style(
    'background',
    'url("./img/dropdown-arrow.png") no-repeat right content-box'
  );

  /* ================= */

  /* ================= */
  /* FURNITURE INTERACTIONS */
  /* ================= */

  d3.selectAll('.refer').on('click', (d, i, e) => {
    let newUrl = `https://graphics.reuters.com/USA-ELECTION-RESULTS-LIVE-MARCH-10/0100B5JD3YE/`;
    window.open(`${newUrl}?party=${config.party}`, '_blank');
  });

  d3.selectAll('.party-toggle span')
    .each((d, i, e) => {
      let val = d3.select(e[i]).attr('val');
      if (val === config.party) {
        d3.select(e[i]).classed('active', true);
      }
    })
    .on('click', (d, i, e) => {
      let val = d3.select(e[i]).attr('val');
      let newUrl = trElex.elexUtils.getNewUrl('party', val);
      window.open(newUrl, '_self');
    });

  if (qVals.stateOnly && qVals.stateOnly === 'true') {
    let raceName = activeStates[config.stateFips][`${config.party}Display`];
    let state = activeStates[config.stateFips].state;

    d3.select('.graphic-title').html(`${state} ${raceName}`);
  }
}

function main(resultsData, delsData) {
  loadTemplates(resultsData);

  let raceName = activeStates[config.stateFips][`${config.party}Key`];

  let activeCandidates = {
    dem: ['Biden', 'Sanders'],
    rep: ['Trump', 'Weld'],
  };

  if (!qVals.delegatesOnly && qVals.delegatesOnly !== 'true') {
    const theGrid = new makeGrid({
      element: document.querySelector('.chart-grid'),
      activeStates: activeStates,
      activeCandidates: activeCandidates[config.party],
      data: resultsData,
      party: config.party,
      isLive: config.isLive,
      onClick: (d) => {
        if (d3.select('.container').classed('embed')) {
          let st = activeStates[d.fips].postal
            ? activeStates[d.fips].postal
            : null;
          let newUrl = trElex.elexUtils
            .getNewUrl('state', st, true)
            .replace('embed.html', '');
          window.open(newUrl, '_blank');
        }

        updateView(d.fips, 'grid');
        scrollToState();
      },
    });

    theCharts.push(theGrid);
  }

  if (
    !qVals.tableOnly &&
    qVals.tableOnly !== 'true' &&
    !qVals.delegatesOnly &&
    qVals.delegatesOnly !== 'true'
  ) {
    theTable = new trElex.makeTable({
      element: document.querySelector('.chart-table'),
      data: resultsData,
      stateFips: config.stateFips,
      limit: 8,
      delColumn: true,
      voteColumns: ['P'],
      raceName: raceName,
      tableExpand: qVals.tableExpand,
      party: config.party,
      callback: (stfips) => {
        let d = activeStates[stfips];
        d3.select('.table-col h4').html(d.demDisplay);
      },
    });

    theMap = new trElex.makeMap({
      element: document.querySelector('.chart-map'),
      data: resultsData,
      raceName: activeStates[config.stateFips][`${config.party}Key`],
      stateFips: config.stateFips,
      aspectHeight: activeStates[config.stateFips].aspectHeight,
      smAspectHeight: activeStates[config.stateFips].smAspectHeight,
      party: config.party,
      maptype: activeStates[config.stateFips].maptype,
    });

    // theSelect.property("value", config.stateFips);
    //you have to set the dropdown value this way with choices.js
    theDropdown.setChoiceByValue(config.stateFips);
    theCharts.push(theTable, theMap);
  }

  if (!qVals.tableOnly && qVals.tableOnly !== 'true') {
    theDels = new makeDels({
      element: document.querySelector('.chart-del'),
      data: resultsData,
      dels: delsData,
      activeStates: activeStates,
      activeCandidates: activeCandidates[config.party],
      dateString: config.dateString,
    });

    theCharts.push(theDels);
  }

  theSelect.property('value', config.stateFips);

  d3.select('.party-btn span').html(() => {
    return config.party === 'rep'
      ? 'See Democratic results'
      : 'See Republican results';
  });

  d3.select('.party-btn')
    .attr('val', config.party)
    .on('click', (d, i, e) => {
      let party = config.party === 'dem' ? 'rep' : 'dem';
      let newUrl = trElex.elexUtils.getNewUrl('party', party);
      window.open(newUrl, '_self');
    });

  // if (config.loadOnState) {
  //     scrollToState(0);
  // }

  updateTimeStamp(resultsData);
}

function updateView(fips, source) {
  //trElex.elexUtils.updateParam('state', activeStates[fips].postal);

  let meta = activeStates[fips];

  if (source === 'grid') {
    // theSelect.property("value", fips);
    //you have to set the dropdown value this way with choices.js
    theDropdown.setChoiceByValue(fips);
  } else if (source === 'party-btn') {
    theTable.party = config.party;
    theMap.party = config.party;
  }

  theTable.raceName = activeStates[fips][`${config.party}Key`];
  theTable.stateFips = fips;
  theTable.update();

  let raceName = meta[`${config.party}Display`];
  let dels = meta[`${config.party}Dels`];

  d3.select('.party-head .race-name').html(raceName);
  d3.select('.party-head .delegates').html(`${dels} delegates`);

  if (!meta.maptype) {
    d3.select('.results-map').style('display', 'none');
  } else {
    d3.select('.results-map').style('display', 'block');
    theMap.maptype = meta.maptype;
    theMap.raceName = activeStates[fips][`${config.party}Key`];
    theMap.aspectHeight = activeStates[fips].aspectHeight;
    theMap.smAspectHeight = activeStates[fips].smAspectHeight;
    theMap.update(fips);
  }

  if (meta.note) {
    d3.select('.table-col .note').html(`Note: ${meta.note}`);
  } else {
    d3.select('.table-col .note').html('');
  }
}

function scrollToState() {
  let pos = cumulativeOffset('.dropdown-row');

  window.scrollTo({
    top: pos.top,
    left: 0,
    behavior: 'smooth',
  });
}

/* ==================== */
/* UPDATE LOGIC */
/* ==================== */

function updateCharts(resultsData, delsData) {
  theCharts.forEach((chart) => {
    if (resultsData) {
      chart.data = resultsData;
    }

    chart.update();
  });

  if (resultsData) {
    updateTimeStamp(resultsData);
    theTimer.runTimer();
  }

  windowWidth = window.innerWidth;
}

// function updateTimeStamp(resultsData) {
//     let time = trElex.elexUtils.formatTimeStamp(resultsData.ts);

//     //d3.selectAll(".pulse-container").style("display", "none");
//     //d3.selectAll(".timestamp").html(config.pollsClose);
//     d3.selectAll(".timestamp").html(time);
// }

function updateTimeStamp(resultsData) {
  let time = trElex.elexUtils.formatTimeStamp(resultsData.ts);

  //FOR BEFORE THE RACE STARTS
  //If settings are NOT set to `isLive`, hide the counter and display the poll closing.
  if (!config.isLive) {
    d3.selectAll('.timestamp').html(config.pollsClose);
    d3.selectAll('.pulse-container').style('display', 'none');
  } else {
    d3.selectAll('.timestamp').html(time);
  }
}

/* ==================== */
/* RESIZE LOGIC */
/* ==================== */

window.onresize = debounce(resize, 200);

function resize(e) {
  if (windowWidth !== window.innerWidth) {
    windowWidth = window.innerWidth;
    updateCharts(null);
  }
}

init();

var cumulativeOffset = function (sel) {
  let element = document.querySelector(sel);

  var top = 0,
    left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left,
  };
};

// We're in an iframe
if (isEmbedded) {
  window.childFrame.sendHeight();
}
