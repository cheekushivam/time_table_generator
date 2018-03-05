/*jslint node: true */
"use strict";
const utility = ('../utility');
// Have reference to class Class
class Slot {
  constructor(Periods, Sections, totalPeriods) {
    this.WorkingTime = WorkingTime;
    this.slots = this.SlotAllotment(Periods, Sections);
  }
  SlotAllotment(Periods, Sections) {
    let slots = [];
    Sections.forEach((section, index) => {
      let AssignedTeachers = [];
      Periods.forEach((Period, i) => {
        if (Period.SectionName === section.SectionName) {
          AssignedTeachers.push(Period);
        }
      });
      let slot = Array(this.totalPeriods).fill().map(Math.random(AssignedTeachers));
      slots.concat(slot);
    });
    //allot slots Randomly

    return slots.shuffle();
  }

  shuffle() {
    var input = this;

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