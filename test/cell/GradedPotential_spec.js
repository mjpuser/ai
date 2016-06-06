'use strict';

const GradedPotential = require('../../lib/cell/GradedPotential');
const assert = require('assert');

describe('GradedPotential', () => {
   let cell;
   beforeEach(() => {
      cell = GradedPotential();
   });
   describe('cell grading', () => {
      it('should output as input comes in', (done) => {
         let impulsed = false;
         cell.write(1);
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There should be an impulse');
            done();
         });
      });
      it('should output the current state', (done) => {
         const input = 9;
         let isInputEqualOutput = false;
         cell.write(input);
         cell.on('data', (state) => {
            isInputEqualOutput = input === state;
         });
         process.nextTick(() => {
            assert.equal(isInputEqualOutput, true, 'The output should be the state');
            done();
         });
      });
   });
   describe('cell state', () => {
      it('should impulse if the state is greater than 0', (done) => {
         cell = GradedPotential({state: 1});
         let impulsed = false;
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There should have been an impulse');
            done();
         });
      });
      it('should impulse if state is less than 0', (done) => {
         cell = GradedPotential({state: -1});
         let impulsed = false;
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There should have been an impulse');
            done();
         });
      });
      it('should not impulse if state is 0', (done) => {
         cell = GradedPotential({state: 0});
         let impulsed = false;
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, false, 'There should not have been an impulse');
            done();
         });
      });
   });
   describe('cell transform', () => {
      it('should transmit the configured trasmitter', (done) => {
         const input = 10;
         let output;
         const transform = (s) => -s;
         cell = GradedPotential({ transform });
         cell.write(input);
         cell.on('data', (t) => {
            output = t;
         });
         process.nextTick(() => {
            assert.equal(output, transform(input), 'The transform should have been made');
            done();
         });
      });
   });
});
