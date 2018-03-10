/*jslint node: true */
"use strict";
const utility = require('../utility');
var fp = require('lodash/fp');
let fitness_inc = 1;
let fitness_dec = 1;

class Chromosome {
  constructor(Genes, Sections, DaysDescription, totalPeriods) {
    this.Genes = Genes;
    this.Sections = Sections;
    this.DaysDescription = DaysDescription;
    this.totalPeriods = totalPeriods;
    this.fitness = this.getfitness();
  }
  getfitness() {
    //calculate fitness of a chromosomes
    let fitness = 0;
    fitness += this.constraints_per_day(this.Genes, fp.cloneDeep(this.Sections), fp.cloneDeep(this.DaysDescription));
    // Teachers clash at same period - Hard Constraint
    //console.log(this.Genes);
    //fitness += this.TeacherCollision(fp.cloneDeep(this.Genes), this.totalPeriods);

    //fitness = (fitness > 1) ? (fitness / ((this.Genes.length) * this.totalPeriods)) - 1 : 1 - (fitness / ((this.Genes.length) * this.totalPeriods));


    return fitness;
  }
  constraints_per_day(Genes, Sections, DaysDescription) {
    let fitness = 0;
    for (let section of Sections) {
      var myGene = this.GeneFinder(Genes, section, DaysDescription);
      // To Find that teacher priority is statisfied or not - Soft Constraint

      for (let day of myGene) {
        for (let subject of section.subjects) {


          //Max period exceed per week - Hard Constraint
          fitness += this.max_period_per_week(Genes, subject);

          //Max period exceed per day - Hard Constraint

          fitness = (subjectCount(day, subject) <= utility.max_periods_per_day) ? fitness + fitness_inc : fitness - fitness_dec; // checked

          // To find that periodLock is satisfied or not - Hard Constraint
          if (subject.periodLock != -1) {
            fitness = (findLock(day, subject)) ? fitness + fitness_inc : fitness - fitness_dec;
          }


          //  for (let [periodno, period] of day.entries()) { // Genes contains objects of Period class
          //To find Teacher Priority is met - Soft Constraint
          //  let teacher = period.teacher;
          //fitness += this.Teacher_priority(teacher, periodno);
          // To find lab constraints - Hard Constraint
          //  fitness += this.Lab_constraint(subject, day, periodno, period);
          //        }
        }
      }
    }
    //console.log("fitness of: " + this.constraints_per_day.name + " -->" + fitness);
    return fitness;
  }
  max_period_per_week(Genes, subject) {
    let fitness = 0;

    for (let i = 0; i < Genes.length; i++) {
      if (!subject.isLab) {
        let maxSubjectCount = subjectCount(Genes[i], subject);
        if (maxSubjectCount == utility.max_periods_per_week) {
          fitness += fitness_inc;
        } else if (maxSubjectCount > utility.max_periods_per_week) {
          fitness -= fitness_dec;
        }
      } else {
        let howmany_sameperiod = 0;
        howmany_sameperiod = Genes[i].filter(periods => periods.subject.subjectName == subject.subjectName).length;

        if (howmany_sameperiod == 2) {
          fitness += fitness_inc;
        } else if (howmany_sameperiod > 2) {
          fitness -= fitness_dec;
        }
      }
    }
    //console.log("fitness of: " + this.max_period_per_week.name + " -->" + fitness);
    return fitness;
  }

  Teacher_priority(teacher, periodno) {
    let fitness = 0;
    if (teacher.priority == 0) return fitness + fitness_dec;
    if (teacher.priority - 1 === periodno) {
      fitness += fitness_inc;
    }
    //console.log("fitness of: " + this.Teacher_priority.name + " -->" + fitness);

    return fitness;
  }
  Lab_constraint(subjectg, day, periodno, period) {
    let fitness = 0;

    if (subjectg.isLab) {
      if (periodno + 1 >= day.length) {
        fitness -= fitness_dec;
      } else {
        let howmany_sameperiod = day.filter(periods => periods.subject.subjectName == subjectg.subjectName).length;

        let condition = period.subject.subjectName == subjectg.subjectName && day[periodno + 1].subject.subjectName == subjectg.subjectName && howmany_sameperiod == 2;
        fitness = (condition) ? fitness + fitness_inc : fitness -= fitness_dec;
      }
    }
    return fitness;
  }

  TeacherCollision(Genes, totalPeriods) {
    let fitness = 0;
    //  console.log(Genes.length);
    //console.log(totalPeriods);
    for (let j = 0; j < totalPeriods; j++) {
      let geneGroup = [];

      for (let i = 0; i < Genes.length; i++) {

        if (Genes[i][j] != null) {
          //  console.log(j);
          geneGroup.push(Genes[i][j]);
        }
      }

      let matched = false;

      for (let k = 0; k < geneGroup.length; k++) {
        for (let t = 0; t < geneGroup.length; t++) {

          if (geneGroup[k].teacher.name == geneGroup[t].teacher.name) {
            matched = true;
            break;
          }
        }

        fitness = matched ? fitness -= fitness_dec : fitness += fitness_inc;

      }
    }
    //console.log("fitness of: " + this.TeacherCollision.name + " -->" + fitness);

    return fitness;
  }

  GeneFinder(Genes, Section, DaysDescription) {

    let myGene1 = null;
    let myGene = [];
    let k = 0;
    for (let i = 0; i < Genes.length; i++) {
      if (Genes[i][0].name == Section.name) {
        myGene1 = fp.cloneDeep(Genes[i]);
        break;
      }
    }
    do {
      let temp = myGene1.splice(0, DaysDescription[k++].Period);
      myGene.push(temp);
    } while (myGene1.length > 0);
    return myGene;
  }

  //class End
}


// Helper functions

function subjectCount(day, subject) {
  return day.filter(gene => gene.subject.subjectName == subject.subjectName).length;
}

function findLock(day, subject) {
  return day.find(gene =>
    (gene.subject.subjectName == subject.subjectName && day.indexOf(gene) == subject.periodLock - 1) ? true : false
  );
}



module.exports = Chromosome;