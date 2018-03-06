/*jslint node: true */
"use strict";

const utility = require('../utility');

class Chromosome {
  constructor(Genes, Sections, DaysDescription, totalPeriods) {
    console.log("Entered chromosome");
    this.Genes = Genes;
    this.Sections = Sections;
    this.DaysDescription = DaysDescription;
    this.totalPeriods = totalPeriods;
    this.fitness = this.getfitness();
  }
  getfitness() {
    //calculate fitness of a chromosomes
    let fitness = 0;
    fitness += this.constraints_per_day(copy(this.Genes), copy(this.Sections), copy(this.DaysDescription));
    // Teachers clash at same period - Hard Constraint
    fitness += this.TeacherCollision(copy(this.Genes), copy(this.totalPeriods));
    console.log("Exit");
    console.log(fitness);
    return 1 / fitness;
  }
  constraints_per_day(Genes, Sections, DaysDescription) {
    let fitness = 0;
    for (let section of Sections) {
      let myGene = this.GeneFinder(Genes, section, DaysDescription);
      // To Find that teacher priority is statisfied or not - Soft Constraint
      for (let k = 0; k < myGene.length; k++) {
        let day = copy(myGene[k]);
        for (let [periodno, period] of day.entries()) { // Genes contains objects of Period class
          //To find Teacher Priority is met - Soft Constraint
          let teacher = period.teacher;
          fitness += this.Teacher_priority(teacher, periodno);
          // To find lab constraints - Hard Constraint
          let Section_subjects = copy(section.subjects);
          fitness += this.Lab_constraint(Section_subjects, day, periodno, period);
        }
        // To find that periodLock is satisfied or not - Hard Constraint
        for (let subject of section.subjects) {

          if (subject.periodLock != -1) {
            fitness = (findLock(day, subject)) ? fitness + 1 : fitness - 1;
          }
          //Max period exceed per day - Hard Constraint
          fitness = (subjectCount(day, subject) < utility.max_periods_per_day) ? fitness + 1 : fitness - 1;

          //Max period exceed per week - Hard Constraint
          fitness += this.max_period_per_week(Genes, subject);
        }
      }
    }
    console.log("Finished" + this.constraints_per_day.name);
    return fitness;
  }
  max_period_per_week(Genes, subject) {
    let fitness = 0;
    let geniee = [];
    for (let i = 0; i < Genes.length; i++) {
      geniee = geniee.concat(Genes[i]);
    }
    let GenePool = copy(geniee);
    let maxSubjectCount = subjectCount(GenePool, subject);

    if (maxSubjectCount == utility.max_periods_per_week) {
      fitness += 2;
    } else if (maxSubjectCount > utility.max_periods_per_week) {
      fitness--;
    }
    console.log("Finished: " + this.max_period_per_week.name);
    return fitness;
  }
  Teacher_priority(teacher, periodno) {
    let fitness = 0;
    if (teacher.priority === periodno) {
      fitness += 2;
    }
    console.log("Finished: " + this.Teacher_priority.name);
    return fitness;
  }
  Lab_constraint(Section_subjects, day, periodno, period) {
    let fitness = 0;
    for (let subjectg of Section_subjects) {
      console.log("----");
      if (periodno >= day.length - 1) return fitness--;
      console.log(day.length);
      if (subjectg.isLab) {
        console.log("------------------------------------>read me " + period.subject.subjectName);
        let condition = false;
        try {
          condition = period.subject.subjectName == subjectg.subjectName && day[periodno + 1].subject.subjectName == subjectg.subjectName;
        } catch (err) {
          throw new Error(err);
        }
        console.log(condition);
        fitness = (condition) ? fitness + 2 : fitness--;
      }
    }
    console.log("Finished: " + this.Lab_constraint.name);
    return fitness;
  }

  TeacherCollision(Genes, totalPeriods) {
    let fitness = 0;
    for (let j = 0; j < totalPeriods; j++) {
      let geneGroup = [];
      console.log("First loop");
      for (let i = 0; i < Genes.length; i++) {
        console.log("second loop");
        //  console.log(this.Genes[i][j]);
        if (Genes[i][j] != null)
          geneGroup.push(Genes[i].Periods[j]);
      }

      let matched = false;
      console.log("third loop");
      for (let k = 0; k < geneGroup.length; k++) {
        console.log("fourth loop");
        for (let t = 0; t < geneGroup.length; t++) {

          if (geneGroup[k].teacher.name == geneGroup[t].teacher.name) {
            matched = true;
            break;
          }
        }
        console.log("matched :" + matched);
        fitness = matched ? fitness-- : fitness += 2;

      }
    }
    console.log("Finished: " + this.TeacherCollision.name);
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
      myGene.push(copy(temp));
    } while (myGene1.length > 0);
    console.log("------------------------->Iterting for " + myGene[0][0].name);
    console.log("Finished: " + this.GeneFinder.name);
    return myGene;
  }

  //class End
}


// Helper functions

function subjectCount(day, subject) {
  return day.filter(gene => gene.subject.subjectName == subject.subjectName).length;
}

function findLock(day, subject) {
  return day.find(gene => day.indexOf(gene) == subject.periodLock);
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