/*jslint node: true */
"use strict";

const Slots = require('../slot');

class Gene {
  constructor(SectionName, slots) {
    this.Periods = slots.filter((slot) => slot.SectionName == this.SectionName);
    this.SectionName = SectionName;
  }
}

module.exports = Gene;