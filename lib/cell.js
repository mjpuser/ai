'use strict';

const through2 = require('through2');

// this.id = id;
// this.dendrites = dendrites; // connections to this cell
// this.synapse = synapse; // connection to another cell
// this.threshold = threshold; // % of dendrites that need to be activated to turn on cell


// should have idea of who is around?
// the "critical period" is when dendrites die.  This should speed up
// processing times, but kills chance of learning it's function.

// CELL TYPES
// granule cell
// pyramidal cell - rooted in L1, and nearby L3/L5, out L6, L7 (other areas)
// stellate cell
// horizontal cell - rooted in L1 (complex cells?) accept from Martinotti
// martinotti cell - rooted and nearby in L4, L6, out L1,2,3
// simple, complex, hypercomplex, receptive fields!!!
// https://en.wikipedia.org/wiki/Receptive_field
// Should I be monitoring the SDRs... the mind?
// different


// circuits shouldn't be viewed as "what are they doing in general"... Circuits should
// be viewed as structures that solve a task.  Like, is this a line?  Is this a curve?  Is
// it moving left?  color? etc...

const REFRACTOR_MULTIPLIER = 2;

/**
* Create a cell.
* @param {Number} state - initial state of the cell.
* @param {Number} threshold - threshold needed for the cell to hit to create an impulse
* @param {Number} trasmitter - the value transmitted when the impulse is triggered
*/
const ActionPotential = function ({state, threshold, transmitter}) {
   state = state || 0;
   threshold = threshold || 10;
   transmitter = transmitter || 10;
   let refractory = false;
   // impulses are constantly being restored to 0 over time.  X number of
   // impulses have to come in around the same time.

   // during action potential, there is a bit of time where the neuron
   // doesn't accept new inputs called the refractory period

   const neutralize = () => {
      if (state) {
         process.nextTick(() => {
            state = parseInt(state / REFRACTOR_MULTIPLIER);
            if (state) {
               neutralize();
            }
            else {
               refractory = false;
            }
         });
      }
   };
   const sum = (input) => {
      state = input.reduce((sum, val) => {
         return sum + val;
      }, state);
   };
   const impulse = (cell) => {
      process.nextTick(() => {
         state = threshold * 3;
         refractory = true;
         cell.push(transmitter);
         neutralize();
      });
   };


   return through2({
      objectMode: true
   },
   function (input, encoding, callback) {
      //console.log('state', state, 'refractory', refractory, 'multiplier', REFRACTOR_MULTIPLIER);
      if (refractory) {
         return callback();
      }
      sum(input);
      if (state >= threshold) {
         impulse(this);
      }
      else {
         neutralize();
      }
      callback();
   });
};


const NEUTRALIZE_MULTIPLIER = 1.5;
const GradedPotential = function ({max, min, state, transform}) {
   state = state || 0;
   max = max || 20;
   min = min || -20;
   transform = transform || (s) => s;


   const neutralize = (cell) => {
      if (state) {
         process.nextTick(() => {
            state = parseInt(state / NEUTRALIZE_MULTIPLIER);
         });
         impulse(cell);
      }
   };
   const sum = (input) => {
      state = input.reduce((sum, val) => {
         return sum + val;
      }, state);
   };
   const impulse = (cell) => {
      process.nextTick(() => {
         cell.push(transform(state));
         neutralize(cell);
      });
   };


   return through2({
      objectMode: true
   },
   function (input, encoding, callback) {
      //console.log('state', state, 'refractory', refractory, 'multiplier', REFRACTOR_MULTIPLIER);
      if (refractory) {
         return callback();
      }
      sum(input);
      impulse(this);
      callback();
   });
};


module.exports = {
   ActionPotential,
   GradedPotential
};
