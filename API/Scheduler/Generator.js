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
const offSprings = Utility.offSprings;

class Generator {

  constructor(Data) {
    this.firstList = [];
    this.newList = [];
    this.Teacher = Data.Teachers;
    this.Sections = Data.Sections;
    this.Period = [];
  }
  TeachertoSectionAlotter(populationCounter) {
    //Create Slots
    if (populationCounter-- < 0) return;

    //generate Slots

    //Generating a slot ,creating Genes and by those making a new chromose and pushing it to the list
    let slot = new Slot(this.Period, this.Sections);
    let Genes = this.Sections.map(section => new Gene(slot.slots, section));
    this.firstList.push(new Chromosome(Genes));
    this.TeachertoSectionAlotter(populationCounter);
  }

  //Creates the Very first population to start Genetic Algorithm
  InitialPopulation() {

    this.TeachertoSectionAlotter(populationSize);
    //sorting the population according to their fitness in descending order

    this.firstList.sort((a, b) => b.fitness - a.fitness);

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number
    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number
      let newListFitness = 0;

      this.newList.concat(Utility.copy(this.firstList.splice(0, 10))); // Perform Elitism - stroring 1/10 of most fit chromosomes

      while (populationcounter < populationSize) {

        //Selecting Parents using Stochastic universal sampling
        let Father, Mother = this.SUS(offSprings);

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
    let F = this.firstList.reduce((acc, val) => acc += val.fitness, 0);
    let P = F / N; //P: Distance between the roullete wheel pointers
    let start = Math.random(0, P);
    let pointers = [];
    for (let i = 0; i < N; i++) {
      pointers.push(start + i * P);
    }
    let Parents = this.RoulleteWheel(pointers); //Selecting Parents using Stochastic universal sampling
    let Father = Parents[0];
    let Mother = Parents[1];

    return { Father: Father, Mother: Mother };

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