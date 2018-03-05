/*jslint node: true */
"use strict";
const utility = require('../utility');
class Teacher {

  constructor(name, subjects, priority) {
    console.log("Entered teachers constructor");
    this.name = name;
    console.log("name- " + this.name);
    this.subjects = utility.copy(subjects);
    console.log("subjects- " + this.subjects);
    console.log(typeof priority);
    this.priority = new Number(priority);

    console.log("priority");
    console.log("Exit teachers constructor");
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