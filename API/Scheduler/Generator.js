/*jslint node: true */
"use strict";
//imports within package
const Utility = require('../utility');
const Gene = require('../Scheduler/Gene');
const Chromosome = require('../Scheduler/chromosome');
const Slot = require('../Scheduler/slot');
const Period = require('../Scheduler/Period');
var fp = require('lodash/fp');
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
    //console.log(this.firstList[0].Genes);
    //return this.finalResultGenerator(fp.cloneDeep(this.firstList[0].Genes));
    let timetable = this.createNewGenerations();
    return timetable;
  }

  //Creates the Very first population to start Genetic Algorithm
  InitialPopulation() {
    console.log(Utility.max_periods_per_day);
    this.TeachertoSectionAlotter(populationSize);

    //sorting the population according to their fitness in descending order
    // let avg_fit = fp.reduce(this.firstList, (sum, val) => sum + val.fitness, 0) / this.firstList.length;
    // let sqr_diff = fp.map(this.firstList, obj => Math.sqrt((obj.fitness - avg_fit))).filter(num => !isNaN(num));
    // let avg_sqdiff = fp.reduce(sqr_diff, (sum, val) => sum + val, 0) / this.firstList.length;
    // let std_dev = Math.sqrt(avg_sqdiff);
    // let S = 0;
    // this.firstList = fp.cloneDeep(fp.map(this.firstList, obj => { obj.fitness = S + (obj.fitness - avg_fit) / 2 * std_dev; return obj; }));
    this.firstList.sort((a, b) => b.fitness - a.fitness);
    console.log(this.firstList[0].fitness);
    console.log(this.firstList[populationSize - 1].fitness);

  }

  //Creates New Generations to Evolve the TimeTable
  createNewGenerations() {

    let generation = 0; // Keeping track of Generation Number
    let adjuster = 0;
    while (generation <= maxGenerations) {

      let populationcounter = 0; // Keeping Track of population Number
      let newListFitness = 0;

      this.newList = fp.cloneDeep(this.firstList.splice(0, Math.floor(populationSize / 10))); // Perform Elitism - stroring 1/10 of most fit chromosomes
      //  console.log(this.newList);
      while (populationcounter < populationSize - (populationSize / 10)) {
        //console.log("Cureent Generation------------------------------------> " + generation);
        //  console.log("Cureent population---------------> " + populationcounter);
        //Selecting Parents using Stochastic universal sampling
        //console.log(this.firstList);
        let Parents = this.SUS(offSprings);
        //console.log(Parents);
        //Creating a new Child from Parent chromosomes
        let son = fp.cloneDeep((Math.random(0, 1) < crossoverRate) ? this.crossover(fp.cloneDeep(Parents.Father), fp.cloneDeep(Parents.Mother)) : Parents.Father);
        //Mutating a Gene of a son
        son = fp.cloneDeep((Math.random(0, 1) < mutationRate) ? this.mutation(son) : son);
        let son_fitness = son.getfitness();
        //if (son_fitness < 0) return ("Bhai timetable kaise banau tu chutiya hai");
        this.newList.push(son);
        let similar_fitness = similar_offsprings(this.newList, son_fitness);

        if (similar_fitness > populationSize / 5) {
          adjuster += threshold / ((populationSize + 1) * similar_fitness / (generation + 1)) * 15;
        }
        //  console.log("----------------------------------------------------------> current threshold: " + (threshold - adjuster) + " similars: " + similar_fitness + " curr son fit: " + son_fitness);
        if (son_fitness > (threshold - adjuster) || generation >= maxGenerations) { //condition to break loop if son staisfies Constraints
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log("--------------------------------------------------------------------------");
          console.log("optimal TimeTable According to given Parameters is found at Generation: " + generation + "  Population Number: " + populationcounter + "  with a fitness of :" + son.getfitness());
          console.log(son.Genes[0].length);
          console.log(son.Genes[1].length);
          console.log("The Time Table: ");
          let selected = this.newList.sort((a, b) => b.fitness - a.fitness);
          let optimal = (son_fitness > selected[0].fitness) ? son.Genes : selected[0].Genes;
          return this.finalResultGenerator(optimal);

        }

        newListFitness += son.getfitness();
        populationcounter++;
      }
      this.firstList = this.newList;
      this.newList = [];
      // let avg_fit = fp.reduce(this.firstList, (sum, val) => sum + val.fitness, 0) / this.firstList.length;
      // let sqr_diff = fp.map(this.firstList, obj => Math.sqrt((obj.fitness - avg_fit))).filter(num => !isNaN(num));
      // let avg_sqdiff = fp.reduce(sqr_diff, (sum, val) => sum + val, 0) / this.firstList.length;
      // let std_dev = Math.sqrt(avg_sqdiff);
      // let S = 0;
      // this.firstList = fp.map(this.firstList, obj => { obj.fitness = S + (obj.fitness - avg_fit) / 2 * std_dev; return obj; });
      this.firstList.sort((a, b) => b.fitness - a.fitness);
      //console.log("----------------------------------------------------------->max: " + this.firstList[0].fitness);
      generation++;

    }
  }

  crossover(Father, Mother) {
    let index = Math.floor(Math.random(0, this.Sections.length));
    let FatherGene1 = Father.Genes[index].splice(0, Father.Genes[index].length / 2);
    let FatherGene2 = Father.Genes[index];

    let MotherGene1 = Mother.Genes[index].splice(0, Mother.Genes[index].length / 2);
    let MotherGene2 = Mother.Genes[index];
    Father.Genes[index] = fp.cloneDeep(fp.concat(FatherGene1, MotherGene2));
    Mother.Genes[index] = fp.cloneDeep(fp.concat(FatherGene2, MotherGene1));

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
    return fp.random(0, object.length);
  }

  //Stochastic universal sampling for Parent Selection
  SUS(N) { // N: Number of offsprings to keep
    //  console.log(this.newList);
    let F = this.newList.reduce((acc, val) => acc += val.fitness, 0);
    let P = F / N; //P: Distance between the roullete wheel pointers
    let start = Math.random(0, P);
    let pointers = [];
    for (let i = 0; i < N; i++) {
      pointers.push(start + i * P);
    }

    let Parents = this.RoulleteWheel(pointers); //Selecting Parents using Stochastic universal sampling
    let Father = Parents[0];
    let Mother = Parents[1];
    //  console.log(Father);
    return { Father: Father, Mother: Mother };

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
      let p = fp.cloneDeep(this.newList[i]);
      //console.log(p);
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