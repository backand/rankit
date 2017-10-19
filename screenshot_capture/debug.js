var util = require('util');
var screenshot = require('./index.js').screenshot;

var events = require('./payload.json');

screenshot(events, {}, function (error, result) {
  if (!error) {
    console.log("success: ", util.format("%j", result));
    process.exit(0);
  }
  else {
    console.log(error);
    process.exit(1);
  }
});


