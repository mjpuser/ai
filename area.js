'use strict';

const through2 = require('through2');

module.exports = function () {
  return through2({
    objectMode: true
  },
  function (chunk, encoding, callback) {
    callback(null, chunk);
  });
};
