/*jslint node: true */
"use strict";
const utility = ('../utility');
// Have reference to class Class
class Slot {
  constructor(Period, Section) {
    this.slots = this.SlotAllotment(Period, Section);
  }
  SlotAllotment(Period, Section) {
    //allot slots Randomly

    return this.slots;
  }

}
module.exports = Slot;