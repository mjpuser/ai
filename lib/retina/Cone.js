'use strict';

const GradedPotentialCell = require('../cell/GradedPotential');

const ConeCell = (options) => {
   const cell = GradedPotentialCell(options);
   cell.name = 'cone';
   return cell;
};

module.exports = ConeCell;
