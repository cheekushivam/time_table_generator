/*jslint node: true */
"use strict";
const utility = ('../utility');
// Have reference to class Class
class Slot {
  constructor(Periods, Sections, totalPeriods) {
    console.log("Entered");
    this.totalPeriods = totalPeriods;
    this.slots = this.SlotAllotment(Periods, Sections);
  }
  SlotAllotment(Periods, Sections) {
    let slots = [];
    for (let section of Sections) {
      //  console.log("here--");

      let AssignedTeachers = [];
      for (let Period of Periods) {
        //  console.log(Period);
        //  console.log("here++");
        if (Period.section === section.name) {
          AssignedTeachers.push(Period);
        }
      }
      let slot = this.generateSlots(AssignedTeachers);
      //console.log("one slot count " + slot.length);
      //console.log(slot);
      slots = slots.concat(slot);
    }
    //allot slots Randomly
    //  console.log("slot Count" + slots.length);
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