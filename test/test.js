// const Cell = require('../lib/cell').ActionPotential;
// const cellStream = Cell({});
// const through2 = require('through2');
// cellStream.write([-1,-2,-3, -10]);
//
// function kick(times) {
//   if (times > 0) {
//     process.nextTick(function () {
//       cellStream.write([10]);
//       kick(times - 1);
//     });
//   }
// };
// kick(20);
// cellStream.pipe(through2.obj(function (chunk, enc, next) {
//   console.log('chunk', chunk);
//   next();
// }));


const Horizontal = require('../lib/retina/Horizontal');
const GradedPotentialCell = require('../lib/cell/GradedPotential');

const surroundCone1 = GradedPotentialCell();
const surroundCone2 = GradedPotentialCell();
const surroundCone3 = GradedPotentialCell();
const surroundCone4 = GradedPotentialCell();
const surroundCone5 = GradedPotentialCell();
const centerCone = GradedPotentialCell();
const horizontal = Horizontal();

horizontal.center(centerCone);
horizontal.surround(surroundCone1);
horizontal.surround(surroundCone2);
horizontal.surround(surroundCone3);
horizontal.surround(surroundCone4);
horizontal.surround(surroundCone5);
centerCone.name = 'center';
surroundCone1.name = 'surround1';
surroundCone2.name = 'surround2';
surroundCone3.name = 'surround3';
surroundCone4.name = 'surround4';
surroundCone5.name = 'surround5';
centerCone.write(5);
