/*jslint node: true */
"use strict";
class Section {

  cosntructor(sectionName, subjects) {
    this.sectionName = sectionName;
    this.subjects = subjects;
  }
  get sectionName() {
    return this.sectionName;
  }
  set sectionName(sectionName) {
    this.sectionName = sectionName;
  }
  get subjects() {
    return this.subjects;
  }
  set subjects(subjects) {
    this.subjects = subjects;
  }
}

module.exports = Section;