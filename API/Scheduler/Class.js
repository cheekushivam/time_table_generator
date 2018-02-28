/*jslint node: true */
"use strict";
const utility = require('../utility');
class Class {

  constructor(id, className, subject, teacherId, hours, isLab) {
    this.id = id;
    this.subject = subject;
    this.teacher = teacher;
    this.hours = hours;
    this.isLab = isLab;
  }
  get id() {
    return this.id;
  }
  set id(id) {
    this.id = id;
  }
  get isLab() {
    return this.isLab;
  }
  set isLab(isLab) {
    this.isLab = isLab;
  }

  get subject() {
    return this.subject;
  }
  set subject(subject) {
    this.subject = subject;
  }

  get teacher() {
    return this.teacher;
  }
  set teacher(teacher) {
    this.teacher = teacher;
  }
  set hours(hours) {
    this.hours = hours;
  }
  get hours() {
    return this.hours;
  }

}

module.exports = Class;