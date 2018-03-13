var request = require('request');
var klass = require('klass');
var _ = require('underscore');

module.exports = klass(function(options) {
  _.extend(this, options);
}).methods({
  exec: function(options, then) {
    request(options, then);    
  }
})

