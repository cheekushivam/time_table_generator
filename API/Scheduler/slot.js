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

    return this.shuffle(slots);
  }

  generateSlots(AssignedTeachers) {

    let slot = Array(this.totalPeriods).fill().map(() => AssignedTeachers[Math.floor(Math.random() * AssignedTeachers.length)]);
    return slot;
  }
  shuffle(slots) {
    var input = slots;

    for (var i = input.length - 1; i >= 0; i--) {

      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = _.cloneDeep(input[randomIndex]);

      input[randomIndex] = _.cloneDeep(input[i]);
      input[i] = itemAtIndex;
    }
    return input;
  }
}


module.exports = Slot;