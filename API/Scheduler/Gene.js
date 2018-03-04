/*jslint node: true */
"use strict";

const Slots = require('../slot');

class Gene {
  constructor(SectionName, slots) {
    this.Periods = this.PeriodSorter(slots);
    this.SectionName = SectionName;
  }

  PeriodSorter(slots) {
    let temp = [];
    slots.forEach((slot, index) => {
      if (slot.SectionName == this.SectionName) {
        this.temp.push(slot);
      }
    });

    return temp;
  }

}

module.exports = Gene;