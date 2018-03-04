/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Gene');
const Chromosome = require('../chromosome');
const Teacher = require('../teacher');
const Section = require('../section');
const Slot = require('../slot');
//imports outside package
const maxGenerations = Utility.maxGenerations;
const crossoverRate = Utility.crossoverRate;
const mutationRate = Utility.mutationRate;
const populationSize = Utility.populationSize;

class Generator {

  constructor(Data) {
    this.firstList = [];
    this.newList = [];
    this.Teachers = InitTeachers(Data.Teachers);
    this.Sections = InitSections(Data.Sections);
    this.Period = [];
  }
  TeachertoSectionAlotter() {
    //Create Slots

    //generate Slots

    let slot = new Slot(this.Period, this.Sections);
    return slot.slots;
  }

  InitialPopulation() {
    for (let i = 0; i < populationSize; i++) {
      let slots = this.TeachertoSectionAlotter();
      let Genes = [];
      for (let j = 0; j < this.Sections.length; j++) {
        Genes.push(new Gene(slots, this.Sections.get(i)));
      }
      this.firstList.push(new Chromosome(Genes));
    }

  }

  createNewGenerations() {
    let generation = 0;
    while (generation <= maxGenerations) {
      let newListFitness = 0;

      generation++;
    }
  }

  crossover(Father, Mother) {

  }

  mutation() {

  }

  RoulleteWheel() {


  }


}