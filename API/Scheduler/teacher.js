/*jslint node: true */
"use strict";
const utility = require('../utility');
class Teacher {

  constructor(name, subjects, priority) {
    console.log("Entered teachers constructor");
    this.name = name;
    //console.log("name- " + this.name);
    this.subjects = utility.copy(subjects);
    //console.log("subjects- " + this.subjects);
    this.priority = priority;
    // console.log("priority");
    console.log("Exit teachers constructor");
  }


}

module.exports = Teacher;