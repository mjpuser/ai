'use strict';

const GanglionCell = require('./lib/retina/Ganglion');
const BipolarCell = require('./lib/retina/Bipolar');
const HorizontalCell = require('./lib/retina/Horizontal');
const ConeCell = require('./lib/retina/Cone');

// create cones
// c c c
// c c c
// c c c
// horizontal cells span the 9x9 cone
// c      c    c
//   \  /  /
// c - H -c -- c
//   /  \    \
// c      c    c
// bipolars
// 1 bipolar per 3 cones
// 3 * 70 * 70
// ganglion
// 3 bipolars per 1 ganglion


// rods will not be used.
// cones input from light to bipolar and horizontal
// 70 x 70 x 9 = 44.1k

// horizontals input from cones to cones
// 70 * 70 = 4.9k

// bipolar input from cones + horizontal to ganglion
// output to two areas.
// 70 x 70 x 3 = 14.7k

// ganglion input from bipolar to LGN
// 70 x 70 = 4.9k

const centerSurround = () => {
   const ganglion = GanglionCell();
   const bipolars = times(3, () => BipolarCell());
   const horizontal = HorizontalCell();
   const cones = times(9, () => ConeCell());

   // bind cones to horizontals
   cones.forEach((cone, i) => {
      if (i===4) {
         horizontal.center(cone);
      } else {
         horizontal.surround(cone);
      }
   });

   // bind cones to bipolars
   cones.forEach((cone, i) => {
      cone.feed(bipolars[i % 3]);
   });

   // bind bipolars to ganglion
   bipolars.forEach((bipolar) => {
      bipolar.feed(ganglion);
   });

   return {
      ganglion,
      bipolars,
      horizontal,
      cones
   };
};

const times = (num, fn) => {
   const arr = [];
   for (let i=0; i<num; i++) {
      arr.push(fn(i));
   }
   return arr;
};

const centerSurrounds = times(70 * 70, centerSurround);
