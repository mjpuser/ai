'use strict';

const Emitter = require('events');

class Cell extends Emitter {
  constructor({id, dendrites, synapse, threshold}) {
    this.id = id;
    this.dendrites = dendrites; // connections to this cell
    this.synapse = synapse; // connection to another cell
    this.threshold = threshold; // % of dendrites that need to be activated to turn on cell
  }
  addDendrite(dendrite) {
    this.dendrites.push(dendrite);
  }


module.exports = Cell;
