'use strict';

const ActionPotential = require('../../lib/cell/ActionPotential');
const assert = require('assert');

describe('ActionPotential', () => {
   let cell;
   beforeEach(() => {
      cell = ActionPotential();
   });
   describe('cell impulse threshold', () => {
      it('should create an impulse at 10', (done) => {
         let impulsed = false;
         cell.write(10);
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There was no impulse after the threshold');
            done();
         });
      });
      it('should not create an impulse at 9', (done) => {
         let impulsed = false;
         cell.write(9);
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, false, 'There should not have been an impulse');
            done();
         });
      });
      it('should impulse when configured threshold is reached', (done) => {
         const threshold = 40;
         cell = ActionPotential({ threshold });
         let impulsed = false;
         cell.write(threshold);
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There should have been an impulse');
            done();
         });
      });
   });
   describe('cell state', () => {
      it('should impulse if the state is greater than the threshold', (done) => {
         cell = ActionPotential({state: 10});
         let impulsed = false;
         cell.on('data', () => {
            impulsed = true;
         });
         process.nextTick(() => {
            assert.equal(impulsed, true, 'There should have been an impulse');
            done();
         });
      });
      it('should not impulse if it is not greater than the threshold', (done) => {
         cell = ActionPotential({state: 4});
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
   describe('cell transmitter', () => {
      it('should transmit the configured trasmitter', (done) => {
         const transmitter = 63;
         let isConfiguredTransmitter = false;
         cell = ActionPotential({ transmitter, state: 10 });
         cell.on('data', (t) => {
            isConfiguredTransmitter = t === transmitter;
         });
         process.nextTick(() => {
            assert.equal(isConfiguredTransmitter, true, 'The transmitter does not match');
            done();
         });
      });
   });
});
