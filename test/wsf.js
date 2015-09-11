'use strict';

var assert = require('assert');
var nock = require('nock');
var Wsf = require('../lib/wsf');
var VERSION = require('../package.json').version;

describe('Wsf', function() {

  describe('Constructor', function() {

    describe('new Wsf();', function() {

      var defaults = {};

      before(function(){
        defaults = {
          api_access_code: null,
          rest: {
            base: 'http://www.wsdot.wa.gov/ferries/api',
            services: {
              fares: '/fares/rest',
              schedule: '/schedule/rest',
              terminals: '/terminals/rest',
              vessels: '/vessels/rest'
            },
          },
          request_options: {
            headers: {
              'Accept': '*/*',
              'Connection': 'close',
              'User-Agent': 'wsf/' + VERSION,
            }
          }
        };
      });

      it('create new instance', function(){
        var client = new Wsf();
        assert(client instanceof Wsf);
      });

      it('has default options', function(){
        var client = new Wsf();
        assert.equal(
          Object.keys(defaults).length,
          Object.keys(client.options).length
        );
        assert.deepEqual(
          Object.keys(defaults),
          Object.keys(client.options)
        );
      });

      it('accepts and overrides options', function(){
        var options = {
          api_access_code: 'XXXXX',
          power: 'Max',
          request_options: {
            headers: {
              'Accept': 'application/json'
            }
          }
        };

        var client = new Wsf(options);

        assert(client.options.hasOwnProperty('power'));
        assert.equal(client.options.power, options.power);

        assert.equal(client.options.api_access_code, options.api_access_code);

        assert.equal(
          client.options.request_options.headers.Accept,
          options.request_options.headers.Accept);
      });

      it('has pre-configured request object', function(next){
        var client = new Wsf({
          request_options: {
            headers: {
              foo: 'bar'
            }
          }
        });

        assert(client.hasOwnProperty('request'));

        nock('http://node.wsf').get('/').reply(200);
        client.request.get('http://node.wsf/', function(error, response){

          var headers = response.request.headers;

          assert(headers.hasOwnProperty('foo'));
          assert(headers.foo, 'bar');

          assert.equal(headers['User-Agent'], 'wsf/' + VERSION);

          next();
        });


      });
    });
  });

  describe('Prototypes', function() {
    describe('prototype.__buildEndpoint();', function() {
      var client;
      var code = 'XXXXXX';
      var apiaccesscode = '?apiaccesscode=' + code;
      before(function(){
        client = new Wsf({api_access_code: apiaccesscode});
      });

      it('method exists', function(){
        assert.equal(typeof client.__buildEndpoint, 'function');
      });

      it('build url', function(){
        var path = 'vessellocations';
        var endpoint = 'http://www.wsdot.wa.gov/ferries/api/vessels/rest/vessellocations';

        assert.throws(
          client.__buildEndpoint,
          Error
        );
        assert.equal(
          client.__buildEndpoint(path + apiaccesscode, 'vessels'),
          client.options.rest.base + client.options.rest.services.vessels + '/' + path + apiaccesscode
        );

        assert.equal(
          client.__buildEndpoint(path + apiaccesscode, 'vessels'),
          client.options.rest.base + client.options.rest.services.vessels + '/' + path + apiaccesscode
        );

        assert.equal(
          client.__buildEndpoint('/' + path + apiaccesscode, 'vessels'),
          client.options.rest.base + client.options.rest.services.vessels + '/' + path + apiaccesscode
        );

        assert.equal(
          client.__buildEndpoint(path + '/', 'vessels'),
          client.options.rest.base + client.options.rest.services.vessels + '/' + path + apiaccesscode
        );



        assert.equal(
          client.__buildEndpoint(endpoint),
          endpoint + apiaccesscode
        );
      });
    });

    describe('prototype.__request();', function() {
    });

    describe('prototype.__get();', function() {
    });

    describe('prototype.__post();', function() {
    });

  });

});
