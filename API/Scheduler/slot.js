/*jslint node: true */
"use strict";
// Have reference to class Class
class Slot {
  constructor(id, teacher_id = null, subject = null, Class = null) {
    this.id = id;
    this.Class = Class;
    this.ClassName = ClassName;
  }
  get className() {
    return this.className;
  }
  set className(className) {
    this.className = className;
  }
}
module.exports = Slot;