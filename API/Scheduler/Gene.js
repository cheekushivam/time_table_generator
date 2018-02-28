/*jslint node: true */
"use strict";

const Slots = require('../slot');

class Gene {
  constructor(className) {
    this.slots = [];
    this.className = className || null;
  }

  asignSlots(slots) {

    slots.forEach((slot, index) => {
      if (slot.className == this.className) {
        this.slots.push(slot);
      }
    });
  }
}

module.exports = Gene;