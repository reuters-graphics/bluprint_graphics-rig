const d3 = Object.assign(
  {},
  require('d3-selection'),
  require('d3-collection'),
  require('d3-array'),
  require('d3-format'),
  require('d3-scale')
);

import * as elexUtils from './trElex-utils.js';
import statestyle from '../static/data/statestyle.json';

export default class makeTable {
  constructor(opts) {
    Object.assign(this, opts);

    this.appendElements();
    this.update();
  }

  update() {
    this._setDimensions();
    this._setData();
    this.render();
  }

  _setData() {
    /* CREATE STATE LOOKUPS BY EDISON ID and POSTAL */
    this.edisLookup = {};
    this.postalLookup = {};
    Object.keys(this.activeStates).forEach((fips) => {
      let obj = this.activeStates[fips];
      this.edisLookup[obj.stEdis] = obj;
      this.postalLookup[obj.postal] = obj;
    });

    this.statestyle = {};
    statestyle.forEach((d) => {
      this.statestyle[d.postal] = d;
    });

    /* CREATE OBJECT TO HOLD OUR CANDIDATE VALUES */
    this.candSummary = {};

    /* LOOP THROUGH EACH STATE TO GET PREVIOUS DELEGATE TOTALS BY CANDIDATE */
    /* EXCLUDES DELEGATES EARNED DURING CURRENT EVENT */
    this.dels[0].parties.forEach((p) => {
      p.states.forEach((d) => {
        let today = this.edisLookup[d.st] ? true : false;

        d.candidates.forEach((c) => {
          let last = this.data.candidates[c.cId]
            ? this.data.candidates[c.cId][2]
            : null;

          if (!last) {
            return true;
          }

          if (!this.candSummary[last]) {
            this.candSummary[last] = {
              cId: c.cId,
              today: 0,
              previous: 0,
            };
          }

          if (!today) {
            this.candSummary[last].previous += c.dTot;
          }
        });
      });
    });

    /* LOOP THROUGH TODAY'S RESULTS */
    Object.keys(this.data.results).forEach((fips) => {
      let stateObj = this.data.results[fips][0];
      let stateName = this.activeStates[fips].postal;

      Object.keys(stateObj).forEach((key) => {
        let raceObj = stateObj[key];

        raceObj.candidates.forEach((d) => {
          let last = this.data.candidates[d.cId][2];
          let dels = d['Q'] ? d['Q'].tot : 0;

          if (!this.candSummary[last]) {
            this.candSummary[last] = {
              cId: d.cId,
              today: 0,
              previous: 0,
            };
          }

          this.candSummary[last].today += dels;
          this.candSummary[last][stateName] = dels;
        });
      });
    });

    this.series = [];

    Object.keys(this.candSummary).forEach((last) => {
      if (!last || this.activeCandidates.indexOf(last) < 0) {
        delete this.candSummary[last];
      }
    });

    let sortedStates = [];
    Object.keys(this.activeStates).forEach((fips) => {
      let stObj = this.activeStates[fips];
      sortedStates.push(stObj);
    });

    sortedStates = sortedStates.sort((a, b) => {
      return a.sort - b.sort;
    });

    let arr = ['today'];

    sortedStates.forEach((d) => {
      let st = d.postal;
      arr.push(st);
    });

    arr = arr.concat(['previous', 'total']);

    arr.forEach((d) => {
      let obj = {
        id: d,
        values: this.candSummary,
      };

      this.series.push(obj);
    });
  }

  _setDimensions() {
    //Set SVG dimensions for the bars.
    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    this.width =
      this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height =
      this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  getCandidateName(candObj) {
    let candFirst = candObj ? candObj[0] : '';
    let candLast = candObj ? candObj[2] : 'Other';
    let nameString = `${candFirst} ${candLast}`;

    return nameString.trim();
  }

  appendElements() {
    //ONLY GETS FIRED ON LOAD

    this.wrapper = d3.select(this.element).classed('del-chart', true);

    let rowNames = {
      today: this.dateString,
      previous: 'Previous',
      total: 'Total',
    };

    this.columns = [
      {
        head: '',
        class: 'row-name',
        tdWrite: (d, elem) => {
          let str = rowNames[d.id] ? rowNames[d.id] : d.id;
          str = this.postalLookup[d.id] ? this.statestyle[d.id].name : str;

          str = d.id === 'DC' ? 'Washington, D.C.' : str;

          d3.select(elem).html(str);
        },
      },
    ];

    this.activeCandidates.forEach((last) => {
      let pseudo = d3.select(document.createElement('div'));
      let slug = slugify(last);
      let color = elexUtils.getCandidateColor(last, this.party);

      pseudo
        .append('span')
        .attr('class', `img ${slug}`)
        .style('background-color', color)
        .append('img')
        .attr('src', `./img/bw/${slug}-hz.png`);

      pseudo.append('span').attr('class', 'name').html(last);

      let markup = d3.select(pseudo.node()).html();

      let col = {
        head: markup,
        class: 'td-val',
        tdWrite: (d, elem) => {
          let slug = slugify(last);
          let dels = d.values[last][d.id];

          if (d.id === 'total') {
            dels = d.values[last]['today'] + d.values[last]['previous'];
          }

          dels = dels == 0 ? '-' : d3.format(',')(dels);

          d3.select(elem).html(dels);
        },
      };

      this.columns.push(col);
    });
  }

  render() {
    this.wrapper.html('');
    this.table = this.wrapper.append('table').attr('class', 'table');

    this.tableHead = this.table.append('thead').append('tr');
    this.tableBody = this.table.append('tbody');

    let cols = this.columns;

    // if (this.element.offsetWidth <= 400) {
    //     cols = this.columns.length > 5 ? this.columns.slice(0, -1) : cols;
    // }

    this.th = this.tableHead.selectAll('th').data(cols);

    this.th
      .enter()
      .append('th')
      .attr('class', (d) => d.class)
      .merge(this.th)
      .each((d, i, e) => {
        let elem = e[i];
        d3.select(e[i]).html(d.head);
      });

    this.tr = this.tableBody.selectAll('tr').data(this.series, (d) => {
      return d.id;
    });

    this.tr
      .enter()
      .append('tr')
      .attr('class', (d, i) => {
        return `table-tr tr-${i} tr-${d.id}`;
      })
      .classed('state', (d) => {
        return this.postalLookup[d.id] ? true : false;
      })
      .merge(this.tr)
      .selectAll('td')
      .data((row, i) => {
        return cols.map((col) => {
          var cell = {
            data: row,
            index: i,
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
        return cols[i].class;
      })
      .each((d, i, e) => {
        let elem = e[i];
        cols[i].tdWrite(d.data, elem, d.index); //Write td content here
      });
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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
