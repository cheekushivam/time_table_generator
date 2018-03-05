/*jslint node: true */
"use strict";
const Teacher = require('../Scheduler/teacher');
const Section = require('../Scheduler/section');
class Data {
  constructor() { console.log("Entered Data class"); }

  getDatafromJSON(JSON) {
    console.log("Logging JSON Data");
    console.log(JSON);
    let Teachers = JSON.Teachers.map(teacher => {
      console.log(teacher);
      let teach = new Teacher(teacher.name, teacher.subjects, teacher.priority);
      console.log("logging teacher object");
      console.log(teach);
      return teach;
    });
    let Sections = JSON.Sections.map(section => new Section(section.name, section.subjects));
    let totalPeriods = JSON.totalPeriods;
    console.log("Logging Sections");
    console.log(this.sections);
    console.log("Logging Teachers");
    console.log(this.Teachers);
    console.log("logging DaysDescription");
    console.log(JSON.DaysDescription);
    console.log("Logging totalPeriods");
    console.log(totalPeriods);
    return { Teachers: Teachers, Sections: Sections, DaysDescription: JSON.DaysDescription, totalPeriods: totalPeriods };
  }
}
module.exports = Data;