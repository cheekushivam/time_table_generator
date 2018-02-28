/*jslint node: true */
"use strict";

const Gene = require('../Gene');
const utility = require('../utility');
const crossoverRate = utility.crossoverRate;
const mutationRate = utility.mutationRate;
class Chromosome {
  constructor(noSections, className) {
    this.noSections = noSections;
    this.fitness = this.getfitness();
    this.Genes = [];
    for (let i = 0; i < noSections; i++) {
      this.Genes.push(new Gene(className[i]));
    }
  }
  getfitness() {
    //calculate fitness of a chromosome
  }
}