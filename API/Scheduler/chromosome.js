/*jslint node: true */
"use strict";
const utility = require('../utility');
var _ = require('lodash/');
let fitness_inc = 1;
let fitness_dec = 4;

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



    fitness += this.constraints_per_day(this.Genes, _.cloneDeep(this.Sections), _.cloneDeep(this.DaysDescription));
    // Teachers clash at same period - Hard Constraint
    fitness += this.TeacherCollision(_.cloneDeep(this.Genes), this.totalPeriods);


    return fitness;
  }
  constraints_per_day(Genes, Sections, DaysDescription) {
    let fitness = 0;
    for (let section of Sections) {
      var myGene = this.GeneFinder(Genes, section, DaysDescription);
      for (let subject of section.subjects) {
        //Max period exceed per week - Hard Constraint
        let constraint = (subject.isLab) ? utility.max_periods_per_day : utility.max_periods_per_week;
        fitness += this.subjectCount_per_week(_.flatMap(myGene), subject) <= constraint ? fitness_inc : (subject.isLab) ? -fitness_dec * 4 : -fitness_dec;
        let day_found = true;
        for (let day of myGene) {
          //Max period exceed per day - Hard Constraint
          fitness += this.subjectCount(day, subject, myGene) <= utility.max_periods_per_day ? fitness_inc : -fitness_dec * 4; // checked
        }
      }
    }
    return fitness;
  }

  Teacher_priority(day) {
    let matched = day.filter(period => (period.teacher.priority <= 0) ? true : period.teacher.priority - 1 == day.indexOf(period));
    return matched.length;
  }

  Lab_constraint(subject, day, myGene) {
    let periodno = _.findIndex(day, period => period.subject.subjectName == subject.subjectName);
    if (periodno == -1 || periodno == day.length - 1) return false;
    return !(day[periodno + 1].subject.subjectName == subject.subjectName && (subject.periodLock <= 0) ? true : (subject.periodLock - 1 == periodno && myGene.indexOf(day) == subject.day - 1) ? true : false);
  }

  TeacherCollision(Genes, totalPeriods) {
    let fitness = 0;

    for (let j = 0; j < totalPeriods; j++) {
      for (let i = 0; i < Genes.length - 1; i++) {
        for (let k = i + 1; k < Genes.length; k++) {
          if (Genes[i][j].teacher == Genes[k][j].teacher) fitness -= fitness_dec * 4;
        }
      }
    }
    return fitness;
  }


  GeneFinder(Genes, Section, DaysDescription) {
    let flattenArray = _.flatMap(Genes, gene => gene);
    let myGene = _.filter(flattenArray, selected => selected.name == Section.name);
    let selected = [];

    while (DaysDescription.length > 0) {
      let length = DaysDescription.shift().Period;
      selected.push(myGene.splice(0, length));
    }
    return selected;
  }


  crossover(Parent2, Parent3, Parent4) {
    let Parent1 = this;
    let Genes = []
    for (let index = 0; index < this.Sections.length; index++) {
      let parent = Parent3.Genes[index].concat(Parent4.Genes[index]);
      Genes[index] = _.take(Parent1.Genes[index], Math.floor(Parent1.Genes[index].length / 4))
        .concat(_.sampleSize(parent, Math.floor(parent.length / 4)))
        .concat(_.takeRight(Parent2.Genes[index], Math.ceil(Parent2.Genes[index].length / 4)));
    }

    let son = new Chromosome(Genes, this.Sections, this.DaysDescription, this.totalPeriods);
    return son;

  }
  //Mutates the son
  mutation() {
    let son = this;
    let indexes = [];
    for (let i = 0; i <= Math.floor(Math.random() * son.Genes.length); i++) {
      indexes.push(this.suffleIndex(son.Genes));
    }
    indexes.forEach((index, i) => {
      for (let i = 0; i < utility.shuffler; i++) {
        let suffleIndex = this.suffleIndex(son.Genes[index]);
        let tempGene = son.Genes[index][suffleIndex];
        let nextSuffleIndex = this.suffleIndex(son.Genes[index]);
        son.Genes[index][suffleIndex] = _.cloneDeep(son.Genes[index][nextSuffleIndex]);
        son.Genes[index][nextSuffleIndex] = _.cloneDeep(tempGene);
      }
    });
    return son;
  }
  // Helper functions

  //Suporter function to generate random index for swapping
  suffleIndex(object) {
    return Math.floor(Math.random() * object.length);
  }

  subjectCount_per_week(day, subject) {
    return day.filter(gene => (gene.subject.subjectName == subject.subjectName)).length;
  }
  subjectCount(day, subject, myGene) {
    return day.filter(gene => (gene.subject.subjectName == subject.subjectName)); // && (subject.periodLock <= 0) ? true : subject.periodLock - 1 == day.indexOf(gene) && myGene.indexOf(day) == subject.day - 1 ? true : false)).length;
  }

  //class End
}

module.exports = Chromosome;