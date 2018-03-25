// Only for testing not for production use
const Generator = require('../Scheduler/Generator');
const Chromosome = require('../Scheduler/chromosome');
const Data = require('../Scheduler/Data');
const Utility = require('../utility');
const Handler = require('./constraint_handler');
const _ = require('lodash');
let days = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];

class Tester {
  constructor(Json) {
    this.data = new Data().getDatafromJSON(Json || Utility.testCase);
    this.best_table = null;
    return this.main();
  }

  test() {
    let timetable = new Generator(this.data);
    return timetable.generate();
  }

  main() {

    let best = 100;
    for (let j = 0; j < Utility.max_tests; j++) {
      console.log("---------------------------------------------------->test Case: " + (j + 1));
      let table = this.test();
      let fitness = this.TeacherCollision(table);
      if (fitness < best) {
        best = fitness;
        this.best_table = table;
      }
    }

    this.best_table = new Handler(this.best_table, this.data);
    // this.display();

    console.log("End");
    return this.best_table;
  }

  display() {

    let sections = [];
    console.log("----------------------------- Best Testing Data Starts Here------------------------------------");
    for (let section of this.best_table.Sections) {
      sections[section.sectionName] = {};
      for (let day of section.timetable) {
        for (let period of day.periods) {
          if (period == "Free") continue;
          if (sections[section.sectionName].hasOwnProperty(period.subject)) {
            sections[section.sectionName][period.subject] = sections[section.sectionName][period.subject] + 1;
          } else {
            sections[section.sectionName][period.subject] = 1;
          }
        }
      }
    }
    this.TeacherCollision();
    let totalLabs_per_section = [];
    for (let section of this.data.Sections) {
      totalLabs_per_section[section.name] = 0;
      for (let subject of section.subjects) {

        if (subject.isLab) totalLabs_per_section[section.name] += sections[section.name][subject.subjectName];
      }
    }
    console.log("\nAllotted periods per subject: \n");
    console.log(sections);
    console.log("\nTotal Noumber of Labs per sections:\n");
    console.log(totalLabs_per_section);
  }

  TeacherCollision(final_table) {
    let period_to_compare = [];
    final_table = final_table || this.best_table;
    for (let section of final_table.Sections) {
      let temp = [];
      for (let day of section.timetable)
        temp.push(day.periods);
      period_to_compare.push(_.flatMap(temp, object => object));
    }
    let day_count = 0;
    let teacher_collision_count = 0;
    let day = _.cloneDeep(this.data.DaysDescription);
    let length = day.shift().Period;
    // console.log("Teacher Period Collieded:\n");
    for (let j = 0; j < this.data.totalPeriods; j++) {
      for (let i = 0; i < period_to_compare.length - 1; i++) {
        for (let k = i + 1; k < period_to_compare.length; k++) {
          if (j == length - 1 && day.length != 0) {
            length += day.shift().Period;
            day_count++;
          }
          if (period_to_compare[i][j] != "Free" && period_to_compare[i][j].teacher === period_to_compare[k][j].teacher) {
            // console.log("Teacher collided: " + period_to_compare[i][j].teacher + " Period Number: " + period_to_compare[i][j].period + " between sections: " + final_table.Sections[i].sectionName + " and " + final_table.Sections[k].sectionName + " on: " + days[day_count] + "\n");

            teacher_collision_count++;
          }
        }
      }
    }
    console.log("Total collision: " + teacher_collision_count);
    return teacher_collision_count;
  }

}
module.exports = Tester;


new Tester();