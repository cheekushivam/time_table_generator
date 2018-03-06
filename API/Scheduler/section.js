/*jslint node: true */
//"use strict";
class Section {

  constructor(sectionName, subjects) {
    console.log("Entered Section class");
    //  console.log("Recieved sectionName- " + typeof sectionName + "  subjects- " + typeof subjects);
    this.sectionName = sectionName;
    //console.log("sectionName-" + typeof this.sectionName);
    this.subjects = subjects;
    //console.log("subjects- " + this.subjects);
  }

}

module.exports = Section;