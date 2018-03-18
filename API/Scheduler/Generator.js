/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Scheduler/Gene');
const Chromosome = require('../Scheduler/chromosome');
const Slot = require('../Scheduler/slot');
const Period = require('../Scheduler/Period');
var _ = require('lodash/');
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
    this.Teachers = _.cloneDeep(Data.Teachers);
    this.Sections = _.cloneDeep(Data.Sections);
    this.totalPeriods = Data.totalPeriods;
    this.DaysDescription = _.cloneDeep(Data.DaysDescription);
    this.Periods = [];
  }

  TeachertoSectionAlotter(populationCounter) {
    //Create Slots
    if (populationCounter-- <= 0) return 1;
    //generate Slots
    for (var section of this.Sections) {
      for (var subject of section.subjects) {
        for (var teacher of this.Teachers) {

          //console.log(subject);
          var Tsubjects = teacher.subjects;

          var condition = Tsubjects.includes(subject.subjectName) && this.doesPeriodMatch(this.Periods, subject.subjectName, section);
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
    this.population_fitness_normalizer();

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number

    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number

      //creating a mating pool and adding best 10 percent and random 5 percent population
      this.newList = _.cloneDeep(_.take(this.firstList, this.firstList.length / 5)); // Perform Elitism - stroring 1/10 of most fit chromosomes


      //Shuffling the chances of getting slected
      this.firstList = _.shuffle(this.firstList);
      while (populationcounter < populationSize - (populationSize / 5)) {
        //console.log("Cureent Generation------------------------------------> " + generation);
        //  console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling
        let Parents = _.cloneDeep(this.SUS(offSprings));
        let Parent1 = Parents[0];
        let Parent2 = Parents[1];
        let Parent3 = Parents[2];
        let Parent4 = Parents[3];

        //Creating a new Child from Parent chromosomes
        let son = _.cloneDeep((Math.random(0, 1) < crossoverRate) ? Parent1.crossover(Parent2, Parent3, Parent4) : Parents[Math.floor(Math.random() * Parents.length)]);
        //Mutating a Gene of a son
        son = _.cloneDeep((Math.random(0, 1) < mutationRate) ? son.mutation() : son);

        this.newList.push(son);
        populationcounter++;
      }
      this.firstList = this.newList;
      this.newList = [];
      this.population_fitness_normalizer();
      //  console.log("----------------------------------------------------------> current threshold: " + (threshold - adjuster) + " similars: " + similar_fitness + " curr son fit: " + son_fitness);

      if (this.firstList[0].fitness >= threshold || generation >= maxGenerations) { //condition to break loop if son staisfies Constraints
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("--------------------------------------------------------------------------");
        console.log("optimal TimeTable According to given Parameters is found at Generation: " + generation + "  Population Number: " + (populationcounter - 1) + "  with a fitness of :" + this.firstList[0].fitness);
        console.log(this.firstList[0].Genes[0].length);
        console.log(this.firstList[0].Genes[1].length);
        return this.finalResultGenerator(this.firstList[0].Genes, this.firstList[0].fitness);
      }
      generation++;

    }
  }


  population_fitness_normalizer() {
    console.log(this.firstList.length);
    let total_fit = _.sumBy(this.firstList, chromose => chromose.fitness);
    this.firstList = this.firstList.map(obj => { obj.fitness = obj.fitness / total_fit * 100; return obj; });
    this.firstList.sort((a, b) => b.fitness - a.fitness);
    console.log(this.firstList[0].fitness);
    console.log(this.firstList[populationSize - 1].fitness);
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
    return this.RoulleteWheel(pointers);

  }
  // This method picks a parent by a chance of their probability
  RoulleteWheel(points) {
    let keep = [];
    for (let P of points) {
      let i = 0;
      let currentFitness = 0;
      while (currentFitness < P && i < this.firstList.length - 1) {
        currentFitness += this.firstList[i++].fitness;
        //  console.log(i);
      }
      if (i != 0) {
        --i;
      }
      let p = _.cloneDeep(this.firstList[i]);
      keep.push(p);
    }

    return keep;
  }

  doesPeriodMatch(Periods, subject, section) {

    return !Periods.find(period => (period.subject.subjectName == subject && period.section == section.name));
  }

  finalResultGenerator(Genes, fitness) {
    let timetable = [];
    timetable['periods'] = [];
    for (let gene of Genes) {

      let t = 0;
      let periods = gene.map(period => {
        let index = gene.indexOf(period);

        if ((index % this.DaysDescription[t].Period) == 0 && index != 0) {
          t++;

        }
        if (t >= this.DaysDescription.length) t--;
        let periodno = (index % this.DaysDescription[t].Period) + 1;

        return new Object({ "period": periodno, "subject": period.subject.subjectName, "teacher": period.teacher.name });
      });

      timetable.periods.push({ "sectionName": gene[0].name, "periods": periods });
    }

    //  console.log(timetable);
    timetable['fitness'] = fitness;
    return timetable;
  }
}

function similar_offsprings(List, son_fitness) {
  return List.filter(gene => Math.floor(gene.fitness) == Math.floor(son_fitness)).length;
}


module.exports = Generator;