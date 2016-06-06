'use strict';

const HorizontalCell = require('../../lib/retina/Horizontal');
const GradedPotentialCell = require('../../lib/cell/GradedPotential');

describe('Horizontal Cell', () => {
   let cell;
   beforeEach(() => {
      cell = HorizontalCell();
   });

   describe('surround', () => {
      it('should essentially feed the horizontal cell', (done) => {
         const surround = GradedPotentialCell();
         cell.surround(surround);
         surround.write(10);
         cell.on('data', (input) => {
            done();
         });
      });
   });
   describe('center', () => {
      it('should essentially feed the horizontal cell', (done) => {
         const center = GradedPotentialCell();
         cell.center(center);
         center.write(10);
         cell.on('data', (input) => {
            done();
         });
      });
   });
});
