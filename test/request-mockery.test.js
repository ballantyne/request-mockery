var path    = require('path');
var mockery = require('mockery');
var should  = require('chai').should();
var assert  = require('assert');
var request = require(path.join(__dirname, '..', 'index'));

describe('RequestMockery', function() {
  var requestStub, FakeModule;

  before(function(){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    // request.verbosity(true);
    request.responses({
      "03684ab85d63ef1261c356d19b1f235e": {"arbitrary": true},
      "23e6bd1b0f032ae495c12dfb53d2c38b": {
        error: 'arbitrary', 
        response: {statusCode: 500 },
        body: {
          "status": "success",
          "country": "United States",
          "countryCode": "US",
          "region": "CA",
          "regionName": "California",
          "city": "San Francisco",
          "zip": "94105",
          "lat": "37.7898",
          "lon": "-122.3942",
          "timezone": "America\/Los_Angeles",
          "isp": "Wikimedia Foundation",
          "org": "Wikimedia Foundation",
          "as": "AS14907 Wikimedia US network",
          "query": "208.80.152.201"
        }
      }
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
          assert.equal(resp.statusCode, 200);
          assert.equal(typeof body, 'object');
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
          assert.equal(resp.statusCode, 200);
          assert.equal(body.url, 'https://google.com');
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
          assert.equal(resp.statusCode, 200);
          assert.equal(body.arbitrary, true);
          done();
        })
      });

      it('can set response', function(done) {
        var api = new FakeModule();
        api.exec({
          url: 'http://ip-api.com/json/208.80.152.201', 
          method: 'GET'
        }, function(err, resp, body) {
          assert.equal(err, 'arbitrary');
          assert.equal(resp.statusCode, 500);
          assert.equal(body.status, 'success');
          assert.equal(body.country, 'United States');
          assert.equal(body.isp, 'Wikimedia Foundation');
          done();
        })
      });
    });
  });
});
