var Wsf = require('../lib/wsf');

var client = new Wsf({
  api_access_code: '',
  fix_dates: false
});


// Access Vessels API (no params)  -- get /vessellocations
client.vessels.vessellocations(function(error, vessels, response){
  if (!error) {
    console.log(vessels);
  }
});
