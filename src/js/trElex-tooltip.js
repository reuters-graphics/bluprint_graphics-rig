// let d3 = Object.assign({}, require("d3-selection"), require("d3-time-format"));

const d3 = Object.assign({}, require('d3-selection'), require('d3-format'));

import * as elexUtils from './trElex-utils.js';

class setTooltip {
  constructor(opts) {
    Object.assign(this, opts);
    this._setData();
    this.update();
  }

  _setData() {}

  update() {
    this.tt = d3
      .select(this.element)
      .append('div')
      .classed('custom-tooltip', true);
    this.fields = this.tt.selectAll('.tt-update');
    this._setDimensions();
  }

  _setDimensions() {
    this.isMobile = window.innerWidth <= 500 ? true : false;
  }

  getQuad(coords, size) {
    let l = [];

    let ns_threshold = this.isMobile ? 4 : 2;

    if (coords[1] > size[1] / ns_threshold) {
      l.push('s');
    } else {
      l.push('n');
    }

    if (coords[0] > size[0] / 2) {
      l.push('e');
    }

    if (coords[0] < size[0] / 2) {
      l.push('w');
    }

    return l.join('');
  }

  updateFields(d) {
    let countyName = `${d.properties['NAME']}`;

    if (!d.data) {
      this.tt.html(() => {
        return `<div class="tooltip-inner">
                      <span class='county'>${countyName}</span>
                      <span class='reporting'>No polling places</span>
                    </div>`;
      });

      return false;
    }

    let candArr = d.data.candidates;
    let totalVotes = d.data.totals['P'];
    let trows = '';

    candArr = candArr.sort((a, b) => {
      return b['P'] - a['P'];
    });

    if (candArr[0]['P'] == 0) {
      candArr = candArr.sort((a, b) => {
        let aLast = this.candidates[a.cId][2];
        let bLast = this.candidates[b.cId][2];

        let aPos =
          elexUtils.defaultOrder.indexOf(aLast) >= 0
            ? elexUtils.defaultOrder.indexOf(aLast)
            : 999;
        let bPos =
          elexUtils.defaultOrder.indexOf(bLast) >= 0
            ? elexUtils.defaultOrder.indexOf(bLast)
            : 999;

        return aPos - bPos;
      });
    }

    candArr = candArr.filter((d, i) => {
      return i < 4;
    });

    candArr.forEach((c) => {
      let lastName = this.candidates[c.cId][2];
      let votes = d3.format(',')(c['P']);

      let pctVal = c['P'] === 0 ? 0 : c['P'] / totalVotes;
      let pctStr =
        c['P'] === 0
          ? '0.0%'
          : pctVal < 0.01
          ? '<1%'
          : d3.format('.1%')(pctVal);

      let color = this.elexUtils.getCandidateColor(lastName, this.party);
      let finalTD =
        this.raceName === 'Democratic Caucus'
          ? `<td class='votes'>${finalStr}</td>`
          : ``;

      trows += `<tr>
                        <td class='name'>
                            <span class='swatch' style='background-color: ${color}'></span>
                            <span class='name'>${lastName}</span>
                        </td>
                        <td class='votes'>${votes}</td>
                        <td class='pct'>${pctStr}</td>
                    </tr>`;
    });

    let totPrecincts = d3.format(',')(d.data.precincts.pTot);
    let totReporting = d3.format(',')(d.data.precincts.pRep);
    let percentReporting = d3.format('.1%')(
      d.data.precincts.pRep / d.data.precincts.pTot
    );

    if (totReporting === 0) {
      reportingText = '0.0%';
    }

    let reportingText = `${totReporting} of ${totPrecincts} precincts reporting`;

    if (d.properties['STATEFP'] == '53') {
      reportingText = `${d3.format(',')(totalVotes)} total votes`;
    }

    this.tt.html(() => {
      return `<div class="tooltip-inner">
                      <span class='county'>${countyName}</span>
                      <table class='table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th class='votes'>Votes</th>
                                <th class='pct'>Pct.</th>
                            </tr>
                        </thead>
                        <tbody>${trows}</tbody>
                      </table>
                      <span class='reporting'>${reportingText}</span>
                    </div>`;
    });
  }

  getNum(val) {
    val = +val;
    let num = '';

    if (val < 1000) {
      num = `${val}`;
    } else if (val >= 1000 && val < 1000000) {
      num = `${round(val / 1000, 1).toFixed(1)}k`;
    } else if (val >= 1000000 && val < 1000000000) {
      num = `${round(val / 1000000, 1).toFixed(1)}m`;
    } else if (val >= 1000000000) {
      num = `${round(val / 1000000000, 1).toFixed(1)}b`;
    }

    return num;
  }

  position(coords, settings, quad) {
    let region = quad ? quad : this.getQuad(coords, settings);
    this.tt.attr('class', 'custom-tooltip');

    coords[0] = coords[0] > settings[0] ? settings[0] : coords[0];
    coords[1] = coords[1] > settings[1] ? settings[1] : coords[1];

    this.tt
      .classed('tooltip-active', true)
      .classed('tooltip-' + region, true)
      .style('left', coords[0] + 'px')
      .style('top', coords[1] + 'px');
  }

  deposition() {
    this.tt.attr('class', 'custom-tooltip');
  }

  mousePosition(event) {
    let bodyRect = document.body.getBoundingClientRect(),
      elemRect = this.element.getBoundingClientRect(),
      offsetTop = elemRect.top - bodyRect.top,
      offsetLeft = elemRect.left - bodyRect.left;

    //Mouse positions
    let xPos = event.pageX - offsetLeft;
    let yPos = event.pageY - offsetTop;

    return [xPos, yPos];
  }
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default setTooltip;
