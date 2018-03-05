/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Gene');
const Chromosome = require('../chromosome');
const Teacher = require('../teacher');
const Section = require('../section');
const Slot = require('../slot');
const Period = require('../Period');
//imports outside package
const maxGenerations = Utility.maxGenerations;
const crossoverRate = Utility.crossoverRate;
const mutationRate = Utility.mutationRate;
const populationSize = Utility.populationSize;
const offSprings = Utility.offSprings;
const Suffler = Utility.Suffler;

class Generator {

  constructor(Data) {
    this.firstList = [];
    this.newList = [];
    this.Teachers = Data.Teachers;
    this.Sections = Data.Sections;
    this.WorkingTime = Data.totalPeriods;
    this.Periods = [];
  }
  TeachertoSectionAlotter(populationCounter) {
    //Create Slots
    if (populationCounter-- < 0) return;

    //generate Slots
    this.sections.forEach((section, index) => {

      this.Teachers.forEach((teacher, m) => {
        section.subjects.forEach((subject, i) => {
          let Tsubjects = teacher.subjects;
          if (Tsubjects.contains(subject.subjectName) && (!this.Periods.some(period => period.teacher === teacher) || subject.isLab)) {
            this.Periods.push(new Period(section.SectionName, subject, teacher));
            return;
          }

        });
      });
    });
    //Generating a slot ,creating Genes and by those making a new chromose and pushing it to the list
    let slot = new Slot(this.Period, this.Sections, this.totalPeriods);
    let Genes = this.Sections.map(section => new Gene(slot.slots, section.sectionName));
    this.firstList.push(new Chromosome(Genes, this.Sections, this.DaysDescription, this.totalPeriods));
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
        son.mutation();

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
    let index = Math.floor(Math.random(0, this.Sections.length));
    let FatherGene1 = Utility.copy(Father.Genes[index].splice(0, Father.Genes[index].length / 2));
    let FatherGene2 = Utility.copy(Father.Genes[index]);
    //Father.Gene[index] = Utility.copy(Mother.Gene[index].splice(0, Mother.Gene[index].length / 2));
    let MotherGene1 = Utility.copy(Mother.Genes[index].splice(0, Mother.Genes[index].length / 2));
    let MotherGene2 = Utility.copy(Mother.Genes[index]);
    Father.Genes[index] = FatherGene1.concat(MotherGene2);
    Mother.Genes[index] = FatherGene2.concat(MotherGene1);
    return (Father.getfitness() > Mother.getfitness()) ? Father : Mother;
  }
  //Mutates the son
  mutation() {
    let son = this;
    let indexes = [];
    for (let i = 0; i < Suffler; i++) {
      indexes.push(this.suffleIndex(son.Genes));
    }
    indexes.forEach((index, i) => {
      let suffleIndex = this.suffleIndex(son.Genes[index]);
      let tempGene = son.Gene[suffleIndex];
      let nextSuffleIndex = this.suffleIndex(son.Gene[index]);
      son.Genes[suffleIndex] = son.Genes[nextSuffleIndex];
      son.Genes[nextSuffleIndex] = tempGene;
    });
    return son;
  }
  //Suporter function to generate random index for swapping
  suffleIndex(object) {
    return Math.floor(Math.random(0, object.length));
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