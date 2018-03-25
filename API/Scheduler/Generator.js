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
    // for (let i = populationCounter; i >= 0; i--) {
    if (populationCounter-- <= 0) return 1;
    //generate Slots
    for (var section of this.Sections) {
      for (var subject of section.subjects) {
        for (var teacher of this.Teachers) {

          //console.log(subject);
          var Tsubjects = teacher.subjects;

          var condition = Tsubjects.includes(subject.subjectName) && this.doesPeriodMatch(this.Periods, subject.subjectName, section);
          if (condition) {
            this.Periods.push(new Object({
              "section": section.name,
              "subject": subject,
              "teacher": new Object({ "name": teacher.name, "subjects": teacher.subjects, "priority": teacher.priority })
            })); //period object tha

          }

        }
      }
    }
    //Generating a slot ,creating Genes and by those making a new chromose and pushing it to the list
    let slot = new Slot(this.Periods, this.Sections, this.totalPeriods);
    let myGene = new Gene();
    let Genes = this.Sections.map(section => myGene.GeneCreator(slot.slots, section.name)); // Gene obkject tha
    // this.firstList.push());

    // }
    return new Chromosome(Genes, this.Sections, this.DaysDescription, this.totalPeriods);
  }
  // Main method which start the process
  generate() {

    let timetable = this.InitialPopulation();
    timetable = this.finalResultGenerator(timetable.Genes, timetable.fitness);
    // let timetable = this.createNewGenerations();
    return timetable;
  }

  //Creates the Very first population to start Genetic Algorithm
  InitialPopulation() {

    return this.TeachertoSectionAlotter(populationSize);
    //sorting the population according to their fitness in descending order
    //this.population_fitness_normalizer();

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number

    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number

      //creating a mating pool and adding best 10 percent and random 5 percent population
      this.newList = _.cloneDeep(_.take(this.firstList, Math.round(this.firstList.length / 10)).concat(_.sampleSize(this.firstList, Math.round(this.firstList.length / 5)))); // Perform Elitism - stroring 1/10 of most fit chromosomes


      //Shuffling the chances of getting slected
      //    this.firstList = _.shuffle(this.firstList);
      while (populationcounter < populationSize - ((populationSize / 10) + (populationSize / 5))) {
        //console.log("Cureent Generation------------------------------------> " + generation);
        //  console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling
        let Parents = _.cloneDeep(this.SUS(offSprings));
        let Parent1 = Parents[0];
        let Parent2 = Parents[1];
        let Parent3 = Parents[2];
        let Parent4 = Parents[3];

        //Creating a new Child from Parent chromosomes
        let son = _.cloneDeep((Math.random() < crossoverRate) ? Parent1.crossover(Parent2, Parent3, Parent4) : Parents[Math.floor(Math.random() * Parents.length)]);
        //Mutating a Gene of a son
        son = _.cloneDeep((Math.random() < mutationRate) ? son.mutation() : son);

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
        return this.finalResultGenerator(this.firstList[0].Genes, this.firstList[0].fitness);
      }
      generation++;

    }
  }


  population_fitness_normalizer() {
    console.log(this.firstList.length);
    // let total_fit = _.sumBy(this.firstList, chromose => chromose.fitness);
    let min_fit = _.minBy(this.firstList, chromose => chromose.fitness).fitness;
    let max_fit = _.maxBy(this.firstList, chromose => chromose.fitness).fitness;
    this.firstList = this.firstList.map(obj => {
      let diff = max_fit - min_fit;
      if (diff == 0) obj.fitness = 1 / this.firstList.length;
      else
        obj.fitness = (obj.fitness - min_fit) / diff; //(obj.fitness / total_fit) * 100; //
      return obj;
    });
    this.firstList.sort((a, b) => b.fitness - a.fitness);
    //console.log(this.firstList[0].fitness);
    //  console.log(this.firstList[populationSize - 1].fitness);
  }

  //Stochastic universal sampling for Parent Selection
  SUS(N) { // N: Number of offsprings to keep

    let F = this.newList.reduce((acc, val) => acc += val.fitness, 0);
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
      while (currentFitness < P && i < this.newList.length - 1) {
        currentFitness += this.newList[i++].fitness;
        //  console.log(i);
      }
      if (i != 0) {
        --i;
      }
      let p = _.cloneDeep(this.newList[i]);
      keep.push(p);
    }

    return keep;
  }

  doesPeriodMatch(Periods, subject, section) {

    return !Periods.find(period => (period.subject.subjectName == subject && period.section == section.name));
  }

  finalResultGenerator(Genes, fitness) {
    let timetable = [];
    timetable['Sections'] = this.period_assigner(Genes, _.cloneDeep(this.DaysDescription));
    timetable['fitness'] = fitness;
    return timetable;
  }
  period_assigner(Genes, DaysDescription) {
    let days = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
    let formatted_Genes = [];
    for (let Gene of Genes) {
      let gene = _.cloneDeep(Gene);
      let daysDescription = _.cloneDeep(DaysDescription);
      let temp = [];
      while (daysDescription.length > 0) {
        let length = daysDescription.shift().Period;
        temp.push(gene.splice(0, length));
      }
      for (let day of temp) {
        temp[temp.indexOf(day)] = new Object({
          "day": days[temp.indexOf(day)],
          "periods": day.map(period => new Object({ "period": day.indexOf(period) + 1, "subject": period.subject.subjectName, "teacher": period.teacher.name }))
        });

      }

      temp = _.flatMap(temp, period => period);
      formatted_Genes.push(new Object({ "sectionName": Gene[0].name, "timetable": temp }));
    }
    return formatted_Genes;
  }
}

function similar_offsprings(List, son_fitness) {
  return List.filter(gene => Math.floor(gene.fitness) == Math.floor(son_fitness)).length;
}


module.exports = Generator;