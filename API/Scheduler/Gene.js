/*jslint node: true */
"use strict";

const Slots = require('../Scheduler/slot');

class Gene {
  constructor() {}
  GeneCreator(slots, SectionName) {
    let filtered = slots.filter(slot => slot.section == SectionName).map(period => new Object({ "name": period.section, "subject": period.subject, "teacher": period.teacher }));
    return filtered;
  }
}

module.exports = Gene;