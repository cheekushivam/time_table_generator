/*jslint node: true */
"use strict";
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
      let sloterr = this.generateSlots(AssignedTeachers);

      let slot = sloterr;
      slots = slots.concat(slot);
    }
    //allot slots Randomly
    return this.shuffle(slots);
  }

  generateSlots(AssignedTeachers) {
    return Array(this.totalPeriods).fill().map(() => {
      let index = Math.floor(Math.random() * AssignedTeachers.length);

      return AssignedTeachers[index];
    });
  }
  shuffle(slots) {
    var input = slots;

    for (var i = input.length - 1; i >= 0; i--) {

      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = input[randomIndex];

      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  }
}


module.exports = Slot;