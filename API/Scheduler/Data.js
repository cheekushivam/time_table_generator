/*jslint node: true */
"use strict";
class Data {
  constructor() {}

  getDatafromJSON(JSON) {
    let Teachers = JSON.Teachers.map(teacher => new Teacher(teacher.name, teacher.subjects, teacher.priority));
    let Sections = JSON.Sections.map(section => new Section(section.name, section.subjects));
    let totalPeriods = JSON.totalPeriods;
    return { Teachers: Teachers, Sections: Sections, totalPeriods: totalPeriods };
  }
}
module.exports = Data;