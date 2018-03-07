/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Scheduler/Gene');
const Chromosome = require('../Scheduler/chromosome');
const Slot = require('../Scheduler/slot');
const Period = require('../Scheduler/Period');
//imports outside package
const maxGenerations = Utility.maxGeneration;
const crossoverRate = Utility.crossoverRate;
const mutationRate = Utility.mutationRate;
const populationSize = Utility.populationSize;
const offSprings = Utility.offSprings;
const Suffler = Utility.Suffler;
const threshold = Utility.threshold;

class Generator {

  constructor(Data) {
    this.firstList = [];
    this.newList = [];
    this.Teachers = Data.Teachers;
    this.Sections = Data.Sections;
    this.totalPeriods = Data.totalPeriods;
    this.DaysDescription = Data.DaysDescription;
    this.Periods = [];
  }

  TeachertoSectionAlotter(populationCounter) {

    //Create Slots
    if (populationCounter-- <= 0) return 1;

    //generate Slots
    for (var section of this.Sections) {
      for (var teacher of this.Teachers) {
        for (var subject of section.subjects) {
          //console.log(subject);
          var Tsubjects = teacher.subjects;

          var condition = Tsubjects.includes(subject.subjectName) && (this.doesPeriodMatch(this.Periods, subject) || subject.isLab);
          if (condition) {
            this.Periods.push({
              "section": section.name,
              "subject": subject,
              "teacher": new Object({ "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority })
            }); //period object tha
          }
        }
      }
    }

    //Generating a slot ,creating Genes and by those making a new chromose and pushing it to the list
    let slot = new Slot(this.Periods, this.Sections, this.totalPeriods);
    let myGene = new Gene();
    let Genes = this.Sections.map(section => myGene.GeneCreator(slot.slots, section.name)); // Gene obkject tha

    this.firstList.push(new Chromosome(Genes, this.Sections, this.DaysDescription, this.totalPeriods));

    this.TeachertoSectionAlotter(populationCounter);
  }
  // Main method which start the process
  generate() {

    this.InitialPopulation();

    let timetable = this.createNewGenerations();
    return timetable;
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
    let adjuster = 0;
    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number
      let newListFitness = 0;

      this.newList = this.newList.concat(this.firstList.splice(0, Math.floor(populationSize / 10))); // Perform Elitism - stroring 1/10 of most fit chromosomes
      while (populationcounter < populationSize - (populationSize / 10)) {
        console.log("Cureent Generation------------------------------------> " + generation);
        console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling

        let Parents = this.SUS(offSprings);
        let Father = Parents.Father;
        let Mother = Parents.Mother;

        //Creating a new Child from Parent chromosomes
        let son = (Math.random(0, 1) < crossoverRate) ? this.crossover(Father, Mother) : Father;
        //Mutating a Gene of a son
        this.mutation(son);
        let son_fitness = son.getfitness();

        let similar_fitness = similar_offsprings(this.newList, son_fitness);
        if (similar_fitness > populationSize / 5) {
          adjuster += threshold / ((populationSize + 1) * similar_fitness / generation) * 15;
        }
        console.log("----------------------------------------------------------> current threshold: " + (threshold - adjuster) + " similars: " + similar_fitness + " curr son fit: " + son_fitness);
        if (son_fitness > (threshold - adjuster) || generation >= maxGenerations) { //condition to break loop if son staisfies Constraints
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log("--------------------------------------------------------------------------");
          console.log("optimal TimeTable According to given Parameters is found at Generation: " + generation + "  Population Number: " + populationcounter + "  with a fitness of :" + son.getfitness());
          console.log("The Time Table: ");
          console.log(son.Genes);
          return son.Genes;
        }
        this.newList.push(son);
        newListFitness += son.getfitness();
        populationcounter++;
      }
      this.firstList = this.newList;
      this.newList = [];
      this.firstList.sort((a, b) => b.fitness - a.fitness);
      generation++;

    }
  }

  crossover(Father, Mother) {
    let index = Math.floor(Math.random(0, this.Sections.length));
    let FatherGene1 = Father.Genes[index].splice(0, Father.Genes[index].length / 2);
    let FatherGene2 = Father.Genes[index];

    let MotherGene1 = Mother.Genes[index].splice(0, Mother.Genes[index].length / 2);
    let MotherGene2 = Mother.Genes[index];
    Father.Genes[index] = FatherGene1.concat(MotherGene2);
    Mother.Genes[index] = FatherGene2.concat(MotherGene1);

    return (Father.getfitness() > Mother.getfitness()) ? Father : Mother;
  }
  //Mutates the son
  mutation(son) {
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
    for (let P of points) {
      let i = 0;
      let currentFitness = 0;
      while (currentFitness < P && i < this.firstList.length - 1) {
        currentFitness += this.firstList[i++].fitness;
      }
      keep.push(this.firstList[--i]);
    }
    return keep;
  }
  doesPeriodMatch(Periods, subject) {
    return !Periods.some(period => period.subject.subjectName === subject.subjectName);
  }
}

function similar_offsprings(List, son_fitness) {
  return List.filter(gene => Math.floor(gene.fitness) == Math.floor(son_fitness)).length;
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
module.exports = Generator;