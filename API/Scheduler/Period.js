/*jslint node: true */
"use strict";
const utility = require('../utility');
class Period {

  constructor(sectionName, subject, teacher) {
    this.sectionName = sectionName;
    this.subject = subject;
    this.teacher = teacher;

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
  get sectionName() {
    return this.sectionName;
  }
  set sectionName(sectionName) {
    this.sectionName = sectionName;
  }


}

module.exports = Period;