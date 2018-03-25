/*jslint node: true */
//"use strict";
class Data {
  constructor() { console.log("Entered Data class"); }

  getDatafromJSON(json) {
    console.log("Logging json Data");

    let Teachers = json.Teachers.map(teacher => new Object({ "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority }));
    let name = json.Sections[0].name;
    let subjects = json.Sections[0].subjects;
    let Sections = json.Sections.map(section => new Object({ "name": section.name, "subjects": section.subjects }));

    return new Object({ Teachers: Teachers, Sections: Sections, DaysDescription: json.DaysDescription, totalPeriods: json.totalPeriods, lab_periods_after: json.lab_periods_after });
  }
}
module.exports = Data;