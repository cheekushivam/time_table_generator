/*jslint node: true */
"use strict";

const Gene = require('../Scheduler/Gene');
const utility = require('../utility');

class Chromosome {
  constructor(Genes, Sections, DaysDescription, totalPeriods) {
    this.Genes = utility.copy(Genes);
    this.fitness = this.getfitness();
    this.Sections = Sections;
    this.DaysDescription = DaysDescription;
    this.totalPeriods = totalPeriods;
  }
  getfitness() {
    //calculate fitness of a chromosomes
    let fitness = 0;

    this.sections.forEach((section, index) => {
      let myGene1 = [];
      let myGene = [];
      for (let i = 0; i < this.Genes.length; i++) {
        if (this.Genes[i].sectionName === section.sectionName) {
          myGene1 = this.Genes[i];
          break;
        }
      }
      var k = 0;
      while (myGene1.length > 0) {
        myGene.push(myGene1.splice(0, this.DaysDescription[k].periods));
        k++;
      }

      // To Find that teacher priority is statisfied or not - Soft Constraint
      myGene.forEach((day, z) => {
        day.forEach((period, periodno) => { // Genes contains objects of Period class
          let teacher = period.teacher;
          if (teacher.priority === periodno) {
            fitness++;
          }
          // To find lab constraints - Hard Constraint
          section.subjects.forEach((subjectg, m) => {
            if (period.subject.subjectName == subjectg.subjectName && subjectg.isLab && day[periodno + 1].subject.subjectName == subjectg.subjectName) {
              fitness++;
            } else {
              fitness--;
            }
          });
        });
        // To find that periodLock is satisfied or not - Hard Constraint
        section.subjects.forEach((subject, i) => {
          let findLock = day.find(gene => day.indexof(gene) == subject.periodLock);
          fitness = (findLock) ? fitness + 1 : fitness - 1;

          //Max period exceed per day - Hard Constraint
          let subjectcount = day.filter(gene => gene.subject.subjectName == subject.subjectName).length;
          fitness = (subjectcount < utility.max_periods_per_day) ? fitness + 1 : fitness - 1;

          //Max period exceed per week - Hard Constraint
          let GenePool = [];
          for (let i = 0; i < this.Genes.length; i++) {
            GenePool = GenePool.concat(this.Genes[i]);
          }
          let maxSubjectCount = GenePool.filter(gene => gene.subject.subjectName === subject.subjectName).length;
          if (maxSubjectCount == utility.max_periods_per_week) {
            fitness++;
          } else if (maxSubjectCount > utility.max_periods_per_week) {
            fitness--;
          }

        });
      });
    });

    // Teachers clash at same period - Hard Constraint
    for (let j = 0; j < this.totalPeriods; j++) {
      let geneGroup = [];
      for (let i = 0; i < this.Genes.length; i++) {

        geneGroup.push(this.Genes[i][j]);
      }
      let matched = false;
      for (let k = 0; k < geneGroup.length; k++) {
        for (let t = 0; t < geneGroup.length; k++) {
          if (geneGroup[k].teacher.name == geneGroup[t].teacher.name) {
            matched = true;
            break;
          }
        }
        fitness = matched ? fitness-- : fitness++;
      }
    }

    return 1 / fitness;
  }
}