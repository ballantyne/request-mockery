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
