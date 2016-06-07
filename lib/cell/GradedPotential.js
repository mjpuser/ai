'use strict';

const through2 = require('through2');
/**
 * Create a GradedPotential cell.
 * @param {Number} max - max output.
 * @param {Number} min - min output
 * @param {Number} state - initial state of the cell
 * @param {Function} transform - function that accepts the state as an argument
 *                             and 'transforms' it to the output of the cell
 */
const GradedPotential = function (options) {
   let cell;
   let {max, min, state, transform} = options || {};
   state = state || 0;
   max = max || 50;
   min = min || -50;
   transform = transform || ((s) => s);
   let impulsed = false;

   const neutralize = () => {
      state = 0;
   };
   const sum = (input) => {
      state += Math.floor(input/(cell.total || 1));
   };
   const clip = () => {
      return Math.max(
         min,
         Math.min(
            max,
            state
         )
      );
   };
   const impulse = () => {
      if (state && !impulsed) {
         impulsed = true;
         process.nextTick(() => {
            //console.log(cell.name, 'impulse', transform(state), 'state', state);
            state = clip();
            impulsed = false;
            cell.push(Math.floor(transform(state)));
            neutralize();
         });
      }
   };


   cell = through2({
      objectMode: true
   },
   function (input, encoding, callback) {
      sum(input);
      impulse();
      callback();
   });

   if (state) {
      impulse(cell);
   }
   cell.name = 'Graded';
   cell.total = 0;
   cell.feed = (otherCell) => {
      cell.total++;
      cell.pipe(otherCell);
   };
   return cell;
};

module.exports = GradedPotential;
