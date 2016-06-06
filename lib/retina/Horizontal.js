'use strict';

const GradedPotentialCell = require('../cell/GradedPotential');

const HorizontalCell = () => {
   const surroundToCenter = GradedPotentialCell({
      transform: (s) => -s/2
   });
   const centerToSurround = GradedPotentialCell({
      transform: (s) => -s/2 // divide by 2 because there are about 2x more cones
   });
   centerToSurround.name = 'c->s';
   surroundToCenter.name = 's->c';
   const cell = {};
   cell.surround = function (cone) {
      cone.feed(surroundToCenter);
      centerToSurround.feed(cone);
   };

   cell.center = function (cone) {
      cone.feed(centerToSurround);
      surroundToCenter.feed(cone);
   };
   cell.on = (data, fn) => {
      surroundToCenter.on('data', fn);
      centerToSurround.on('data', fn);
   };
   return cell;
};

module.exports = HorizontalCell;
