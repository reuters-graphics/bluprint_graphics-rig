const d3 = Object.assign({}, require('d3-selection'), require('d3-timer'));

import * as elexUtils from './trElex-utils.js';

export default class makeTimer {
  constructor(opts) {
    Object.assign(this, opts);

    this.counter = d3.selectAll(this.element);

    this.count = this.length;

    this.timer = {
      stop: () => {
        return false;
      },
    };
  }

  runTimer() {
    this.count = this.length;
    this.counter.text(
      `Checking for new data in ${elexUtils.lpad(this.count)}s`
    );
    this.timer.stop();
    this.timer = d3.interval(() => {
      this.count--;
      this.counter.text(
        `Checking for new data in ${elexUtils.lpad(this.count)}s`
      );

      if (this.count === 0) {
        this.onZero();
      }
    }, 1000);
  }
}
