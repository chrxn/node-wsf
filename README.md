# WSF for Node.js

An asynchronous client library for WSDOT Washington State Ferries (WSF) [Fares](http://www.wsdot.wa.gov/ferries/api/fares/documentation/), [Schedule](http://www.wsdot.wa.gov/ferries/api/schedule/documentation/),
[Terminals](http://www.wsdot.wa.gov/ferries/api/terminals/documentation/), and [Vessels](http://www.wsdot.wa.gov/ferries/api/schedule/documentation/) REST API's.





```javascript
var Wsf = require('wsf');

var client = new Wsf({
  api_access_code: '',
  fix_dates: false
});

// Access Fares API  -- get /terminalcombo/{TripDate}/{DepartingTerminalID}/{ArrivingTerminalID}
var TripDate = '2015-10-01';
var params = [TripDate, 3, 7];
client.fares.terminalcombo(params, function(error, combo, response){
  if (!error) {
    console.log(combo);
  }
});

// Access Vessels API (no params)  -- get /vessellocations
client.vessels.vessellocations(function(error, vessels, response){
  if (!error) {
    console.log(vessels);
  }
});

// Access Vessels API (one param)  -- get /vessellocations/{VesselID}
client.vessels.vessellocations(20, function(error, vessel, response){
  if (!error) {
    console.log(vessel);
  }
});
```

## Installation

`npm install wsf`

## Quick Start

You will need valid WSDOT developer credentials in the form of an API Access Code.  You can get these [here](http://www.wsdot.wa.gov/traffic/api/).  Submit your email address and retrieve your API Access Code.

The dates are sent from WSDOT in this format: ``'/Date(1441946334000-0700)/'`` . You can pass `fix_dates: true` in the options object to indiscriminately find and replace them with the Unix Epoch equivalent. The replace operation will take place after every request if enabled.


## Requests

You now have the ability to make GET requests against the API via the convenience methods.

Requests can be made in this way: `client[service][endpoint](params, callback)` where

* `service` is one of `['fares','schedule','terminals','vessels']`
* `endpoint` is a valid endpoint listed on the [Fares](http://www.wsdot.wa.gov/ferries/api/fares/documentation/), [Schedule](http://www.wsdot.wa.gov/ferries/api/schedule/documentation/),
[Terminals](http://www.wsdot.wa.gov/ferries/api/terminals/documentation/), or [Vessels](http://www.wsdot.wa.gov/ferries/api/schedule/documentation/) REST API Documentation pages
* params is optional and can be omitted, or  `(typeof params === 'number' || typeof params === 'string' || typeof params.join === 'function') => true`
* for those requests requiring params to be an array, please note that the order of the elements must match the order described in the documentation.
* the callback signature is `function(error, data, response)` - `data` is parsed JSON, and `response` is the raw response

You can see an example of how this is used below.


## REST API

You simply need to pass the endpoint and parameters to one of convenience methods.

Example, lets get a [list of vessel locations](http://www.wsdot.wa.gov/ferries/api/vessels/documentation/rest.html#tabvessellocations):

```javascript
// Access Vessels API (no params)  -- get /vessellocations
client.vessels.vessellocations(function(error, vessels, response){
  if(error) throw error;
  console.log(vessels);  // The vessels.
  console.log(response);  // Raw response object.
});
```

How about an example that passes parameters?  Let's  [grab some terminal combos](http://www.wsdot.wa.gov/ferries/api/fares/documentation/rest.html#tabterminalcombo):

```javascript
// Access Fares API  -- get /terminalcombo/{TripDate}/{DepartingTerminalID}/{ArrivingTerminalID}
var TripDate = '2015-10-01';
var params = [TripDate, 3, 7];
client.fares.terminalcombo(params, function(error, combo, response){
  if (!error) {
    console.log(combo);
  }
});
```



## Contributors
Authored by [@chrxn](http://github.com/chrxn)
Based on node-twitter, originally authored by  [@technoweenie](http://github.com/technoweenie)
 and maintained by [@jdub](http://github.com/jdub)
node-twitter is currently maintained by [@desmondmorris](http://github.com/desmondmorris)

## LICENSE

node-wsf: Copyright (c) 2014 Christian Stark

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
