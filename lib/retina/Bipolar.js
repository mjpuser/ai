'use strict';

const GradedPotentialCell = require('../cell/GradedPotential');

const BipolarCell = (options) => {
   const cell = GradedPotentialCell(options);
   cell.name = 'bipolar';
   return cell;
};

module.exports = BipolarCell;
