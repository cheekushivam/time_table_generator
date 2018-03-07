/*jslint node: true */
"use strict";

const utility = require('../utility');
let fitness_inc = 1;
let fitness_dec = 0;
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
    fitness += this.constraints_per_day(this.Genes, this.Sections, this.DaysDescription);
    // Teachers clash at same period - Hard Constraint
    fitness += this.TeacherCollision(this.Genes, copy(this.totalPeriods));
    fitness = 1 - (fitness / ((this.Genes.length) * this.totalPeriods));
    return fitness;
  }
  constraints_per_day(Genes, Sections, DaysDescription) {
    let fitness = 0;
    for (let section of Sections) {
      let myGene = this.GeneFinder(Genes, section, DaysDescription);
      // To Find that teacher priority is statisfied or not - Soft Constraint
      for (let day of myGene) {

        for (let [periodno, period] of day.entries()) { // Genes contains objects of Period class
          //To find Teacher Priority is met - Soft Constraint
          let teacher = period.teacher;
          fitness += this.Teacher_priority(teacher, periodno);
          // To find lab constraints - Hard Constraint
          fitness += this.Lab_constraint(section.subjects, day, periodno, period);
        }
        // To find that periodLock is satisfied or not - Hard Constraint
        for (let subject of section.subjects) {

          if (subject.periodLock != -1) {
            fitness = (findLock(day, subject)) ? fitness + fitness_inc : fitness - fitness_dec;
          }
          //Max period exceed per day - Hard Constraint
          fitness = (subjectCount(day, subject) < utility.max_periods_per_day) ? fitness + fitness_inc : fitness - fitness_dec;

          //Max period exceed per week - Hard Constraint
          fitness += this.max_period_per_week(Genes, subject);
        }
      }
    }
    return fitness;
  }
  max_period_per_week(Genes, subject) {
    let fitness = 0;
    let GenePool = [];
    for (let i = 0; i < Genes.length; i++) {
      GenePool = GenePool.concat(Genes[i]);
    }
    let maxSubjectCount = subjectCount(GenePool, subject);
    if (maxSubjectCount == utility.max_periods_per_week) {
      fitness += fitness_inc;
    } else if (maxSubjectCount > utility.max_periods_per_week) {
      fitness -= fitness_dec;
    }
    return fitness;
  }
  Teacher_priority(teacher, periodno) {
    let fitness = 0;
    if (teacher.priority == 0) return fitness + fitness_dec;
    if (teacher.priority - 1 === periodno) {
      fitness += fitness_inc;
    }
    return fitness;
  }
  Lab_constraint(Section_subjects, day, periodno, period) {
    let fitness = 0;
    for (let subjectg of Section_subjects) {
      if (periodno >= day.length - 1) {
        fitness -= fitness_dec;
      } else {
        if (subjectg.isLab) {
          let condition = period.subject.subjectName == subjectg.subjectName && day[periodno + 1].subject.subjectName == subjectg.subjectName;
          fitness = (condition) ? fitness + fitness_inc : fitness -= fitness_dec;
        }
      }
    }
    return fitness;
  }

  TeacherCollision(Genes, totalPeriods) {
    let fitness = 0;
    for (let j = 0; j < totalPeriods; j++) {
      let geneGroup = [];

      for (let i = 0; i < Genes.length; i++) {

        if (Genes[i][j] != null) {
          geneGroup.push(Genes[i].Periods[j]);
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
    return fitness;
  }

  GeneFinder(Genes, Section, DaysDescription) {

    let myGene1 = null;
    let myGene = [];
    let k = 0;
    for (let i = 0; i < Genes.length; i++) {
      if (Genes[i][0].name == Section.name) {
        myGene1 = copy(Genes[i]);
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
  return (day.find(gene => day.indexOf(gene) == subject.periodLock - 1) != undefined) ? true : false;
}

function copy(o) {

  let output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}



module.exports = Chromosome;