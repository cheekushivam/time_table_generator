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
    let best = 100;
    let best_table;

    json = Json || Utility.testCase;
    let data = new Data().getDatafromJSON(json);
    for (let j = 0; j < Utility.max_tests; j++) {
      console.log("---------------------------------------------------->test Case: " + (j + 1));
      let table = this.test(data);
      let fitness = this.TeacherCollision(table, data);
      if (fitness < best) {
        best = fitness;
        best_table = table;
      }
    }

    //  for (let section of best_table.Sections) {
    // for (let day of best_table.Sections[0].timetable) {
    //   console.log(day);
    // }
    //    }
    //  console.log("----------------------------- ------------------------------------");
    this.Delete_duplicate_period_per_day(best_table, data);
    //console.log("----------------------------- ------------------------------------");
    this.Delete_duplicate_period_per_week(best_table, data);
    //console.log("----------------------------- ------------------------------------");
    this.periodLock_and_lab_constraint(best_table, data);
    //this.display(best_table, data);
    return best_table;
  },

  display: function(final_table, data) {
    let sections = [];
    console.log("----------------------------- Best Testing Data Starts Here------------------------------------");
    for (let section of final_table.Sections) {
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
    this.TeacherCollision(final_table, data);
    let totalLabs_per_section = [];
    for (let section of data.Sections) {
      totalLabs_per_section[section.name] = 0;
      for (let subject of section.subjects) {

        if (subject.isLab) totalLabs_per_section[section.name] += sections[section.name][subject.subjectName];
      }
    }
    console.log("\nAllotted periods per subject: \n");
    console.log(sections);
    console.log("\nTotal Noumber of Labs per sections:\n");
    console.log(totalLabs_per_section);
  },

  TeacherCollision: function(final_table, data) {
    let period_to_compare = [];

    for (let section of final_table.Sections) {
      let temp = [];
      for (let day of section.timetable)
        temp.push(day.periods);
      period_to_compare.push(_.flatMap(temp, object => object));
    }
    let day_count = 0;
    let teacher_collision_count = 0;
    let day = _.cloneDeep(data.DaysDescription);
    let length = day.shift().Period;
    console.log("Teacher Period Collieded:\n");
    for (let j = 0; j < data.totalPeriods; j++) {
      for (let i = 0; i < period_to_compare.length - 1; i++) {
        for (let k = i + 1; k < period_to_compare.length; k++) {
          if (j == length - 1 && day.length != 0) {
            length += day.shift().Period;
            day_count++;
          }
          if (period_to_compare[i][j] != "Free" && period_to_compare[i][j].teacher === period_to_compare[k][j].teacher) {
            console.log("Teacher collided: " + period_to_compare[i][j].teacher + " Period Number: " + period_to_compare[i][j].period + " between sections: " + final_table.Sections[i].sectionName + " and " + final_table.Sections[k].sectionName + " on: " + days[day_count] + "\n");

            teacher_collision_count++;
          }
        }
      }
    }
    console.log("Total collision: " + teacher_collision_count);
    return teacher_collision_count;
  },
  Delete_duplicate_period_per_day: function(table, data) {

    for (let section of table.Sections) {

      for (let day of section.timetable) {
        let Day = {};
        for (let period of day.periods) {
          if (Day.hasOwnProperty(period.subject)) {
            Day[period.subject] = Day[period.subject] + 1;
          } else {
            Day[period.subject] = 1;
          }
          if (Day[period.subject] > Utility.max_periods_per_day) {
            day.periods[day.periods.indexOf(period)] = "Free";

          }
        }
      }
    }
    //    for (let section of table.Sections) {
    // for (let day of table.Sections[0].timetable) {
    //   console.log(day);
    // }
    //  }
  },
  Delete_duplicate_period_per_week: function(table, data) {

    let Sections = data.Sections;

    for (let section of Sections) {
      let sections = {};
      let subjects = section.subjects;
      let section_compare = table.Sections[Sections.indexOf(section)].timetable;

      for (let subject of subjects) {
        let constraint = subject.isLab ? Utility.max_periods_per_day : Utility.max_periods_per_week;
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period == "Free") continue;
            if (period.subject == subject.subjectName && sections[period.subject] > constraint) {
              //console.log(sections[period.subject] + "---" + period.subject);
              day.periods[day.periods.indexOf(period)] = "Free";
            }

            if (sections.hasOwnProperty(period.subject) && period.subject == subject.subjectName) {
              sections[period.subject] = sections[period.subject] + 1;
            } else {
              sections[period.subject] = 1;
            }

          }
        }
      }
    }
    // for (let day of table.Sections[0].timetable) {
    //   console.log(day);
    // }
  },
  periodLock_and_lab_constraint: function(table, data) {


    let to_be_alloted = [];
    for (let section of data.Sections) {
      let Buffer = [];
      let section_compare = table.Sections[data.Sections.indexOf(section)].timetable;
      for (let subject of section.subjects) {
        if (subject.periodLock <= 0 || subject.day <= 0) continue;
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period == "Free") continue;
            if (period.subject == subject.subjectName) {
              Buffer.push(period);
              day.periods[day.periods.indexOf(period)] = "Free";
            }
          }
        }
        console.log(section.name);
        console.log(subject.subjectName);
        console.log(subject.isLab);
        //  If subject satisfies a position and is not a lab
        if (!subject.isLab) { // If subject doesn't satisfies a positionk and is not a lab
          let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1];
          console.log(section_compare[subject.day - 1].periods[subject.periodLock - 1]);
          if (curr != "Free") to_be_alloted.push(_.cloneDeep(curr));
          section_compare[subject.day - 1].periods[subject.periodLock - 1] = this.find_periods(Buffer, subject)[0];
        }

        if (subject.isLab) {
          console.log("-----------Lab");
          console.log(subject.periodLock);
          console.log(section_compare[subject.day - 1].periods.length);
          if (subject.periodLock < section_compare[subject.day - 1].periods.length) {
            let i = 0;
            let insert_periods = this.find_periods(Buffer, subject);
            console.log(insert_periods);
            while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
            while (i++ < insert_periods.length) {
              console.log("aaya");
              let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1 + i];
              to_be_alloted.push(_.cloneDeep(curr));
              section_compare[subject.day - 1].periods[subject.periodLock - 1 + i] = insert_periods[i];
            }
          }
        }
        //   } else {
        //     let insert_periods = find_periods(Buffer,subject);;
        //     while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
        //     let i = 0;
        //     while (i++ < insert_periods.length) {
        //       let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1 - i];
        //       if (curr != "Free") to_be_alloted.push(curr);
        //       to_be_alloted.push(curr);
        //       section_compare[subject.day - 1].periods[subject.periodLock - 1 - i] = insert_periods[i];
        //     }
        //
        //   }
        // }
      }
    }
  },
  find_periods: function(Buffer, subject) {
    return _.remove(Buffer, period => period.subject == subject.subjectName);
  }
};
// module.exports.main();