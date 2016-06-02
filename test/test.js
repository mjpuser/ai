const Cell = require('../lib/cell').ActionPotential;
const cellStream = Cell({});
const through2 = require('through2');
cellStream.write([-1,-2,-3, -10]);

function kick(times) {
  if (times > 0) {
    process.nextTick(function () {
      cellStream.write([10]);
      kick(times - 1);
    });
  }
};
kick(20);
cellStream.pipe(through2.obj(function (chunk, enc, next) {
  console.log('chunk', chunk);
  next();
}));
