'use strict';

const through2 = require('through2');

// this.id = id;
// this.dendrites = dendrites; // connections to this cell
// this.synapse = synapse; // connection to another cell
// this.threshold = threshold; // % of dendrites that need to be activated to turn on cell


// should have idea of who is around?
// the "critical period" is when dendrites die.  This should speed up
// processing times, but kills chance of learning it's function.



module.exports = ({state, threshold }) => {
  state = state || 0;
  threshold = threshold || 10;
  let refractory = false;
  // impulses are constantly being restored to 0 over time.  X number of
  // impulses have to come in around the same time.

  // during action potential, there is a bit of time where the neuron
  // doesn't accept new inputs.

  // one way we can represent this is with a queue that has a count.  the
  // neuron is always recieving input, and those values are either -1, 0, or 1.
  // When the value of the queue reaches 10, then it is gonna trigger it's
  // action potential.  The queue should have a fixed size of say 40.  The
  // downside of this design is that it always has to be doing something
  // instead of being "silent" and waiting for events.  How could we
  // describe this phenomenon without that?  I don't know if there is one.
  // we can always do a nextTick to neutralize the action potential.  The
  // idea is that there won't be nearly as many since the inputs are sparse.

  const neutralize = () => {
    if (state) {
      process.nextTick(() => {
        state = parseInt(state / 2);
        if (state) {
          neutralize();
        }
        else {
          refractory = false;
        }
      });
    }
  };
  const sum = (input) => {
    state = input.reduce((sum, val) => {
      return sum + val;
    }, state);
  };
  const impulse = (cell) => {
    process.nextTick(() => {
      state = threshold * 3;
      refractory = true;
      cell.push(1);
      neutralize();
    });
  };


  return through2({
    objectMode: true
  },
  function (input, encoding, callback) {
    if (refractory) {
      return callback();
    }
    sum(input);
    if (state >= threshold) {
      impulse(this);
    }
    else {
      neutralize();
    }
    callback();
  });
};
