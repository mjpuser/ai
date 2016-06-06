'use strict';

const ActionPotentialCell = require('../cell/ActionPotential');

const GanglionCell = (options) => {
   const cell = ActionPotentialCell(options);
   cell.name = 'ganglion';
   return cell;
};

module.exports = GanglionCell;
