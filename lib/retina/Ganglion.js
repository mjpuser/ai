'use strict';

const ActionPotentialCell = require('../cell/ActionPotential');

const GanglionCell = (options, color) => {
   const cell = ActionPotentialCell(options);
   cell.name = 'ganglion';
   cell.color = color;
   return cell;
};

module.exports = GanglionCell;
