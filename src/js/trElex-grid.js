const d3 = Object.assign(
  {},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-array'),
  require('d3-axis'),
  require('d3-format'),
  require('d3-collection')
);

import statestyle from '../static/data/statestyle.json';
import * as elexUtils from './trElex-utils.js';

export default class makeGrid {
  constructor(opts) {
    Object.assign(this, opts);

    this.statestyle = {};
    statestyle.forEach((d) => {
      let fips = elexUtils.pad(d.fips, 2);
      this.statestyle[fips] = d;
    });

    this._setData();
    this.appendElements();
    this._setDimensions();

    this.drawTable();
  }

  _setData() {
    let candLookup = {};

    this.candByState = {};
    this.stateMeta = {};
    this.sortedStates = [];
    this.series = [];

    //Lookup cId by last name for ease of use.
    Object.keys(this.data.candidates).forEach((cId) => {
      let last = this.data.candidates[cId][2];
      candLookup[last] = cId;
    });

    //Put active states object in an array
    Object.keys(this.activeStates).forEach((fips) => {
      let obj = this.activeStates[fips];
      this.sortedStates.push(obj);
    });

    //Order states by `sort`` property (poll close)
    this.sortedStates = this.sortedStates.filter((d) => {
      let dels = d[`${this.party}Dels`];
      return +dels > 0;
    });

    this.sortedStates = this.sortedStates.sort((a, b) => {
      return a.sort - b.sort;
    });

    Object.keys(this.data.results).forEach((fips) => {
      if (!this.stateMeta[fips]) {
        this.stateMeta[fips] = {};
      }

      let raceKey = this.activeStates[fips][`${this.party}Key`];

      if (!raceKey) {
        return true;
      }

      let raceData = this.data.results[fips][0][raceKey];
      let voteTotal = raceData.totals['P'];
      let raceCall =
        this.data.raceCalls[fips] && this.data.raceCalls[fips][raceKey]
          ? this.data.raceCalls[fips][raceKey]
          : null;

      this.stateMeta[fips].voteTotal = voteTotal;

      //precincts
      let pRep = raceData.precincts.pRep;
      let pTot = raceData.precincts.pTot;
      let pctReporting = pRep === 0 ? '0%' : d3.format('.0%')(pRep / pTot);

      this.stateMeta[fips].pRep = pRep;
      this.stateMeta[fips].pTot = pTot;
      this.stateMeta[fips].pctReporting = pctReporting;
      this.stateMeta[fips].pctExpVote = raceData.precincts.pctExpVote;

      //Filter out candidates not in our array.
      let cands = raceData.candidates.filter((d) => {
        let cId = d.cId;
        let last = this.data.candidates[cId][2];
        return this.activeCandidates.indexOf(last) > -1;
      });

      /* ========================= */
      /* CHECK IF POLLS ARE CLOSED */
      /* ∨-------∨-------∨------- */
      let pollsAreClosed = elexUtils.checkPollClose(
        fips,
        raceKey,
        this.data.raceMeta
      );
      /* ========================= */

      //Build lookup for candidate results by state
      cands.forEach((d, i) => {
        let cId = d.cId;

        if (!this.candByState[cId]) {
          this.candByState[cId] = {};
        }

        if (raceCall && raceCall.status === 'W' && raceCall.leadCand === cId) {
          d.winner = true;

          /* ========================= */
          /* ONLY SHOW WINNER IF POLLS ARE CLOSED */
          /* ∨-------∨-------∨------- */
          //d.winner = pollsAreClosed ? true : false;
          /* ========================= */
        } else if (i === 0) {
          d.leader = true;
        }

        this.candByState[cId][fips] = d;
      });
    });

    this.candidateIDs = [];

    //Finally, put it all in an arry so we can draw our table.
    this.activeCandidates.forEach((last) => {
      let cId = candLookup[last];

      let obj = {
        cId: cId,
        last: this.data.candidates[cId][2],
        states: {},
      };

      this.sortedStates.forEach((d) => {
        obj.states[d.fips] = this.candByState[cId][d.fips];
      });

      this.series.push(obj);
      this.candidateIDs.push(cId);
    });

    this.transpose();
  }

  transpose() {
    this.transposed = [];

    this.sortedStates.forEach((d) => {
      let obj = {
        fips: d.fips,
        state: d.state,
        candidates: {},
      };

      this.candidateIDs.forEach((cId) => {
        obj.candidates[cId] = this.candByState[cId][d.fips];
      });

      this.transposed.push(obj);
    });
  }

  update() {
    this._setData();
    this._setDimensions();
    this.drawTable();
  }

  _setDimensions() {
    this.isSmall = this.element.offsetWidth <= 780;
    this.verticalTable = this.element.offsetWidth <= 620;
    this.isXSmall = false;
  }

  appendElements() {
    //ONLY GETS FIRED ON LOAD

    this.wrapper = d3.select(this.element).classed('tr-elex-grid', true);

    /* HORIZONTAL TABLE LAYOUT */
    /* ~~~~~~~~~~~~~~~~~~~~~~~ */

    //FIRST COLUMN: CAND NAME
    this.lgColumns = [
      {
        head: `<div class='grid-key'><img src='./img/key-hash.png'/><span>Lead/Win</span></div>`,
        class: 'row-name cand',
        tdWrite: (d, elem) => {
          this.rowName(d, elem);
        },
      },
    ];

    //OTHER COLUMNS: STATE NAMES
    this.sortedStates.forEach((d) => {
      let obj = {
        head: () => {
          let sface = this.statestyle[d.fips]
            ? this.statestyle[d.fips].stateface
            : '';
          let string = this.statestyle[d.fips]
            ? this.statestyle[d.fips].ap
            : null;
          let markup = string
            ? `<span class='stateface'>${sface}</span>${string}`
            : d.postal;
          return markup;
        },
        class: `state-col state-col-${d.postal}`,
        fips: d.fips,
        tdWrite: (d, elem) => {
          this.writeStateCol(d, elem);
        },
      };

      this.lgColumns.push(obj);
    });

    /* VERTICAL TABLE LAYOUT */
    /* ~~~~~~~~~~~~~~~~~~~~~~~ */

    //FIRST COLUMN: STATE NAME
    this.smColumns = [
      {
        head: `<div class='grid-key'><img src='./img/key-hash.png'/><span>Lead/Win</span></div>`,
        class: 'row-name state',
        tdWrite: (d, elem) => {
          let ap = this.statestyle[d.fips].name;
          let dels = this.activeStates[d.fips][`${this.party}Dels`];

          let sface = this.statestyle[d.fips].stateface;
          let string = this.statestyle[d.fips] ? `<span>${ap}</span>` : ap;

          //let markup =    `<span class='name'>${}</span>`;
          //`<span class='dels'>${dels} dels.</span>`;

          d3.select(elem).html(string);
        },
      },
    ];

    let candIds = Object.keys(this.candByState).sort((a, b) => {
      let aLast = this.data.candidates[a][2];
      let bLast = this.data.candidates[b][2];

      let aPos = this.activeCandidates.indexOf(aLast);
      let bPos = this.activeCandidates.indexOf(bLast);

      return aPos - bPos;
    });

    //OTHER COLUMNS: CAND NAMES
    candIds.forEach((cId) => {
      let d = this.candByState[cId];
      let last = this.data.candidates[cId][2];
      let slug = slugify(last);
      let color = elexUtils.getCandidateColor(last, this.party);
      let pseudo = d3.select(document.createElement('div'));

      pseudo
        .append('span')
        .attr('class', `img ${slug}`)
        .style('background-color', color)
        .append('img')
        .attr('src', `./img/bw/${slug}-hz.png`);

      pseudo.append('div').attr('class', 'name').html(last);

      let markup = d3.select(pseudo.node()).html();

      let obj = {
        head: markup,
        cId: cId,
        class: `state-col state-col-${slug}`,
        tdWrite: (d, elem) => {
          this.writeStateCol(d, elem);
        },
      };

      this.smColumns.push(obj);
    });
  }

  drawTable() {
    this.wrapper
      .html('')
      .classed('grid-chart', true)
      .classed('sm', this.isSmall)
      .classed('vertical-table', this.verticalTable);

    this.table = this.wrapper.append('table').classed('table', true);

    this.tableHead = this.table.append('thead').append('tr');
    this.tableBody = this.table.append('tbody');

    let colArray = this.verticalTable ? this.smColumns : this.lgColumns;
    let rowArray = this.verticalTable ? this.transposed : this.series;
    let rowKey = this.verticalTable ? 'cId' : 'fips';

    // if (this.element.offsetWidth <= 400) {
    //     colArray = colArray.length > 5 ? colArray.slice(0, -1) : colArray;
    // }

    this.th = this.tableHead.selectAll('th').data(colArray);

    this.th
      .enter()
      .append('th')
      .attr('class', (d) => d.class)
      .merge(this.th)
      .each((d, i, e) => {
        d3.select(e[i]).html(d.head);
      })
      .on('click', (d) => {
        if (!this.verticalTable) {
          this.onClick(d);
        }
      });

    this.tr = this.tableBody.selectAll('tr').data(rowArray, (d) => {
      return d[rowKey];
    });

    this.tr
      .enter()
      .append('tr')
      .attr('class', (d, i) => {
        let name = this.verticalTable ? d.state : d.last;
        let slug = slugify(name);
        return `table-tr tr-${i} ${slug}`;
      })
      .merge(this.tr)
      .selectAll('td')
      .data((row, i) => {
        return colArray.map((col) => {
          var cell = {
            data: row,
            index: i,
            cId: this.verticalTable ? col.cId : row.cId,
            fips: this.verticalTable ? row.fips : col.fips,
          };

          d3.keys(col).forEach((key) => {
            cell[key] = col[key];
          });

          return cell;
        });
      })
      .enter()
      .append('td')
      .attr('class', (d, i) => {
        return colArray[i].class;
      })
      .each((d, i, e) => {
        let elem = e[i];
        d.data.fips = d.fips;
        d.data.cId = d.cId;
        colArray[i].tdWrite(d.data, elem, d.index); //Write td content here
      });

    if (this.verticalTable) {
      d3.selectAll('td.row-name').on('click', (d) => {
        this.onClick(d);
      });
    }

    this.addMetaRows();
    this.addPollClose();
  }

  addMetaRows() {
    if (!this.verticalTable) {
      let delRow = this.tableBody.append('tr').attr('class', 'meta dels');

      let repRow = this.tableBody.append('tr').attr('class', 'meta rep');

      delRow
        .append('td')
        .attr('class', 'row-name')
        .html(
          '<span class="lg">Delegates available</span><span class="sm">Delegates avail.</span>'
        );

      repRow
        .append('td')
        .attr('class', 'row-name')
        .html(
          '<span class="lg">Precincts reporting</span><span class="sm">Prec. reporting</span>'
        );

      this.sortedStates.forEach((d) => {
        let dels = d[`${this.party}Dels`];
        let reporting = this.stateMeta[d.fips].pctReporting;

        if (d.state === 'Washington') {
          reporting = `${this.stateMeta[d.fips].pctExpVote}%`;
        }

        delRow.append('td').classed('val', true).html(dels);

        repRow.append('td').classed('val', true).html(reporting);
      });
    }
  }

  rowName(d, elem) {
    let candId = d.cId;
    let candObj = this.data.candidates[candId]
      ? this.data.candidates[candId]
      : null;
    let candDisplay = this.getCandidateName(candObj);

    let candLast = candObj ? candObj[2] : 'Other';
    let color = elexUtils.getCandidateColor(candLast, this.party);
    let slug = slugify(candLast);
    let pseudo = d3.select(document.createElement('div'));

    pseudo
      .append('span')
      .attr('class', `img ${slug}`)
      .style('background-color', color)
      .append('img')
      .attr('src', `./img/bw/${slug}.png`);

    pseudo.append('span').attr('class', 'name').html(candDisplay.trim());

    let markup = d3.select(pseudo.node()).html();

    d3.select(elem).html(markup).classed(slug, true);
  }

  writeStateCol(d, elem) {
    if (!this.verticalTable && !d.states[d.fips]) {
      return true;
    }

    let candObj =
      d.states && d.states[d.fips] ? d.states[d.fips] : d.candidates[d.cId];

    let stateVotes = this.stateMeta[d.fips].voteTotal;
    let candVotes = candObj ? candObj['P'] : 0;
    let percent =
      candVotes === 0 ? '0%' : d3.format('.0%')(candVotes / stateVotes);

    let cId = d.cId;
    let candLast = this.data.candidates[cId][2];
    let pseudo = d3.select(document.createElement('div'));

    let pseudoDiv = pseudo.append('div').classed('text', true).raise();

    let color = elexUtils.getCandidateColor(candLast, this.party);

    if (candObj && candObj.winner) {
      let winnerBgColor = color.replace('rgb(', 'rgba(').replace(')', ', .8)');

      pseudoDiv
        .append('span')
        .html(`<i class="fas fa-check-circle"></i>`)
        .classed('win-check', true);

      d3.select(elem)
        .style('background-color', winnerBgColor)
        .classed('winner', true);
    }

    if (candObj && candObj.leader && candVotes !== 0) {
      d3.select(elem).classed('leader', true);

      let leaderBgColor = color.replace('rgb(', 'rgba(').replace(')', ', .3)');

      pseudo
        .append('div')
        .classed('hash', true)
        .style('background-image', `url("./img/lead-hash.png")`)
        .lower();

      d3.select(elem)
        .style('background-color', leaderBgColor)
        .classed('leader', true);
    }

    pseudoDiv.append('span').attr('class', 'percent').html(percent);

    let markup = d3.select(pseudo.node()).html();

    // if (candVotes == 0 && stateVotes == 0) {
    //     markup = '';
    // }

    d3.select(elem).html(markup);
  }

  addPollClose() {
    let length = this.activeCandidates.length;

    let first = true; //length > 3 ? true : false;

    this.sortedStates.forEach((d) => {
      let stateVotes = this.stateMeta[d.fips].voteTotal;
      let st = this.activeStates[d.fips].postal;
      let state = this.activeStates[d.fips].state;
      let close = `${this.activeStates[d.fips].pollsClose} ET`;

      let closeString = `Polls close at ${close}`;
      let raceKey = this.activeStates[d.fips][`${this.party}Key`];
      let raceCall =
        this.data.raceCalls[d.fips] && this.data.raceCalls[d.fips][raceKey]
          ? this.data.raceCalls[d.fips][raceKey]
          : null;
      let winnerCalled = raceCall && raceCall.status == 'W' ? true : false;

      closeString = first ? closeString : close;

      if (!this.isSmall) {
        closeString = closeString.replace(
          'Polls close at',
          'Polls close at<br/>'
        );
      }

      let pollsAreClosed = elexUtils.checkPollClose(
        d.fips,
        raceKey,
        this.data.raceMeta
      );

      if (st === 'DA') {
        pollsAreClosed = true;
      }

      if (!this.isLive) {
        pollsAreClosed = false;
      }

      if (stateVotes === 0 && !winnerCalled && pollsAreClosed === false) {
        first = false;

        if (!this.verticalTable) {
          for (let i = 1; i <= length; i++) {
            d3.select(`.table-tr.tr-${i} td.state-col-${st}`).remove();
          }

          d3.select(`.table-tr.tr-0 td.state-col-${st}`)
            .html('')
            .classed('poll-close', true)
            .attr('rowspan', length)
            .append('div')
            .html(closeString);
        } else {
          let slug = slugify(state);

          d3.selectAll(`.table-tr.${slug} td.state-col`).remove();

          d3.selectAll(`.table-tr.${slug}`)
            .append('td')
            .attr('colspan', length)
            .classed('poll-close', true)
            .html(closeString);
        }
      }
    });
  }

  getCandidateName(candObj) {
    let candFirst = candObj ? candObj[0] : '';
    let candLast = candObj ? candObj[2] : 'Other';

    //Abbreviate first name to first initial on small screens.
    if (this.isSmall) {
      candFirst = candFirst ? '' : candFirst;
    }

    let nameString = `${candFirst} ${candLast}`;

    return nameString.trim();
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
