/*jslint node: true */
"use strict";
class Period {

  constructor(sectionName, subject, teacher) {
    this.sectionName = sectionName;
    this.subject = subject;
    this.teacher = { "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority };
    this.Display();
  }
  Display() {
    console.log("sectionName:" + this.sectionName + " subjects: " + this.subject.subjectName + " teacher:" + this.teacher.name);
  }

}

module.exports = Period;