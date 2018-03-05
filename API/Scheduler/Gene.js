/*jslint node: true */
"use strict";

const Slots = require('../slot');

class Gene {
  constructor(slots, SectionName) {
    this.Periods = slots.filter((slot) => slot.SectionName == SectionName);
    this.SectionName = SectionName;
  }
}

module.exports = Gene;