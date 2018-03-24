/*jslint node: true */
//"use strict";
class Data {
  constructor() { console.log("Entered Data class"); }

  getDatafromJSON(JSON) {
    console.log("Logging JSON Data");

    let Teachers = JSON.Teachers.map(teacher => new Object({ "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority }));
    let name = JSON.Sections[0].name;
    let subjects = JSON.Sections[0].subjects;
    let Sections = JSON.Sections.map(section => new Object({ "name": section.name, "subjects": section.subjects }));

    return { Teachers: Teachers, Sections: Sections, DaysDescription: JSON.DaysDescription, totalPeriods: JSON.totalPeriods, lab_periods_after: JSON.lab_periods_after };
  }
}
module.exports = Data;