// Only for testing not for production use
const Generator = require('../Scheduler/Generator');
const Chromosome = require('../Scheduler/chromosome');
const Data = require('../Scheduler/Data');
const Utility = require('../utility');
const _ = require('lodash');
let days = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];

module.exports = {
  test: function(data) {
    let timetable = new Generator(data);
    let final_table = timetable.generate();
    return final_table;
  },

  main: function(Json) {
    let best = 0;
    let best_table;

    json = Json || Utility.testCase;
    let data = new Data().getDatafromJSON(json);
    for (let j = 0; j < Utility.max_tests; j++) {
      console.log("---------------------------------------------------->test Case: " + (j + 1));
      let table = this.test(data);
      let fitness = table.fitness;
      if (fitness > best) {
        best = table.fitness;
        best_table = table;
      }
    }
    this.display(best_table, data);

    return best_table;
  },

  display: function(final_table, data) {
    let sections = [];
    console.log("----------------------------- Best Testing Data Starts Here------------------------------------");
    for (let section of final_table.Sections) {
      sections[section.sectionName] = {};
      for (let day of section.timetable) {
        for (let period of day.periods) {
          if (sections[section.sectionName].hasOwnProperty(period.subject)) {
            sections[section.sectionName][period.subject] = sections[section.sectionName][period.subject] + 1;
          } else {
            sections[section.sectionName][period.subject] = 1;
          }
        }
      }
    }
    let totalLabs_per_section = [];
    for (let section of data.Sections) {
      totalLabs_per_section[section.name] = 0;
      for (let subject of section.subjects) {
        if (subject.isLab) totalLabs_per_section[section.name] += sections[section.name][subject.subjectName];
      }
    }
    let period_to_compare = [];

    // for (let section of final_table.Sections) {
    //   period_to_compare.push(section.periods);
    // }
    //
    // let day_count = 0;
    // let teacher_collision_count = 0;
    // console.log("Teacher Period Collieded:\n");
    // for (let j = 0; j < data.totalPeriods; j++) {
    //   for (let i = 0; i < period_to_compare.length - 1; i++) {
    //     if (j % data.DaysDescription.length == 0 && j != 0) {
    //       day_count++;
    //     }
    //     if (period_to_compare[i][j].teacher === period_to_compare[i + 1][j].teacher) {
    //       console.log("Teacher collided: " + period_to_compare[i][j].teacher + " Period Number: " + period_to_compare[i][j].period + " between sections: " + final_table.periods[i].sectionName + " and " + final_table.periods[i + 1].sectionName + " on: " + days[day_count] + "\n");
    //       teacher_collision_count++;
    //     }
    //   }
    //
    // }
    let days = ["Monday": {}, "Tuesday": {}, "Wednesday": {}, "Thrusday": {}, "Friday": {}, "Saturday": {}];
    let filtered_data_by_day = [];
    filtered_data_by_day.push(_.filter(final_table.Sections, object => object.day));
    console.log(filtered_data_by_day);
    //  for (let section of final_table.Sections) {
    //for (let day of section.timetable) {
    //  for (let period of day.periods) {


    //  }
    //  }
    //    }
    console.log("Total collision: " + teacher_collision_count);
    console.log("\nAllotted periods per subject: \n");
    console.log(sections);
    console.log("\nTotal Noumber of Labs per sections:\n");
    console.log(totalLabs_per_section);
  }
}
module.exports.main();