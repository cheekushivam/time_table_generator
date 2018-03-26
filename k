// period_and_lab_alloter() {
//   for (let section of this.data.Sections) {
//     let section_compare = this.best_table.Sections[this.data.Sections.indexOf(section)].timetable;
//     change_subject: for (let subject of section.subjects) {
//       if (subject.periodLock > 0 && subject.day > 0) continue;
//       if (!subject.isLab) continue;
//
//       //1
//       let Buffer = [];
//       for (let day of section_compare) {
//         for (let period of day.periods) {
//           if (period == "Free") continue;
//           if (period.subject == subject.subjectName) {
//             Buffer.push(_.cloneDeep(period));
//             day.periods[day.periods.indexOf(period)] = "Free";
//           }
//         }
//       }
//       //1- end
//       //2
//       Buffer = _.uniqBy(Buffer, 'subject');
//       let total_free_periods = [];
//       for (let day of section_compare) {
//         let count = 0;
//         for (let i = this.data.lab_periods_after; i < day.periods.length; i++) {
//           if (day.periods[i] == "Free") count++;
//         }
//         let Days = {};
//         Days.day = day.day;
//         Days.count = count;
//         total_free_periods.push(Days);
//       }
//       total_free_periods.sort((a, b) => b.count - a.count);
//       //2-end
//       loop1: for (let day of total_free_periods) {
//
//         let Day = _.find(section_compare, obj => obj.day == day.day).periods;
//         for (let i = this.data.lab_periods_after + 1; i < Day.length - 1; i++) {
//           let curr = Day[i] == "Free";
//           let back = Day[i - 1] == "Free";
//           let front = Day[i + 1] == "Free";
//           if (!curr) {
//             if (back || front) {
//               let Data = this.can_be_alloted(section.subjects, Day, Buffer, i, subject);
//               let temp = Data.temp;
//               Day[i] = (Data.Period);
//               if (front) {
//                 Day[i + 1] = (Day[i]);
//                 if (back) Day[i - 1] = (temp);
//                 else this.to_be_allocated_assigner(_.cloneDeep(temp));
//               } else if (back) {
//                 Day[i - 1] = (Day[i]);
//                 if (front) Day[i + 1] = (temp);
//                 else this.to_be_allocated_assigner(_.cloneDeep(temp));
//               }
//               continue change_subject;
//
//             } else {
//               Day[i] = (this.can_be_alloted(section.subjects, Day, Buffer, i, subject).Period);
//               if (!front) Day[i + 1] = (this.can_be_alloted(section.subjects, Day, Buffer, i + 1, subject).Period);
//               else if (!back) Day[i - 1] = (this.can_be_alloted(section.subjects, Day, Buffer, i - 1, subject).Period);
//             }
//
//             continue change_subject;
//           } else if (!front && !back) {
//             //console.log(Day[i + 1]);
//             let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i + 1].subject);
//             let condition = Subject.periodLock > 0 && Subject.day > 0;
//             if (!condition) {
//               this.to_be_allocated_assigner(_.cloneDeep(Day[i + 1]));
//               Day[i + 1] = (Day[i]);
//             } else {
//               let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i - 1].subject);
//               let condition = Subject.periodLock > 0 && Subject.day > 0;
//               if (!condition) {
//                 this.to_be_allocated_assigner(_.cloneDeep(Day[i - 1]));
//                 Day[i - 1] = (Day[i]);
//               }
//             }
//             continue change_subject;
//           } else {
//             let Period = this.find_periods(Buffer, subject);
//             if (!Period) {
//               Period = this.find_periods(this.to_be_allocated, subject);
//             }
//
//             Day[i] = (Period);
//             if (front) Day[i + 1] = (Day[i]);
//             else if (back) Day[i - 1] = (Day[i]);
//             else if (!front && !back) {
//
//               let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i + 1].subject);
//               let condition = Subject.periodLock > 0 && Subject.day > 0;
//               if (!condition) {
//                 this.to_be_allocated_assigner(_.cloneDeep(Day[i + 1]));
//                 Day[i + 1] = (Day[i]);
//               } else {
//                 let Subject = _.find(section.subjects, subject => subject.subjectName == Day[i - 1].subject);
//                 let condition = Subject.periodLock > 0 && Subject.day > 0;
//                 if (!condition) {
//                   this.to_be_allocated_assigner(_.cloneDeep(Day[i - 1]));
//                   Day[i - 1] = (Day[i]);
//                 }
//               }
//
//             }
//             continue change_subject;
//           }
//         }
//
//
//       }
//     }
//   }
//   this.to_be_allocated = _.cloneDeep(_.uniqBy(this.to_be_allocated, 'subject'));
// }