'use strict';

const through2 = require('through2');

// this.id = id;
// this.dendrites = dendrites; // connections to this cell
// this.synapse = synapse; // connection to another cell
// this.threshold = threshold; // % of dendrites that need to be activated to turn on cell


// should have idea of who is around?
// the "critical period" is when dendrites die.  This should speed up
// processing times, but kills chance of learning it's function.

// CELL TYPES
// granule cell
// pyramidal cell - rooted in L1, and nearby L3/L5, out L6, L7 (other areas)
// stellate cell
// horizontal cell - rooted in L1 (complex cells?) accept from Martinotti
// martinotti cell - rooted and nearby in L4, L6, out L1,2,3
// simple, complex, hypercomplex, receptive fields!!!
// https://en.wikipedia.org/wiki/Receptive_field
// Should I be monitoring the SDRs... the mind?
// different


// circuits shouldn't be viewed as "what are they doing in general"... Circuits should
// be viewed as structures that solve a task.  Like, is this a line?  Is this a curve?  Is
// it moving left, etc...

// CIRCUITS
// E -> E -> E | Excites
// E -> E -> I | Inhibits
// E -> I -> E | Fewer Excitors
// E -> I -> I | Fewer Inhibitors
// I -> E -> E | Fewer Excitors
// I -> E -> I | Fewer Inhibitors
// I -> I -> E | Fewer Excitors
// I -> I -> I | Very Few Inhibitors

// Larger Circuits (impossible to have a detailed view here, because it gets super complicated)
// 10 E -> 10 E -> 10 E | relay
//  1 E -> 10 E -> 20 E | slightly slower, but larger
// 10 E -> 10 I -> 10 E | Stops activity
// 10 E -> 5 E, 5 I -> 10 E | Depends on location, and how they are connected to each other
//      - allow some, not others


const REFRACTOR_MULTIPLIER = 2;

/**
 * Create a cell
 * @param {Number} state - initial state of the cell.
 * @param {Number} threshold - threshold needed for the cell to hit to create an impulse
 * @param {Number} trasmitter - the value transmitted when the impulse is triggered
 */
module.exports = ({state, threshold, transmitter}) => {
  state = state || 0;
  threshold = threshold || 10;
  transmitter = transmitter || 1;
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
        state = parseInt(state / REFRACTOR_MULTIPLIER);
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
      cell.push(transmitter);
      neutralize();
    });
  };


  return through2({
    objectMode: true
  },
  function (input, encoding, callback) {
    //console.log('state', state, 'refractory', refractory, 'multiplier', REFRACTOR_MULTIPLIER);
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
