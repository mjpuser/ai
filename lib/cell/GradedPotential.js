'use strict';

const through2 = require('through2');
/**
 * Create a GradedPotential cell.
 * @param {Number} max - max output default to 50
 * @param {Number} min - min output default to -50
 * @param {Number} state - initial state of the cell default to 0
 * @param {Function} transform - function that accepts the state as an argument
 *                             and 'transforms' it to the output of the cell
 * @param {Function} inputTransform - preprocess input
 */
const GradedPotential = function (options) {
   let cell;
   let {max, min, state, transform, inputTransform} = options || {};
   state = state || 0;
   max = max || 50;
   min = min || -50;
   transform = transform || ((s) => s);
   inputTransform = inputTransform || ((i) => i);
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
            cell.push(Buffer.from([Math.floor(transform(state))]));
            neutralize();
         });
      }
   };


   cell = through2(function (buf, encoding, callback) {
      const input = buf.readUInt8(0);
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
