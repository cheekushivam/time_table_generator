"use strict";
const Utility = require('../utility');
const _ = require('lodash');

module.exports = class Handler {

  constructor(table, data) {
    this.best_table = table;
    this.data = data;

    return this.handle();
  }
  handle() {
    this.Delete_duplicate_period_per_day();
    //console.log("----------------------------- ------------------------------------");
    this.Delete_duplicate_period_per_week();
    //console.log("----------------------------- ------------------------------------");
    this.periodLock_and_lab_constraint();

    this.lone_period_alotter();
    return this.best_table;
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

  }
  periodLock_and_lab_constraint() {
    let to_be_allocated = [];
    for (let section of this.data.Sections) {
      let section_index = this.data.Sections.indexOf(section);
      let section_compare = this.best_table.Sections[section_index].timetable;
      for (let subject of section.subjects) {
        if (subject.periodLock <= 0 || subject.day <= 0) continue;
        let Buffer = this.clear_periods(_.cloneDeep(section_compare), subject);

        // Buffer = _.uniqBy(Buffer, 'subject');
        // //PeriodLock management for regular periods
        if (!subject.isLab) {
          console.log(subject.day);
          console.log(subject.periodLock);
          console.log(section_compare[subject.day - 1]);
          let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1];
          if (curr != "Free") to_be_allocated.push((curr));
          //  if (found == undefined || found.length == 0) found = this.find_periods(to_be_alloted, subject);
          section_compare[subject.day - 1].periods[subject.periodLock - 1] = _.cloneDeep(Buffer[0]);

        }
        //     //periodLock management for Lab periods
        //     if (subject.isLab) {
        //       if (subject.periodLock < section_compare[subject.day - 1].periods.length) {
        //         let i = 0;
        //         let insert_periods = this.find_periods(Buffer, subject);
        //         //    if (insert_periods == undefined || insert_periods.length == 0) insert_periods = this.find_periods(to_be_alloted, subject);
        //         while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
        //         while (i < insert_periods.length) {
        //           let curr = section_compare[subject.day - 1].periods[subject.periodLock - 1 + i];
        //           if (curr != "Free") to_be_allocated.push(_.cloneDeep(curr));
        //           section_compare[subject.day - 1].periods[subject.periodLock - 1 + i] = _.cloneDeep(insert_periods[i]);
        //           i++;
        //         }
        //
        //       } else {
        //         let insert_periods = this.find_periods(Buffer, subject);
        //         //if (insert_periods.length == 0) insert_periods = this.find_periods(to_be_alloted, subject);
        //         while (insert_periods.length < Utility.max_periods_per_day) insert_periods.push(insert_periods[0]);
        //         let i = insert_periods.length;
        //         while (i > 0) {
        //           let curr = section_compare[subject.day - 1].periods[subject.periodLock - i];
        //           if (curr != "Free") to_be_allocated.push(_.cloneDeep(curr));
        //           section_compare[subject.day - 1].periods[subject.periodLock - i] = _.cloneDeep(insert_periods[i]);
        //           i--;
        //         }
        //       }
        //     }
        //   }
      }
    }
    // to_be_allocated = _.cloneDeep(_.uniqBy(to_be_allocated, 'subject'));
    console.log(to_be_allocated);
    // this.lab_alloter(to_be_allocated);
  }

  lab_alloter(to_be_allocated) {
    for (let section of this.data.Sections) {
      let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
      change_subject: for (let subject of section.subjects) {

        if (subject.periodLock > 0 && subject.day > 0) continue;
        if (!subject.isLab) continue;
        let Buffer = this.clear_periods(section_compare, subject);
        //1

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
              let Subject = _.filter(section.subjects, subject => subject.subjectName == Day[i].subject);
              let condition = Subject.periodLock > 0 && Subject.day > 0;
              if (!condition) {
                let temp = _.cloneDeep(Day[i]);
                let Period = this.find_periods(Buffer, subject);
                if (!Period) {
                  Period = this.find_periods(to_be_allocated, subject);

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
              let Period = this.find_periods(Buffer, subject);
              if (!Period) {
                Period = this.find_periods(to_be_allocated, subject);
              }

              Day[i] = Period;
              if (front) Day[i + 1] = Day[i];
              else
              if (back) Day[i - 1] = Day[i];
              else if (!front && !back) {

                let Subject = _.filter(section.subjects, subject => subject.subjectName == Day[i + 1].subject);

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


  lone_period_alotter() {
    let count = 0;
    loop1: while (this.free_periods_remaining() > 0) {
      let Data = this.find_lone_periods();
      if (count > 20) break;
      for (let section of this.best_table.Sections) {
        if (Data.period_priority[section.sectionName].length == 0) count++;
        Data.period_priority[section.sectionName].sort((a, b) => a.count - b.count);
        loop2: for (let x of Data.period_priority[section.sectionName]) {

          for (let i = 0; i <= Utility.max_periods_per_week - x.count; i++) {

            loop4: while (true) {

              let day_index = Math.floor(Math.random() * section.timetable.length);
              let Day = section.timetable[day_index];
              let index = Math.floor(Math.random() * Day.periods.length);
              if (Day.periods.filter(period => period == "Free").length <= 0 || Day.periods.filter(period => (period.subject == x.subject)).length >= Utility.max_periods_per_day) break;
              if (Day.periods[index] != "Free") continue;
              section.timetable[day_index].periods[index] = _.cloneDeep(_.filter(Data.periods_remaining, period => period.subject == x.subject)[0]);
              break loop4;

            }
          }
        }
      }
    }

  }

  period_whole_week(Subject) {
    let count = 0;
    for (let section of this.best_table.Sections)
      for (let day of section.timetable)
        for (let period of day.periods)
          if (period.subject == Subject) count++;
    return (count <= Utility.max_periods_per_week);
  }


  free_periods_remaining() {
    let count = 0;
    for (let section of this.best_table.Sections)
      for (let day of section.timetable)
        for (let period of day.periods)
          if (period == "Free") count++;
    return count;
  }
  find_lone_periods() {
    let periods_remaining = [];
    let period_priority = {};

    for (let section of this.data.Sections) {
      let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
      period_priority[section.name] = [];
      for (let subject of section.subjects) {
        if (subject.periodLock > 0 && subject.day > 0) continue;
        if (subject.isLab) continue;
        let count = 0;
        for (let day of section_compare) {
          for (let period of day.periods) {
            if (period == "Free") continue;
            if (period.subject == subject.subjectName) {

              periods_remaining.push(period);
              count++;
            }
          }
        }
        let Subject = {};
        if (count < Utility.max_periods_per_week) {
          Subject.subject = subject.subjectName;
          Subject.count = count;
          period_priority[section.name].push(Subject);
        } else _.remove(periods_remaining, period => period.subject == subject.subjectName);
      }
    }
    periods_remaining = _.uniqBy(periods_remaining, 'subject');

    return { periods_remaining, period_priority };
  }
  can_be_alloted(subjects, Day, Buffer, index, subject) {

    let Subject = _.find(subjects, subject => subject.subjectName == Day[index].subject);
    let condition = Subject.periodLock > 0 && Subject.day > 0;
    let Period;
    let temp;
    if (!condition) {
      temp = _.cloneDeep(Day[index]);
      Period = this.find_periods(Buffer, subject);
      if (!Period) {
        Period = this.find_periods(to_be_allocated, subject);

      }
    }
    return { Period, temp };
  }
  clear_periods(section_compare, subject) {
    let Buffer = [];
    for (let day of section_compare) {
      for (let period of day.periods) {
        if (period === "Free") continue;
        if (subject.subjectName === period.subject) {
          let index1 = section_compare.indexOf(day);
          let index = day.periods.indexOf(period);
          Buffer.push(period);
          section_compare[index1].periods[index] = "Free";

        }
      }
    }
    return Buffer;
  }
  find_periods(Buffer, subject) {
    return Buffer.splice(_.filter(Buffer, period => period.subject == subject.subjectName)[0], 1);
  }


}