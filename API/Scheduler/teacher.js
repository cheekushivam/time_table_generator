/*jslint node: true */
"use strict";
const utility = require('../utility');
class Teacher {

  constructor(id, name, subjects, priorities) {
    this.teacher_id = id;
    this.name = name;
    this.subjects = utility.copy(subjects);
    this.priorities = priorities;
  }
  get Name() {
    return this.name;
  }
  get Teacher_id() {
    return this.teacher_id;
  }
  get Subjects() {
    return this.subjects;
  }
  set Name(name) {
    this.name = name;
  }
  set Priorities(Priorities) {
    this.priorities = Priorities;
  }
  get Priorities() {
    return this.priorities;
  }
  set Subjects(subjects) {
    this.subjects = utility.copy(subjects);
  }

}

module.exports = Teacher;