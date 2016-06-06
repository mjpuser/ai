'use strict';

const cell = require('./lib/cell');

// rods will not be used.
// cones input from light to bipolar and horizontal
const cones = {
   potential: 'graded',
   columns: 200,
   rows: 200,
   input: () => {
      return {
         layers: ['video stream?']
      }
   },
   output: () => {
      return {
         layers: [
            { layer: horizontals, ratio: 100 },
            { layer: bipolars, ratio: 100 }
         ]
      }
   }
};

// horizontals input from rods + cones to bipolar
const horizontals = {
   potential: 'graded',
   columns: 50,
   rows: 50
};

// bipolar input from cones + horizontal to ganglion
// output to two areas.
// if depolarize for dark, they output to layer 1,
// if depolarize for light, they output to layer 2
//
const bipolars = {
   potential: 'graded',
   columns: 50,
   rows: 50
};

// ganglion input from bipolar to LGN
const ganglions = {
   potential: 'action',
   columns: 35,
   rows: 35
};

const creator = (config) => {
   const cells = [];
   const total = config.columns * config.rows;
   const Cell = config.type === 'graded' ? cell.GradedPotential : cell.ActionPotential;
   for (let i = 0; i<total; i++) {
      cells.push(new Cell({}));
   }
   return cells;
};

const a = creator(cones);
const b = creator(horizontals);
const c = creator(bipolars);
const d = creator(ganglions);

console.log('created', a.length + b.length + c.length + d.length, 'cells');
