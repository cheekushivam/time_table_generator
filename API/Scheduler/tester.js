// Only for testing not for production use
const Generator = require('../Scheduler/Generator');
const Chromosome = require('../Scheduler/chromosome');
const Data = require('../Scheduler/Data');
const Utility = require('../utility');
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

    //  for (let section of best_table.Sections) {
    // for (let day of best_table.Sections[0].timetable) {
    //   console.log(day);
    // }
    //    }
    //  console.log("----------------------------- ------------------------------------");

    this.Delete_duplicate_period_per_day();
    //console.log("----------------------------- ------------------------------------");
    this.Delete_duplicate_period_per_week();
    //console.log("----------------------------- ------------------------------------");
    let to_be_allocated = this.periodLock_and_lab_constraint();
    this.period_and_lab_alloter(to_be_allocated);
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
            console.log("Teacher collided: " + period_to_compare[i][j].teacher + " Period Number: " + period_to_compare[i][j].period + " between sections: " + final_table.Sections[i].sectionName + " and " + final_table.Sections[k].sectionName + " on: " + days[day_count] + "\n");

            teacher_collision_count++;
          }
        }
      }
    }
    console.log("Total collision: " + teacher_collision_count);
    return teacher_collision_count;
  }
  Delete_duplicate_period_per_day() {

    for (let section of this.best_table.Sections) {

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
  }
  Delete_duplicate_period_per_week() {

    let Sections = this.data.Sections;

    for (let section of Sections) {
      let sections = {};
      let subjects = section.subjects;
      let section_compare = this.best_table.Sections[Sections.indexOf(section)].timetable;

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
  }
  periodLock_and_lab_constraint() {
    let to_be_alloted = [];
    for (let section of this.data.Sections) {

      let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
      for (let subject of section.subjects) {
        if (subject.periodLock <= 0 || subject.day <= 0) continue;
        let Buffer = [];
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period == "Free") continue;
            if (period.subject == subject.subjectName) {
              Buffer.push(period);
              day.periods[day.periods.indexOf(period)] = "Free";
            }
          }
        }
        //PeriodLock management for regular periods
        if (!subject.isLab) {
          let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1];

          if (curr != "Free") to_be_alloted.push(_.cloneDeep(curr));
          let found = this.find_periods(Buffer, subject);
          //  if (found == undefined || found.length == 0) found = this.find_periods(to_be_alloted, subject);
          section_compare[subject.day - 1].periods[subject.periodLock - 1] = found[0];
        }
        //periodLock management for Lab periods
        if (subject.isLab) {
          if (subject.periodLock < section_compare[subject.day - 1].periods.length) {
            let i = 0;
            let insert_periods = this.find_periods(Buffer, subject);
            //    if (insert_periods == undefined || insert_periods.length == 0) insert_periods = this.find_periods(to_be_alloted, subject);
            while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
            while (i < insert_periods.length) {
              let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1 + i];
              if (curr != "Free") to_be_alloted.push(_.cloneDeep(curr));
              section_compare[subject.day - 1].periods[subject.periodLock - 1 + i] = insert_periods[i];
              i++;
            }

          } else {
            let insert_periods = this.find_periods(Buffer, subject);
            //if (insert_periods.length == 0) insert_periods = this.find_periods(to_be_alloted, subject);
            while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
            let i = insert_periods.length;
            while (i > 0) {
              let curr = section_compare[subject.day - 1].periods[subject.periodLock - i];
              if (curr != "Free") to_be_alloted.push(_.cloneDeep(curr));
              section_compare[subject.day - 1].periods[subject.periodLock - i] = insert_periods[i];
              i--;
            }
          }
        }
      }
    }
    to_be_alloted = _.cloneDeep(_.uniqBy(to_be_alloted, 'subject'));
    return to_be_alloted;
  }

  period_and_lab_alloter(to_be_allocated) {
    for (let section of this.data.Sections) {
      let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
      change_subject: for (let subject of section.subjects) {
        if (subject.periodLock > 0 && subject.day > 0) continue;
        if (!subject.isLab) continue;
        let Buffer = [];
        //1
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period == "Free") continue;
            if (period.subject == subject.subjectName) {
              Buffer.push(period);
              day.periods[day.periods.indexOf(period)] = "Free";
            }
          }
        }
        //1- end
        //2
        let total_free_periods = [];
        for (let day of section_compare) {
          let count = 0;
          for (let i = this.data.lab_periods_after; i < day.periods.length; i++) {
            if (day.periods[i] == "Free") count++;
          }
          let Day = {};
          Day.day = day.day;
          Day.count = count;
          total_free_periods.push(Day);
        }
        total_free_periods.sort((a, b) => b.count - a.count);
        //2-end
        for (let day of total_free_periods) {

          let Day = _.find(section_compare, obj => obj.day == day.day).periods;

          for (let i = this.data.lab_periods_after + 1; i < Day.length - 1; i++) {
            let curr = Day[i] == "Free";
            let back = Day[i - 1] == "Free";
            let front = Day[i + 1] == "Free";
            if (!curr && (back || front)) {
              let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i].subject);
              let condition = Subject.periodLock > 0 && Subject.day > 0;
              if (!condition) {
                let temp = _.cloneDeep(Day[i]);
                let Period = this.find_periods(Buffer, subject)[0];
                if (!Period) {
                  Period = this.find_periods(to_be_allocated, subject)[0];

                }
                Day[i] = Period;
                if (front) {
                  Day[i + 1] = Day[i];
                  if (back) Day[i - 1] = temp;

                } else if (back) {
                  Day[i - 1] = Day[i];
                  if (front) Day[i + 1] = temp;
                } else to_be_allocated.push(temp);
                continue change_subject;
              }
            } else {
              let Period = this.find_periods(Buffer, subject)[0];
              if (!Period) {
                Period = this.find_periods(to_be_allocated, subject)[0];
              }

              Day[i] = Period;
              if (front) Day[i + 1] = Day[i];
              else
              if (back) Day[i - 1] = Day[i];
              else if (!front && !back) {

                let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i + 1].subject);
                let condition = Subject.periodLock > 0 && Subject.day > 0;
                if (!condition) {
                  to_be_allocated.push(_.cloneDeep(Day[i + 1]));
                  Day[i + 1] = Day[i];
                } else {
                  let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i - 1].subject);
                  let condition = Subject.periodLock > 0 && Subject.day > 0;
                  if (!condition) {
                    to_be_allocated.push(_.cloneDeep(Day[i - 1]));
                    Day[i - 1] = Day[i];
                  }
                }

              }
              continue change_subject;
            }
          }
        }
      }
    }
  }

  find_periods(Buffer, subject) {
    return _.remove(Buffer, period => period.subject == subject.subjectName);
  }
  find_lone_periods() {
    let periods_remaining = [];
    let period_priority = {};

    for (let section of this.data.Sections) {
      let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
      period_priority[section.name] = {};
      for (let subject of section.subjects) {
        if (subject.periodLock > 0 && subject.day > 0) continue;
        if (subject.isLab) continue;
        if (period == "Free") continue;
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period.subject == subject.subjectName) {
              periods_remaining.push(period);
              if (period_priority[section.name].hasOwnProperty(period.subject)) {
                period_priority[section.name][period.subject] += 1;
              } else
                period_priority[section.name][period.subject] = 1;
            }
          }
        }
      }
    }
    return { periods_remaining, period_priority };
  }

}
module.exports = Tester;

//
// for (let i = 0; i < 100; i++) {
//   console.log("------------------------------------>testing count: " + i);
//   new Tester();
// }