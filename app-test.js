var app = require('./app.js');
var request = require('supertest');

describe('API testing', function() {
   describe('Get country list for a region', function() {
      it('Correct Region', function(done) {
          this.timeout(2000);
          function matchResponse(res) {
              if(!res.body || res.body.length < 0) {
                  throw new Error('Country list for a region is incorrect');
              }
          }
          var endpoint = '/list?q=asia';
          testRequest(app, endpoint, 'get', null, 200, matchResponse, done);          
      }); 
      it('Missing required field', function(done) {
          function matchResponse(res) {
              if(!res.error) {
                  throw new Error('Validation passed for incorrect input');
              }
          }
          var endpoint = '/list';
          testRequest(app, endpoint, 'get', null, 400, matchResponse, done);          
      });
      it('Incorrect Region', function(done) {
          function matchResponse(res) {
              if(!res.error) {
                  throw new Error('Validation passed for incorrect input');
              }
          }
          var endpoint = '/list?q=incorrect';
          testRequest(app, endpoint, 'get', null, 400, matchResponse, done);          
      });
      it('API not found', function(done) {
          function matchResponse(res) {
              if(!res.error) {
                  throw new Error('Incorrect API request passed');
              }
          }
          var endpoint = '/lists';
          testRequest(app, endpoint, 'get', null, 404, matchResponse, done);          
      });
   }); 
    
   describe('Get country list for a region in population sorted order', function() {
      it('Correct Region', function(done) {
          this.timeout(4000);
          function matchResponse(res) {
              if(!res.body || res.body.length < 0) {
                  throw new Error('Country list for a region is incorrect');
              }
          }
          var endpoint = '/list/asia/sort';
          testRequest(app, endpoint, 'get', null, 200, matchResponse, done);          
      }); 
      it('Incorrect Region', function(done) {
          function matchResponse(res) {
              if(!res.error) {
                  throw new Error('Validation passed for incorrect input');
              }
          }
          var endpoint = '/list/incorrect/sort';
          testRequest(app, endpoint, 'get', null, 400, matchResponse, done);          
      });
      it('API not found', function(done) {
          function matchResponse(res) {
              if(!res.error) {
                  throw new Error('Incorrect API request passed');
              }
          }
          var endpoint = '/list/asia/sorting';
          testRequest(app, endpoint, 'get', null, 404, matchResponse, done);          
      });
   }); 
});

function testRequest(app, endpoint, method, body, responseCode, matchResponse, done) {
  if(matchResponse == null) { matchResponse = function() {}; }
  request(app)[method](endpoint)
  .send(body)
  .expect(responseCode)
  .expect(matchResponse)
  .end(function(err) {
    if(err) { return done(err); }
    done();
  });
};