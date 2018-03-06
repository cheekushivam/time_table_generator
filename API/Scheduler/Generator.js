/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Scheduler/Gene');
const Chromosome = require('../Scheduler/chromosome');
const Teacher = require('../Scheduler/teacher');
const Section = require('../Scheduler/section');
const Slot = require('../Scheduler/slot');
const Period = require('../Scheduler/Period');
//imports outside package
const maxGenerations = Utility.maxGeneration;
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
    this.totalPeriods = Data.totalPeriods;
    this.DaysDescription = Data.DaysDescription;
    this.Periods = [];
  }

  TeachertoSectionAlotter(populationCounter) {
    console.log("Entered TeachertoSectionAlotter class");
    console.log("population Counter:" + populationCounter);
    //Create Slots
    if (populationCounter-- < 0) return 1;

    //generate Slots
    for (var section of this.Sections) {
      for (var teacher of this.Teachers) {
        for (var subject of section.subjects) {
          //console.log(subject);
          var Tsubjects = teacher.subjects;

          var condition = Tsubjects.includes(subject.subjectName) && (!this.Periods.some(period => period.subject.subjectName === subject.subjectName) || subject.isLab);
          if (condition) {
            console.log("Period Found");
            this.Periods.push({
              "section": section.name,
              "subject": subject,
              "teacher": new Object({ "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority })
            }); //period object tha
            //console.log(this.Periods[0].teacher.subjects);
          }
        }
      }
    }

    //Generating a slot ,creating Genes and by those making a new chromose and pushing it to the list
    let slot = new Slot(this.Periods, this.Sections, this.totalPeriods);
    console.log("Inside TeachertoSectionAlotter - slot allotment done");
    console.log("Generator slot");
    //console.log(slot);
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
    console.log("Exit " + this.InitialPopulation.name);

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {
    console.log("Entered " + this.createNewGenerations.name);
    let generation = 0; // Keeping track of Generation Number
    while (generation <= maxGenerations) {
      console.log("Cureent Generation------------------------------------> " + generation);
      let populationcounter = 0; // Keeping Track of population Number
      let newListFitness = 0;

      this.newList.concat(copy(this.firstList.splice(0, 10))); // Perform Elitism - stroring 1/10 of most fit chromosomes
      while (populationcounter < populationSize) {
        console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling

        let Parents = this.SUS(offSprings);
        let Father = Parents.Father;
        let Mother = Parents.Mother;

        //Creating a new Child from Parent chromosomes
        let son = this.crossover(Father, Mother); //(Math.random(0, 1) < crossoverRate) ? this.crossover(Father, Mother) : Father;
        //Mutating a Gene of a son
        this.mutation(son);

        if (son.getfitness() > 0.999 || generation >= maxGenerations) { //condition to break loop if son staisfies Constraints
          console.log("Here");
          return son;
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
    //  console.log("Finished " + this.createNewGenerations.name);
  }

  crossover(Father, Mother) {
    let index = Math.floor(Math.random(0, this.Sections.length));
    let FatherGene1 = copy(Father.Genes[index].splice(0, Father.Genes[index].length / 2));
    let FatherGene2 = copy(Father.Genes[index]);

    //Father.Gene[index] = copy(Mother.Gene[index].splice(0, Mother.Gene[index].length / 2));
    let MotherGene1 = copy(Mother.Genes[index].splice(0, Mother.Genes[index].length / 2));
    let MotherGene2 = copy(Mother.Genes[index]);
    Father.Genes[index] = FatherGene1.concat(MotherGene2);
    Mother.Genes[index] = FatherGene2.concat(MotherGene1);
    console.log("Finished " + this.crossover.name);

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
    console.log("Finished " + this.mutation.name);
    return son;
  }
  //Suporter function to generate random index for swapping
  suffleIndex(object) {
    console.log("Finished " + this.suffleIndex.name);
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
    console.log("Finished " + this.SUS.name);
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
      keep.push(this.firstList[--i]);
    });
    console.log("Finished " + this.RoulleteWheel.name);
    return keep;
  }
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