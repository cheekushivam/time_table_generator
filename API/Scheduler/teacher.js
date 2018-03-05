/*jslint node: true */
"use strict";
const utility = require('../utility');
class Teacher {

  constructor(name, subjects, priority) {
    this.name = name;
    this.subjects = utility.copy(subjects);
    this.priority = priority;
  }
  get Name() {
    return this.name;
  }

  get Subjects() {
    return this.subjects;
  }
  set Name(name) {
    this.name = name;
  }
  set priority(priority) {
    this.priority = priority;
  }
  get priority() {
    return this.priority;
  }
  set Subjects(subjects) {
    this.subjects = utility.copy(subjects);
  }

}

module.exports = Teacher;