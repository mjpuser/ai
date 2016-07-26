'use strict';

const through2 = require('through2');

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

const NEUTRALIZE_MULTIPLIER = 2;

/**
 * Create a cell.
 * @param {Number} state - initial state of the cell.
 * @param {Number} threshold - threshold needed for the cell to hit to create an impulse
 * @param {Number} trasmitter - the value transmitted when the impulse is triggered
 * @param {String} color - R|G|B - Designates which color this cell reacts to
 */
const ActionPotential = function (options) {
   let {state, threshold, transmitter} = options || {};
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
            state = Math.floor(parseInt(state / NEUTRALIZE_MULTIPLIER));
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
      state += input;
   };
   const impulse = (cell) => {
      process.nextTick(() => {
         state = threshold * 3;
         refractory = true;
         cell.push(Buffer.from([transmitter]));
         neutralize();
      });
   };


   const cell = through2(function (buf, encoding, callback) {
      const input = buf.readUInt8(0);
      console.log('input', input, cell.index);
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

   if (state >= threshold) {
      impulse(cell);
   }
   else if (state) {
      neutralize(cell);
   }
   cell.name = 'Action';
   return cell;
};

module.exports = ActionPotential;
