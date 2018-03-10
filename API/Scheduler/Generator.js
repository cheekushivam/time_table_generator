/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Scheduler/Gene');
const Chromosome = require('../Scheduler/chromosome');
const Slot = require('../Scheduler/slot');
const Period = require('../Scheduler/Period');
var fp = require('lodash/fp');
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
    this.matingPool = [];
    this.newList = [];
    this.Teachers = fp.cloneDeep(Data.Teachers);
    this.Sections = fp.cloneDeep(Data.Sections);
    this.totalPeriods = Data.totalPeriods;
    this.DaysDescription = fp.cloneDeep(Data.DaysDescription);
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

          var condition = Tsubjects.includes(subject.subjectName) && (this.doesPeriodMatch(this.Periods, subject)); //removed islab
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
    //  console.log(this.Periods.length);
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
    //return this.finalResultGenerator(fp.cloneDeep(this.firstList[0].Genes));
    let timetable = this.createNewGenerations();
    return timetable;
  }

  //Creates the Very first population to start Genetic Algorithm
  InitialPopulation() {
    this.TeachertoSectionAlotter(populationSize);

    //sorting the population according to their fitness in descending order

    this.population_fitness_normalizer();
    return;
  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number
    let adjuster = 0;
    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number

      //creating a mating pool and adding best 10 percent and random 5 percent population
      this.matingPool = fp.cloneDeep(_.take(this.firstList, this.firstList.length / 10)); // Perform Elitism - stroring 1/10 of most fit chromosomes
      this.matingPool.concat(_.sampleSize(this.firstList, this.firstList.length / 20))

      //Shuffling the chances of getting slected
      this.matingPool = _.shuffle(this.matingPool);


      while (populationcounter <= populationSize) {
        //console.log("Cureent Generation------------------------------------> " + generation);
        //  console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling
        let Parents = this.SUS(offSprings);
        //Creating a new Child from Parent chromosomes
        let son = fp.cloneDeep((Math.random(0, 1) < crossoverRate) ? this.crossover(fp.cloneDeep(Parents.Father), fp.cloneDeep(Parents.Mother)) : Parents.Father);
        //Mutating a Gene of a son
        son = fp.cloneDeep((Math.random(0, 1) < mutationRate) ? this.mutation(son) : son);
        // let similar_fitness = similar_offsprings(this.newList, son_fitness);
        //
        // if (similar_fitness > populationSize / 5) {
        //   adjuster += threshold / ((populationSize + 1) * similar_fitness / (generation + 1)) * 15;
        // }
        this.newList.push(son);
        populationcounter++;
      }
      this.firstList = this.newList;
      this.newList = [];
      this.population_fitness_normalizer();
      //  console.log("----------------------------------------------------------> current threshold: " + (threshold - adjuster) + " similars: " + similar_fitness + " curr son fit: " + son_fitness);

      if (this.firstList[0].fitness > (threshold - adjuster) || generation >= maxGenerations) { //condition to break loop if son staisfies Constraints
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("--------------------------------------------------------------------------");
        console.log("optimal TimeTable According to given Parameters is found at Generation: " + generation + "  Population Number: " + (populationcounter - 1) + "  with a fitness of :" + this.firstList[0].fitness);
        console.log(this.firstList[0].Genes[0].length);
        console.log(this.firstList[0].Genes[1].length);
        console.log("The Time Table: ");
        return this.finalResultGenerator(this.firstList[0].Genes);
      }
      generation++;

    }
  }









  crossover(Father, Mother) {
    let Genes = [];

    for (let index = 0; index < this.Sections.length; index++) {
      let parent1 = this.matingPool[Math.floor(Math.random() * this.matingPool.length)].Genes[index];
      let parent2 = this.matingPool[Math.floor(Math.random() * this.matingPool.length)].Genes[index];
      let parent = parent1.concat(parent2);
      Genes[index] = _.take(Father.Genes[index], Father.Genes[index].length / 4)
        .concat(_.takeRight(Mother.Genes[index], Mother.Genes[index].length / 4))
        .concat(_.sampleSize(parent, parent.length / 4));

    }


    let son = new Chromosome(Genes, this.Sections, this.DaysDescription, this.totalPeriods);
    return son;
    return son;
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
    return Math.floor(Math.random() * object.length);
  }

  population_fitness_normalizer() {
    let avg_fit = _.meanBy(this.firstList, chromose => chromose.fitness);
    let sqr_diff = _.compact(this.firstList.map(obj => Math.sqrt((obj.fitness - avg_fit))));
    let avg_sqdiff = _.mean(sqr_diff);
    let std_dev = Math.sqrt(avg_sqdiff);
    let S = 0;
    this.firstList = this.firstList.map(obj => { obj.fitness = S + (obj.fitness - avg_fit) / 2 * std_dev; return obj; });
    this.firstList.sort((a, b) => b.fitness - a.fitness);
    console.log(this.firstList[0].fitness);
    console.log(this.firstList[populationSize - 1].fitness);
  }

  //Stochastic universal sampling for Parent Selection
  SUS(N) { // N: Number of offsprings to keep

    let F = this.matingPool.reduce((acc, val) => acc += val.fitness, 0);
    let P = F / N; //P: Distance between the roullete wheel pointers
    let start = Math.random(0, P);
    let pointers = [];
    for (let i = 0; i < N; i++) {
      pointers.push(start + i * P);
    }

    let Parents = this.RoulleteWheel(pointers); //Selecting Parents using Stochastic universal sampling
    let Father = Parents[Math.floor(Math.random() * Parents.length)];
    let Mother = Parents[Math.floor(Math.random() * Parents.length)];
    return { Father: Father, Mother: Mother };

  }
  // This method picks a parent by a chance of their probability
  RoulleteWheel(points) {
    let keep = [];
    for (let P of points) {
      let i = 0;
      let currentFitness = 0;
      while (currentFitness < P && i < this.matingPool.length - 1) {
        currentFitness += this.matingPool[i++].fitness;
        //  console.log(i);
      }
      if (i != 0) {
        --i;
      }
      let p = fp.cloneDeep(this.matingPool[i]);
      keep.push(p);
    }

    return keep;
  }

  doesPeriodMatch(Periods, subject) {
    return !Periods.some(period => period.subject.subjectName === subject.subjectName);
  }

  finalResultGenerator(Genes) {
    let timetable = [];

    for (let gene of Genes) {

      let t = 0;
      let periods = gene.map(period => {
        let index = gene.indexOf(period);
        let periodno = (index % this.DaysDescription[t].Period) + 1;
        if (periodno == 1 && index != 0) {
          t++;
        }

        return new Object({ "period": periodno, "subject": period.subject.subjectName, "teacher": period.teacher.name });
      });

      timetable.push({ "sectionName": gene[0].name, "periods": periods });
    }

    //  console.log(timetable);
    return timetable;
  }
}

function similar_offsprings(List, son_fitness) {
  return List.filter(gene => Math.floor(gene.fitness) == Math.floor(son_fitness)).length;
}


module.exports = Generator;