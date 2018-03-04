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
    this.Teachers = Data.Teacher.map(teacher => new Teacher(teacher.name, teacher.subjects, teacher.priorities));
    this.Sections = Data.Sections.map(section => new Section(section.name, section.subjects));
    this.Period = [];
  }
  TeachertoSectionAlotter() {
    //Create Slots

    //generate Slots

    let slot = new Slot(this.Period, this.Sections);
    return slot.slots;
  }

  //Creates the Very first population to start Genetic Algorithm
  InitialPopulation() {
    for (let i = 0; i < populationSize; i++) {
      let slots = this.TeachertoSectionAlotter();
      let Genes = Array(this.Sections.length).fill().map(new Gene(slots, this.section[i]));
      this.firstList.push(new Chromosome(Genes));
    }
    //sorting the population according to their fitness in descending order
    this.firstList.sort((a, b) => b.fitness - a.fitness);

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number
    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number
      let newListFitness = 0;

      this.newList.concat(Utility.copy(this.firstList.splice(0, 11))); // Perform Elitism - stroring 1/10 of most fit chromosomes

      while (populationcounter < populationSize) {

        let Parents = this.SUS(2); //Selecting Parents using Stochastic universal sampling
        let Father = Parents[0];
        let Mother = Parents[1];

        //Creating a new Child from Parent chromosomes
        let son = (Math.random(0, 1) < crossoverRate) ? this.crossover(Father, Mother) : Father;

        //Mutating a Gene of a son
        son = this.mutation(son);

        if (true) { //condition to break loop if son staisfies Constraints

          break;
        }
        this.newList.push(son);
        newListFitness += son.getfitness();
        populationcounter++;
      }
      generation++;
    }
  }

  crossover(Father, Mother) {

  }
  //Mutates the son
  mutation() {

  }
  //Stochastic universal sampling for Parent Selection
  SUS(N) { // N: Number of offsprings to keep
    let F = this.firstList.reduce((acc, val) => acc += val);
    let P = Math.abs(F / N); //P: Distance between the roullete wheel pointers
    let start = Math.random(0, P);
    let pointers = [];
    for (let i = 0; i < N; i++) {
      pointers.push(start + i * P);
    }
    return this.RoulleteWheel(pointers);

  }
  // This method picks a parent by a chance of their probability
  RoulleteWheel(points) {
    let keep = [];
    points.forEach((P, index) => {
      let i = 0;
      let currentFitness = 0;
      while (currentFitness < P) {
        currentFitness += this.firstList[i].fitness;
        i++;
      }
      keep.push(this.firstList[--i].fitness);
    });
    return keep;
  }
}