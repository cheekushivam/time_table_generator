/*jslint node: true */
"use strict";
var _ = require('lodash/');
// Have reference to class Class
class Slot {
  constructor(Periods, Sections, totalPeriods) {
    this.totalPeriods = totalPeriods;
    this.slots = this.SlotAllotment(Periods, Sections);
  }
  SlotAllotment(Periods, Sections) {
    let slots = [];
    for (let section of Sections) {
      let AssignedTeachers = [];
      for (let Period of Periods) {
        if (Period.section === section.name) {
          AssignedTeachers.push(Period);
        }
      }
      let slot = this.generateSlots(AssignedTeachers);


      slots = slots.concat(slot);
    }
    //allot slots Randomly

    return _.shuffle(slots);
  }

  generateSlots(AssignedTeachers) {
    let slot = Array(this.totalPeriods).fill("Free");
    loop1: for (let i = 0; i < slot.length;) {
      for (let period of AssignedTeachers) {
        slot[i] = period;
        i++;
        if (i == slot.length) break loop1;
      }
    }
    // let slot = Array(this.totalPeriods).fill().map(() => AssignedTeachers[Math.floor(Math.random() * AssignedTeachers.length)]);
    return _.shuffle(slot);
  }

}


module.exports = Slot;