/*jslint node: true */
"use strict";
const utility = ('../utility');
// Have reference to class Class
class Slot {
  constructor(Period, SectionName) {
    this.slots = this.SlotAllotment(Period, SectionName);
  }
  SlotAllotment(Period, SectionName) {
    //allot slots Randomly
    return this.slots;
  }

}
module.exports = Slot;