/*jslint node: true */
"use strict";

const Gene = require('../Gene');
const utility = require('../utility');

class Chromosome {
  constructor(Genes) {
    this.Genes = utility.copy(Genes);
    this.fitness = getfitness();

  }
  getfitness() {
    //calculate fitness of a chromosome
  }
}