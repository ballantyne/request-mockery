
request-mockery
------------

This is a very simple library to help write tests using [mockery](https://github.com/mfncooper/mockery) when testing code that uses the [request](https://github.com/request/request) http module.  It lets you pass through the options or it also allows you to set a return value.  Current way of setting the return value is a little brittle, and if other folks have any ideas about being able to set the value or return function in a more intuitive way, your input would be very appreciated.  Mockery registers stubs at the beginning of a describe block, so I would like to make it be able to supply several different responses each time it is registered. I take a md5 of the request options and that is how I attach a response.  I think that the md5 will possibly change often, so that is going to get annoying.  Is there another way to design that?

For now, you can either register a response or you can not register a response and the library will just return the options.

I'm currently making a lot of api related libraries, and all of the use request somewhere in the code, but I don't want to actually make requests to the server, so it is nice to be able to see what sort of requests the module would make and also be able to supply a response to see what the module does with it.


```bash
npm install request-mockery --save-dev

```

Usage
------------

```javascript
var request = require('request-mockery');
request.verbosity(true);

request({
    url: 'http://google.com', 
    method: "GET"
  }, function(err, response, body) { 
    console.log(err, response, body)
    // null { code: 200 } { url: 'http://google.com', method: 'POST', json: { test: 'test' } }
})

request.responses({
  "d45e1f70c855b724fadb07f8695ae3f6": {
    arbitrary: 'value'
  }
})

request({
    url: 'http://google.com', 
    method: "GET"
  }, function(err, response, body) { 
    console.log(err, response, body)
    // null { code: 200 } { arbitrary: 'value' }
})

// if you set a body, status and error key, then it will return those in the proper arity.
request.responses({
  'd45e1f70c855b724fadb07f8695ae3f6': {
    body: {arbitrary: 'value'}, 
    status: {code: 500}, 
    error: {another: 'value'}
  }
})

request({
    url: 'https://google.com', 
    method: "GET"
  }, function(err, response, body) { 
    console.log(err, response, body)
    // { another: 'value' } { code: 500 } { arbitrary: 'value' }
})

```
In a test
------------

```javascript
var path    = require('path');
var mockery = require('mockery');
var should  = require('chai').should();
var assert  = require('assert');
var request = require(path.join(__dirname, '..', 'index'));

describe('RequestMockery', function() {
  var FakeModule;

  before(function(){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    // request.verbosity(true);
    request.responses({
      "03684ab85d63ef1261c356d19b1f235e": {"arbitrary": true}
    })
    mockery.registerMock('request', request);
    FakeModule = require(path.join(__dirname, 'fake_module'));
 
  });

  after(function(){
    mockery.disable();
  }); 


  describe('FakeModule', function() {
    describe('test', function() {
      it('invalid should work', function(done) {
        var api = new FakeModule();
        api.exec({}, function(err, resp, body) {
          assert.equal(err, null);
          assert.equal(resp.code, 200);
          assert.equal(body, '{}');
          done();
        })
      });
      it('return response', function(done) {
        var api = new FakeModule();
        api.exec({
          url: 'https://google.com', 
          method: 'GET'
        }, function(err, resp, body) {
          assert.equal(err, null);
          assert.equal(resp.code, 200);
          assert.equal(JSON.parse(body).url, 'https://google.com');
          done();
        })
      });

      it('can set response', function(done) {
        var api = new FakeModule();
        api.exec({
          url: 'https://yahoo.com', 
          method: 'GET'
        }, function(err, resp, body) {
          assert.equal(err, null);
          assert.equal(resp.code, 200);
          assert.equal(JSON.parse(body).arbitrary, true);
          done();
        })
      });
    });
  });
});

```

Donations
------------

Here are a few addresses where you can send me bitcoins.  If this library helps you and you are feeling especially generous because you were able to mine tons of that brand new altcoin super early in it's life I know that you will feel compelled to buy me a baguette with magical internet money.  


* BTC: 1A1BrPyWpdXLPsidjaMAmyNG71vFwmKPSR
* BCH: qqhk5ce25fs706sk9vlnhtezpk3ezp9euc82cyky8v
* ETH: 0xC33DBB4D997e6A3d9457F41ff07fb13f8DA7bF64
* LTC: LS2P54xNErZ36pXp95zqTyST7XTx5XHEZy

Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your fix/feature has a high chance of being included, please read the following guidelines:

1. Post a [pull request](https://github.com/ballantyne/request-mockery/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for paperclip, please open a
   [GitHub issue](https://github.com/ballantyne/request-mockery/issues/new).


And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/request-mockery/graphs/contributors)!

License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright
-------
© 2018 Scott Ballantyne. See LICENSE for details.

