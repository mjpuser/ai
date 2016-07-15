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
// 23 x 23 = 529
const DIMENSION = 23;
const TOTAL = Math.pow(DIMENSION, 2); // total Ganglions
const colors = [
   'r', 'g', 'b'
];
const inputTransform = (colorIndex) => {
   return (input) => input[colorIndex];
};

// 2D array of cones
// retina[0] = [R0, B0, G0]
// retina[1] = [R1, B1, G1]
// etc... matches up with the rawvideo data
const retina = {
   r: [],
   g: [],
   b: []
};

const centerSurround = (color, index) => {
   const colorIndex = colors.indexOf(color);
   const ganglion = GanglionCell(null, color);
   const bipolars = times(3, () => BipolarCell());
   const horizontal = HorizontalCell();
   const cones = times(9, () => {
      return ConeCell({
         inputTransform: inputTransform(colorIndex)
      });
   });

   // bind cones to horizontals
   cones.forEach((cone, i) => {
      if (i===4) {
         horizontal.center(cone);
      } else {
         horizontal.surround(cone);
      }
   });

   // push into a 3x matrix -> 1D arr
   const CONE_DIMENSION = 3; // 3 x 3 per ganglion
   const xOffset = index % DIMENSION;
   const yOffset = Math.floor(index / DIMENSION);
   const eye = retina[color];
   cones.forEach((cone, i) => {
      const coneXOffset = (CONE_DIMENSION * xOffset) + (i % CONE_DIMENSION);
      const coneYOffset = (CONE_DIMENSION * yOffset) + Math.floor(i / CONE_DIMENSION);
      const coneIndex = coneXOffset + (coneYOffset * DIMENSION * CONE_DIMENSION);
      eye[coneIndex] = cone;
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

const threeEyedMonster = {
   r: times(TOTAL, centerSurround.bind(null, 'r')),
   g: times(TOTAL, centerSurround.bind(null, 'g')),
   b: times(TOTAL, centerSurround.bind(null, 'b'))
};
