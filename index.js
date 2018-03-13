const klass  = require('klass');
const md5    = require('md5');
const _      = require('underscore');
var isJSON   = require('is-json');
var verbose  = false;
var responses = {};

var request = function(options, then) {
  var error = null;
  var body;
  var status = {code: 200};

  var json  = JSON.stringify(options);
  var hash  = md5(json);

  if (responses[hash] != undefined) {
    if (responses[hash].body != undefined) {
      body    = responses[hash].body;
      if (responses[hash].error != undefined) {
        error   = responses[hash].error;
      }
      if (responses[hash].status != undefined) {
        status   = responses[hash].status;
      }
    } else {
      body = responses[hash]
    }
  } else {
    body    = options;
    if (verbose) {
      console.log(hash, options)
    }
  }

  if (body != undefined && options != undefined && _.keys(options).indexOf('json') == -1 && typeof body == 'object') {
    body = JSON.stringify(body);
  }

  if (then) {
    then(error, status, body);
  }
}

var mock = function(options, then) {
  request(options, then);
}


mock.get    = function(options, then) {
  options.method = 'GET';
  request(options, then);
};

mock.post   = function(options, then) {
  options.method = 'POST';
  request(options, then);   
}

mock.put    = function(options, then) {
  options.method = 'PUT';
  request(options, then);   
};

mock.delete = function(options, then) {
  options.method = 'DELETE';
  request(options, then);
};

mock.verbosity = function(toggle) {
  verbose = toggle;
}

mock.set = function(hash, obj) {
  responses = obj;
}

mock.responses = function(r) {
  responses = r;
}

module.exports = mock;
