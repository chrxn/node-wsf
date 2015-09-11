'use strict';

/**
 * Module dependencies
 */

var url = require('url');
var request = require('request');
var extend = require('deep-extend');

// Package version
var VERSION = require('../package.json').version;

function Wsf (options) {
  if (!(this instanceof Wsf)) return new Wsf(options);
  this.VERSION = VERSION;

  // Merge the default options with the client submitted options
  this.options = extend({
    api_access_code: null,
    fix_dates: true,
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
        'User-Agent': 'node-wsf/' + VERSION,
      }
    }
  }, options);

  this.request = request.defaults(
      extend(
        //Pass the client submitted request options
        this.options.request_options
      )
    );
  this.__fares.bind(this)();
  this.__schedule.bind(this)();
  this.__terminals.bind(this)();
  this.__vessels.bind(this)();
  this.__get.bind(this)();
}
Wsf.prototype.__buildEndpoint = function(path, base, params) {

  var bases = {
    'rest': this.options.rest.base,
    'fares': this.options.rest.base + this.options.rest.services.fares,
    'schedule': this.options.rest.base + this.options.rest.services.schedule,
    'terminals': this.options.rest.base + this.options.rest.services.terminals,
    'vessels': this.options.rest.base + this.options.rest.services.vessels
  };

  var endpoint = (bases.hasOwnProperty(base)) ? bases[base] : bases.rest;

  if (url.parse(path).protocol !== null) {
    endpoint = path;
  } else {
    endpoint += (path.charAt(0) === '/') ? path : '/' + path;
  }
  if (typeof params !== 'undefined') {
    if (typeof params === 'object' && typeof params.join === 'function') {
      endpoint += "/" + params.join('/');
    } if (typeof params === 'number' || typeof params == 'string') {
      endpoint += "/" + params;
    }
  }
  // Remove trailing slash
  endpoint = endpoint.replace(/\/$/, "");

  // Add api_access_code if not provided in call
  endpoint += (typeof endpoint.split('?')[1] === 'undefined') ?
             '?apiaccesscode=' + this.options.api_access_code : '';
  return endpoint;
};

Wsf.prototype.__request = function(method, service, path, params, callback) {
  var base = service;
  function datefix(text) {
    var re = /"\\\/Date\((\d*-\d*)\)\\\/"/g,
        replacer = function (m) {
          return parseInt(m.match(/\d*-\d*/)[0]);
        };
    return text.replace(re, replacer);
  }

  // Set the callback if no params are passed
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  // Set API base

  // Build the options to pass to our custom request object
  var options = {
    method: method.toLowerCase(),  // Request method - get || post
    url: this.__buildEndpoint(path, base, params), // Generate url
    fix_dates: this.options.fix_dates
  };

  this.request(options, function(error, response, data){
    if (error) {
      callback(error, data, response);
    }
    else {
      try {
        if (options.fix_dates) {
          data = JSON.parse(datefix(data));
        } else {
          data = JSON.parse(data);
        }
      }
      catch(parseError) {
        callback(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );

      }
      if (typeof data.errors !== 'undefined') {
        callback(data.errors, data, response);
      }
      else if(response.statusCode !== 200) {
        callback(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );
      }
      else {
        callback(null, data, response);
      }
    }
  });
};

/**
 * GET
 */

Wsf.prototype.req = function(service, url, params, callback) {
  return this.__request('get', service, url, params, callback);
};

Wsf.prototype.__get = function() {
  return {
      fares: function(url, params, callback) {
        return this.__request('get', 'fares', url, params, callback);
      }.bind(this),
      schedule: function(url, params, callback) {
        return this.__request('get', 'schedule', url, params, callback);
      }.bind(this),
      terminals: function(url, params, callback) {
        return this.__request('get', 'terminals', url, params, callback);
      }.bind(this),
      vessels: function(url, params, callback) {
        return this.__request('get', 'vessels', url, params, callback);
      }.bind(this)
    };
};

var factory = function(service, paths) {
  var result = {};
  var generator = function(service, path) {
      return function(params, callback) {
        return this.req(service, path, params, callback);
      };
  };
  for (var index in paths) {
     result[paths[index]] = generator(service, paths[index]);
  }
  return result;
};

Wsf.prototype.__fares = function() {
  this.fares = {};
  var paths = [
  "cacheflushdate",
  "validdaterange",
  "terminals",
  "terminalmates",
  "terminalcombo",
  "terminalcomboverbose",
  "farelineitembasic",
  "farelineitems",
  "farelineitemsverbose",
  "faretotals"
  ];
  var methods = factory('fares', paths);
  for (var index in paths) {
     this.fares[paths[index]] = methods[paths[index]].bind(this);
   }
  };


Wsf.prototype.__schedule = function() {
  this.schedule = {};
  var paths = [
  "cacheflushdate",
  "validdaterange",
  "terminals",
  "terminalsandmates",
  "terminalsandmatesbyroute",
  "terminalmates",
  "routes",
  "routeshavingservicedisruptions",
  "routedetails",
  "activeseasons",
  "schedroutes",
  "sailings",
  "timeadj",
  "timeadjbyroute",
  "timeadjbyschedroute",
  "schedule",
  "scheduletoday",
  "alerts"];
  var methods = factory('schedule', paths);
  for (var index in paths) {
     this.schedule[paths[index]] = methods[paths[index]].bind(this);
   }
};



Wsf.prototype.__terminals = function() {
  this.terminals = {};
  var paths = [
  "cacheflushdate",
  "terminalbasics",
  "terminalbulletins",
  "terminallocations",
  "terminalsailingspace",
  "terminaltransports",
  "terminalverbose",
  "terminalwaittimes"
  ];
  var methods = factory('terminals', paths);
  for (var index in paths) {
     this.terminals[paths[index]] = methods[paths[index]].bind(this);
   }
};




Wsf.prototype.__vessels = function(){
  this.vessels = {};
  var paths = [
  "cacheflushdate",
  "vesselbasics",
  "vesselaccomodations",
  "vesselstats",
  "vessellocations",
  "vesselverbose"
  ];
  var methods = factory('vessels', paths);
  for (var index in paths) {
     this.vessels[paths[index]] = methods[paths[index]].bind(this);
   }
};


module.exports = Wsf;
