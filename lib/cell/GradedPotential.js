'use strict';

const through2 = require('through2');

const NEUTRALIZE_MULTIPLIER = 1.5;
/**
 * Create a GradedPotential cell.
 * @param {Number} max - max output.
 * @param {Number} min - min output
 * @param {Number} state - initial state of the cell
 * @param {Function} transform - function that accepts the state as an argument
 *                             and 'transforms' it to the output of the cell
 */
const GradedPotential = function (options) {
   let {max, min, state, transform} = options || {};
   state = state || 0;
   max = max || 100;
   min = min || -100;
   transform = transform || ((s) => s);

   const neutralize = (cell) => {
      if (state) {
         process.nextTick(() => {
            state = parseInt(state / NEUTRALIZE_MULTIPLIER);
         });
         impulse(cell);
      }
   };
   const sum = (input) => {
      state += input;
   };
   const impulse = (cell) => {
      process.nextTick(() => {
         cell.push(
            Math.max(
               min,
               Math.min(
                  max,
                  transform(state)
               )
            )
         );
         neutralize(cell);
      });
   };


   const cell = through2({
      objectMode: true
   },
   function (input, encoding, callback) {
      //console.log('state', state, 'multiplier', NEUTRALIZE_MULTIPLIER);
      sum(input);
      impulse(this);
      callback();
   });

   if (state) {
      impulse(cell);
   }

   return cell;
};

module.exports = GradedPotential;
