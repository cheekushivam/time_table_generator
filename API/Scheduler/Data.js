/*jslint node: true */
"use strict";
class Data {
  constructor() {}

  getDatafromJSON(JSON) {
    let Teachers = JSON.Teachers.map(teacher => new Teacher(teacher.name, teacher.subjects, teacher.priority));
    let Sections = JSON.Sections.map(section => new Section(section.name, section.subjects));

    return { Teachers: Teachers, Sections: Sections };
  }
}
module.exports = Data;